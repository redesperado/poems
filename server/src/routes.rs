use axum::{
    extract::{Path, Query, State},
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    routing::{delete, get, post},
    Json, Router,
};
use serde::Deserialize;
use serde_json::json;
use sqlx::PgPool;
use tracing::error;
use uuid::Uuid;

use crate::models::{
    Artifact, Encounter, Location, LoginRequest, Poem, PoemStudyRecord, Poet, PoetEvent,
    PoetryNote, PoetryNoteRequest, RegisterRequest, SaveSlotRequest, StudyRecordRequest,
    UpdateProfileRequest, User,
};

#[derive(Clone)]
pub struct AppState {
    pub db: Option<PgPool>,
}

pub fn create_router(state: AppState) -> Router {
    Router::new()
        // 1. 基础监控与系统元数据
        .route("/health", get(health_check))
        .route("/api/v1/meta", get(get_meta))
        // 2. 文人与生平游历
        .route("/api/v1/poets", get(list_poets))
        .route("/api/v1/poets/:id", get(get_poet))
        .route("/api/v1/poets/:id/journey", get(get_poet_journey))
        // 3. 名城舆图
        .route("/api/v1/locations", get(list_locations))
        .route("/api/v1/locations/:id", get(get_location))
        // 4. 传世名篇题库
        .route("/api/v1/poems", get(list_poems))
        .route("/api/v1/poems/:id", get(get_poem))
        // 5. 山河风物
        .route("/api/v1/artifacts", get(list_artifacts))
        .route("/api/v1/artifacts/:id", get(get_artifact))
        // 6. 千古相遇
        .route("/api/v1/encounters", get(list_encounters))
        // 7. 用户认证与雅士档案
        .route("/api/v1/auth/login", post(login))
        .route("/api/v1/auth/register", post(register))
        .route("/api/v1/users", get(list_users))
        .route("/api/v1/users/me", get(get_current_user).put(update_current_user))
        // 8. 多槽位游历存档
        .route("/api/v1/saves", get(list_saves).post(create_or_update_save))
        .route("/api/v1/saves/:id", delete(delete_save))
        // 9. 研学推敲答卷与错题集
        .route("/api/v1/records", get(list_records).post(create_record))
        // 10. 文心墨札笔记
        .route("/api/v1/notes", get(list_notes).post(create_note))
        .route("/api/v1/notes/:id", delete(delete_note))
        .with_state(state)
}

// -----------------------------------------------------------------------------
// 基础监控端点
// -----------------------------------------------------------------------------
async fn health_check() -> impl IntoResponse {
    Json(json!({
        "status": "ok",
        "service": "tang-song-poetry-engine",
        "version": "1.0.0",
        "engine": "Rust (Axum)"
    }))
}

async fn get_meta() -> impl IntoResponse {
    Json(json!({
        "game": "唐宋山河诗境",
        "version": "1.0.0",
        "dynasties": ["tang", "song"],
        "architecture": "Rust + PostgreSQL + Cloudflare Pages/Workers",
        "status": "online"
    }))
}

// -----------------------------------------------------------------------------
// 辅助方法: 从 Header 读取当前雅士 ID
// -----------------------------------------------------------------------------
fn extract_user_id(headers: &HeaderMap) -> String {
    headers
        .get("x-user-id")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("user_01")
        .to_string()
}

// -----------------------------------------------------------------------------
// 文人与游历接口
// -----------------------------------------------------------------------------
#[derive(Deserialize)]
pub struct DynastyQuery {
    pub dynasty: Option<String>,
}

async fn list_poets(
    State(state): State<AppState>,
    Query(query): Query<DynastyQuery>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let poets = if let Some(dynasty) = query.dynasty {
            sqlx::query_as::<_, Poet>(
                "SELECT * FROM poets WHERE dynasty = $1 AND status = 'active' ORDER BY sort_order ASC, birth_year ASC",
            )
            .bind(dynasty)
            .fetch_all(pool)
            .await
        } else {
            sqlx::query_as::<_, Poet>(
                "SELECT * FROM poets WHERE status = 'active' ORDER BY sort_order ASC, birth_year ASC",
            )
            .fetch_all(pool)
            .await
        };

        match poets {
            Ok(list) => Ok(Json(json!({ "code": 0, "data": list }))),
            Err(err) => {
                error!("Database query error: {:?}", err);
                Err((StatusCode::INTERNAL_SERVER_ERROR, "数据库读取失败".into()))
            }
        }
    } else {
        Ok(Json(json!({ "code": 0, "data": [] })))
    }
}

async fn get_poet(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let poet = sqlx::query_as::<_, Poet>("SELECT * FROM poets WHERE id = $1")
            .bind(&id)
            .fetch_optional(pool)
            .await;

        match poet {
            Ok(Some(p)) => Ok(Json(json!({ "code": 0, "data": p }))),
            Ok(None) => Err((StatusCode::NOT_FOUND, "未寻得该文人档案".into())),
            Err(err) => {
                error!("Database query error: {:?}", err);
                Err((StatusCode::INTERNAL_SERVER_ERROR, "数据库查询失败".into()))
            }
        }
    } else {
        Err((StatusCode::SERVICE_UNAVAILABLE, "数据库连接不可用".into()))
    }
}

async fn get_poet_journey(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let poet = sqlx::query_as::<_, Poet>("SELECT * FROM poets WHERE id = $1")
            .bind(&id)
            .fetch_optional(pool)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        let poet = match poet {
            Some(p) => p,
            None => return Err((StatusCode::NOT_FOUND, "未找到文人".into())),
        };

        let events = sqlx::query_as::<_, PoetEvent>(
            "SELECT * FROM poet_events WHERE poet_id = $1 ORDER BY sort_order ASC, year ASC",
        )
        .bind(&id)
        .fetch_all(pool)
        .await
        .unwrap_or_default();

        let poems = sqlx::query_as::<_, Poem>(
            "SELECT * FROM poems WHERE poet_id = $1 ORDER BY year ASC",
        )
        .bind(&id)
        .fetch_all(pool)
        .await
        .unwrap_or_default();

        let artifacts = sqlx::query_as::<_, Artifact>(
            "SELECT * FROM artifacts WHERE poet_exclusive_id = $1",
        )
        .bind(&id)
        .fetch_all(pool)
        .await
        .unwrap_or_default();

        Ok(Json(json!({
            "code": 0,
            "data": {
                "poet": poet,
                "events": events,
                "poems": poems,
                "artifacts": artifacts
            }
        })))
    } else {
        Err((StatusCode::SERVICE_UNAVAILABLE, "数据库未连接".into()))
    }
}

// -----------------------------------------------------------------------------
// 名城舆图接口
// -----------------------------------------------------------------------------
async fn list_locations(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let locations = sqlx::query_as::<_, Location>("SELECT * FROM locations ORDER BY id ASC")
            .fetch_all(pool)
            .await;

        match locations {
            Ok(list) => Ok(Json(json!({ "code": 0, "data": list }))),
            Err(err) => {
                error!("Database query error: {:?}", err);
                Err((StatusCode::INTERNAL_SERVER_ERROR, "名城舆图读取失败".into()))
            }
        }
    } else {
        Ok(Json(json!({ "code": 0, "data": [] })))
    }
}

async fn get_location(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let loc = sqlx::query_as::<_, Location>("SELECT * FROM locations WHERE id = $1")
            .bind(&id)
            .fetch_optional(pool)
            .await;

        match loc {
            Ok(Some(l)) => Ok(Json(json!({ "code": 0, "data": l }))),
            Ok(None) => Err((StatusCode::NOT_FOUND, "未寻得该名城胜迹".into())),
            Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
        }
    } else {
        Err((StatusCode::SERVICE_UNAVAILABLE, "数据库未连接".into()))
    }
}

// -----------------------------------------------------------------------------
// 传世名篇接口
// -----------------------------------------------------------------------------
#[derive(Deserialize)]
pub struct PoemQuery {
    pub poet_id: Option<String>,
}

async fn list_poems(
    State(state): State<AppState>,
    Query(query): Query<PoemQuery>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let poems = if let Some(poet_id) = query.poet_id {
            sqlx::query_as::<_, Poem>("SELECT * FROM poems WHERE poet_id = $1 ORDER BY year ASC")
                .bind(poet_id)
                .fetch_all(pool)
                .await
        } else {
            sqlx::query_as::<_, Poem>("SELECT * FROM poems ORDER BY year ASC")
                .fetch_all(pool)
                .await
        };

        match poems {
            Ok(list) => Ok(Json(json!({ "code": 0, "data": list }))),
            Err(err) => {
                error!("Database query error: {:?}", err);
                Err((StatusCode::INTERNAL_SERVER_ERROR, "诗篇题库读取失败".into()))
            }
        }
    } else {
        Ok(Json(json!({ "code": 0, "data": [] })))
    }
}

async fn get_poem(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let poem = sqlx::query_as::<_, Poem>("SELECT * FROM poems WHERE id = $1")
            .bind(&id)
            .fetch_optional(pool)
            .await;

        match poem {
            Ok(Some(p)) => Ok(Json(json!({ "code": 0, "data": p }))),
            Ok(None) => Err((StatusCode::NOT_FOUND, "未寻得该传世名篇".into())),
            Err(err) => {
                error!("Database query error: {:?}", err);
                Err((StatusCode::INTERNAL_SERVER_ERROR, "数据库查询失败".into()))
            }
        }
    } else {
        Err((StatusCode::SERVICE_UNAVAILABLE, "数据库未连接".into()))
    }
}

// -----------------------------------------------------------------------------
// 山河风物信物接口
// -----------------------------------------------------------------------------
#[derive(Deserialize)]
pub struct ArtifactQuery {
    pub poet_id: Option<String>,
}

async fn list_artifacts(
    State(state): State<AppState>,
    Query(query): Query<ArtifactQuery>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let arts = if let Some(poet_id) = query.poet_id {
            sqlx::query_as::<_, Artifact>(
                "SELECT * FROM artifacts WHERE poet_exclusive_id = $1 ORDER BY id ASC",
            )
            .bind(poet_id)
            .fetch_all(pool)
            .await
        } else {
            sqlx::query_as::<_, Artifact>("SELECT * FROM artifacts ORDER BY id ASC")
                .fetch_all(pool)
                .await
        };

        match arts {
            Ok(list) => Ok(Json(json!({ "code": 0, "data": list }))),
            Err(err) => Err((StatusCode::INTERNAL_SERVER_ERROR, err.to_string())),
        }
    } else {
        Ok(Json(json!({ "code": 0, "data": [] })))
    }
}

async fn get_artifact(
    State(state): State<AppState>,
    Path(id): Path<String>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let art = sqlx::query_as::<_, Artifact>("SELECT * FROM artifacts WHERE id = $1")
            .bind(&id)
            .fetch_optional(pool)
            .await;

        match art {
            Ok(Some(a)) => Ok(Json(json!({ "code": 0, "data": a }))),
            Ok(None) => Err((StatusCode::NOT_FOUND, "未找到该风物信物".into())),
            Err(e) => Err((StatusCode::INTERNAL_SERVER_ERROR, e.to_string())),
        }
    } else {
        Err((StatusCode::SERVICE_UNAVAILABLE, "数据库未连接".into()))
    }
}

// -----------------------------------------------------------------------------
// 千古相遇羁绊接口
// -----------------------------------------------------------------------------
async fn list_encounters(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let encs = sqlx::query_as::<_, Encounter>("SELECT * FROM encounters ORDER BY year ASC")
            .fetch_all(pool)
            .await;

        match encs {
            Ok(list) => Ok(Json(json!({ "code": 0, "data": list }))),
            Err(err) => Err((StatusCode::INTERNAL_SERVER_ERROR, err.to_string())),
        }
    } else {
        Ok(Json(json!({ "code": 0, "data": [] })))
    }
}

// -----------------------------------------------------------------------------
// 用户认证与雅士档案
// -----------------------------------------------------------------------------
async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let user = sqlx::query_as::<_, User>(
            "SELECT * FROM users WHERE (username = $1 OR pen_name = $1) AND status = 'active' ORDER BY level DESC LIMIT 1",
        )
        .bind(&payload.username)
        .fetch_optional(pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        match user {
            Some(u) => Ok(Json(json!({
                "code": 0,
                "data": {
                    "token": format!("mock_jwt_token_{}", u.id),
                    "user": u
                }
            }))),
            None => Err((StatusCode::UNAUTHORIZED, "未寻得该雅号或密码有误".into())),
        }
    } else {
        // Mock fallback for offline dev
        Ok(Json(json!({
            "code": 0,
            "data": {
                "token": "mock_jwt_token_user_01",
                "user": {
                    "id": "user_01",
                    "username": payload.username,
                    "pen_name": "青莲墨客",
                    "avatar_icon": "🪶",
                    "rank_title": "翰林学士",
                    "level": 6,
                    "exp": 4200,
                    "stats": {
                        "travelYears": 42,
                        "poemsStudied": 14,
                        "artifactsCollected": 11,
                        "notesCount": 6
                    }
                }
            }
        })))
    }
}

async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let new_id = format!("usr_{}", Uuid::new_v4().simple());
        let avatar = payload.avatar_icon.unwrap_or_else(|| "📜".to_string());
        let rank = payload.rank_title.unwrap_or_else(|| "童生初入".to_string());
        let meta = payload.metadata.unwrap_or_else(|| json!({
            "stats": {
                "travelYears": 1,
                "poemsStudied": 0,
                "artifactsCollected": 0,
                "notesCount": 0
            },
            "createdAtText": "刚刚结契"
        }));

        let res = sqlx::query_as::<_, User>(
            r#"INSERT INTO users (id, username, password_hash, pen_name, avatar_icon, rank_title, metadata)
               VALUES ($1, $2, 'argon2_mock', $3, $4, $5, $6)
               RETURNING *"#,
        )
        .bind(&new_id)
        .bind(&payload.username)
        .bind(&payload.pen_name)
        .bind(&avatar)
        .bind(&rank)
        .bind(&meta)
        .fetch_one(pool)
        .await
        .map_err(|e| (StatusCode::BAD_REQUEST, format!("注册结契失败: {}", e)))?;

        Ok(Json(json!({
            "code": 0,
            "data": {
                "token": format!("mock_jwt_token_{}", res.id),
                "user": res
            }
        })))
    } else {
        Ok(Json(json!({
            "code": 0,
            "data": {
                "token": "mock_jwt_token_new",
                "user": {
                    "id": "user_new",
                    "username": payload.username,
                    "pen_name": payload.pen_name,
                    "avatar_icon": payload.avatar_icon.unwrap_or_else(|| "📜".to_string()),
                    "rank_title": "童生初入",
                    "level": 1,
                    "exp": 100,
                    "stats": {
                        "travelYears": 1,
                        "poemsStudied": 0,
                        "artifactsCollected": 0,
                        "notesCount": 0
                    }
                }
            }
        })))
    }
}

async fn list_users(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    if let Some(pool) = &state.db {
        let users = sqlx::query_as::<_, User>(
            "SELECT * FROM users WHERE status = 'active' ORDER BY level DESC, exp DESC",
        )
        .fetch_all(pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        Ok(Json(json!({ "code": 0, "data": users })))
    } else {
        Ok(Json(json!({ "code": 0, "data": [] })))
    }
}

async fn get_current_user(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let user_id = extract_user_id(&headers);
    if let Some(pool) = &state.db {
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1")
            .bind(&user_id)
            .fetch_optional(pool)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        match user {
            Some(u) => Ok(Json(json!({ "code": 0, "data": u }))),
            None => Err((StatusCode::NOT_FOUND, "未寻得该雅士".into())),
        }
    } else {
        Ok(Json(json!({
            "code": 0,
            "data": {
                "id": "user_01",
                "username": "qinglian_moke",
                "pen_name": "青莲墨客",
                "avatar_icon": "🪶",
                "rank_title": "翰林学士",
                "level": 6,
                "exp": 4200
            }
        })))
    }
}

async fn update_current_user(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<UpdateProfileRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let user_id = extract_user_id(&headers);
    if let Some(pool) = &state.db {
        let user = sqlx::query_as::<_, User>(
            r#"UPDATE users
               SET pen_name = COALESCE($1, pen_name),
                   avatar_icon = COALESCE($2, avatar_icon),
                   preferences = COALESCE($3, preferences),
                   metadata = COALESCE($4, metadata)
               WHERE id = $5
               RETURNING *"#,
        )
        .bind(payload.pen_name)
        .bind(payload.avatar_icon)
        .bind(payload.preferences)
        .bind(payload.metadata)
        .bind(&user_id)
        .fetch_one(pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        Ok(Json(json!({ "code": 0, "data": user })))
    } else {
        Ok(Json(json!({ "code": 0, "message": "已更新（离线模拟）" })))
    }
}

// -----------------------------------------------------------------------------
// 多槽位游历存档接口 (journey_saves)
// -----------------------------------------------------------------------------
async fn list_saves(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let user_id = extract_user_id(&headers);
    if let Some(pool) = &state.db {
        let saves = sqlx::query_as::<_, crate::models::JourneySave>(
            "SELECT * FROM journey_saves WHERE user_id = $1 ORDER BY slot_index ASC",
        )
        .bind(&user_id)
        .fetch_all(pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        Ok(Json(json!({ "code": 0, "data": saves })))
    } else {
        Ok(Json(json!({ "code": 0, "data": [] })))
    }
}

async fn create_or_update_save(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<SaveSlotRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let user_id = extract_user_id(&headers);
    let slot_index = payload.slot_index.unwrap_or(1);
    let save_id = format!("save_{}_slot{}", user_id, slot_index);

    if let Some(pool) = &state.db {
        let save = sqlx::query_as::<_, crate::models::JourneySave>(
            r#"INSERT INTO journey_saves (
                id, user_id, slot_index, slot_name, poet_id, current_year,
                current_location_id, mood, unlocked_poem_ids, poem_scores,
                unlocked_artifact_ids, unlocked_bond_ids, completed_event_ids,
                choices_made, journey_logs, game_state, is_active
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8,
                COALESCE($9, '[]'::jsonb), COALESCE($10, '{}'::jsonb),
                COALESCE($11, '[]'::jsonb), COALESCE($12, '[]'::jsonb),
                COALESCE($13, '[]'::jsonb), COALESCE($14, '{}'::jsonb),
                COALESCE($15, '[]'::jsonb), COALESCE($16, '{}'::jsonb),
                COALESCE($17, true)
            )
            ON CONFLICT (user_id, slot_index) DO UPDATE SET
                slot_name = EXCLUDED.slot_name,
                poet_id = EXCLUDED.poet_id,
                current_year = EXCLUDED.current_year,
                current_location_id = EXCLUDED.current_location_id,
                mood = EXCLUDED.mood,
                unlocked_poem_ids = EXCLUDED.unlocked_poem_ids,
                poem_scores = EXCLUDED.poem_scores,
                unlocked_artifact_ids = EXCLUDED.unlocked_artifact_ids,
                unlocked_bond_ids = EXCLUDED.unlocked_bond_ids,
                completed_event_ids = EXCLUDED.completed_event_ids,
                choices_made = EXCLUDED.choices_made,
                journey_logs = EXCLUDED.journey_logs,
                game_state = EXCLUDED.game_state,
                is_active = EXCLUDED.is_active
            RETURNING *"#,
        )
        .bind(&save_id)
        .bind(&user_id)
        .bind(slot_index)
        .bind(&payload.slot_name)
        .bind(&payload.poet_id)
        .bind(payload.current_year)
        .bind(&payload.current_location_id)
        .bind(payload.mood)
        .bind(payload.unlocked_poem_ids)
        .bind(payload.poem_scores)
        .bind(payload.unlocked_artifact_ids)
        .bind(payload.unlocked_bond_ids)
        .bind(payload.completed_event_ids)
        .bind(payload.choices_made)
        .bind(payload.journey_logs)
        .bind(payload.game_state)
        .bind(payload.is_active)
        .fetch_one(pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        Ok(Json(json!({ "code": 0, "data": save })))
    } else {
        Ok(Json(json!({ "code": 0, "data": { "id": save_id, "status": "mock_saved" } })))
    }
}

async fn delete_save(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<String>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let user_id = extract_user_id(&headers);
    if let Some(pool) = &state.db {
        let result = sqlx::query("DELETE FROM journey_saves WHERE id = $1 AND user_id = $2")
            .bind(&id)
            .bind(&user_id)
            .execute(pool)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        if result.rows_affected() > 0 {
            Ok(Json(json!({ "code": 0, "message": "存档已抹除" })))
        } else {
            Err((StatusCode::NOT_FOUND, "未找到该存档或无权删除".into()))
        }
    } else {
        Ok(Json(json!({ "code": 0, "message": "删除成功（离线模拟）" })))
    }
}

// -----------------------------------------------------------------------------
// 研学推敲答卷与错题集 (poem_study_records)
// -----------------------------------------------------------------------------
async fn list_records(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let user_id = extract_user_id(&headers);
    if let Some(pool) = &state.db {
        let records = sqlx::query_as::<_, PoemStudyRecord>(
            "SELECT * FROM poem_study_records WHERE user_id = $1 ORDER BY completed_at DESC",
        )
        .bind(&user_id)
        .fetch_all(pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        Ok(Json(json!({ "code": 0, "data": records })))
    } else {
        Ok(Json(json!({ "code": 0, "data": [] })))
    }
}

async fn create_record(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<StudyRecordRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let user_id = extract_user_id(&headers);
    let record_id = format!("rec_{}", Uuid::new_v4().simple());

    if let Some(pool) = &state.db {
        let record = sqlx::query_as::<_, PoemStudyRecord>(
            r#"INSERT INTO poem_study_records (
                id, user_id, save_slot_id, poem_id, mode, score, grade, duration_seconds, mistakes, extra_data
            ) VALUES (
                $1, $2, $3, $4, COALESCE($5, 'assembly'), $6, $7, $8,
                COALESCE($9, '[]'::jsonb), COALESCE($10, '{}'::jsonb)
            ) RETURNING *"#,
        )
        .bind(&record_id)
        .bind(&user_id)
        .bind(payload.save_slot_id)
        .bind(payload.poem_id)
        .bind(payload.mode)
        .bind(payload.score)
        .bind(payload.grade)
        .bind(payload.duration_seconds)
        .bind(payload.mistakes)
        .bind(payload.extra_data)
        .fetch_one(pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        Ok(Json(json!({ "code": 0, "data": record })))
    } else {
        Ok(Json(json!({ "code": 0, "data": { "id": record_id, "score": payload.score } })))
    }
}

// -----------------------------------------------------------------------------
// 文心墨札笔记 (poetry_notes)
// -----------------------------------------------------------------------------
async fn list_notes(
    State(state): State<AppState>,
    headers: HeaderMap,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let user_id = extract_user_id(&headers);
    if let Some(pool) = &state.db {
        let notes = sqlx::query_as::<_, PoetryNote>(
            "SELECT * FROM poetry_notes WHERE user_id = $1 ORDER BY updated_at DESC",
        )
        .bind(&user_id)
        .fetch_all(pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        Ok(Json(json!({ "code": 0, "data": notes })))
    } else {
        Ok(Json(json!({ "code": 0, "data": [] })))
    }
}

async fn create_note(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<PoetryNoteRequest>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let user_id = extract_user_id(&headers);
    let note_id = format!("note_{}", Uuid::new_v4().simple());

    if let Some(pool) = &state.db {
        let note = sqlx::query_as::<_, PoetryNote>(
            r#"INSERT INTO poetry_notes (
                id, user_id, poem_id, poet_id, location_id, title, content, tags, bookmark_style, metadata
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7,
                COALESCE($8, '[]'::jsonb), COALESCE($9, '{}'::jsonb), COALESCE($10, '{}'::jsonb)
            ) RETURNING *"#,
        )
        .bind(&note_id)
        .bind(&user_id)
        .bind(payload.poem_id)
        .bind(payload.poet_id)
        .bind(payload.location_id)
        .bind(payload.title)
        .bind(payload.content)
        .bind(payload.tags)
        .bind(payload.bookmark_style)
        .bind(payload.metadata)
        .fetch_one(pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        Ok(Json(json!({ "code": 0, "data": note })))
    } else {
        Ok(Json(json!({ "code": 0, "data": { "id": note_id, "title": payload.title } })))
    }
}

async fn delete_note(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<String>,
) -> Result<Json<serde_json::Value>, (StatusCode, String)> {
    let user_id = extract_user_id(&headers);
    if let Some(pool) = &state.db {
        let result = sqlx::query("DELETE FROM poetry_notes WHERE id = $1 AND user_id = $2")
            .bind(&id)
            .bind(&user_id)
            .execute(pool)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

        if result.rows_affected() > 0 {
            Ok(Json(json!({ "code": 0, "message": "札记随笔已删除" })))
        } else {
            Err((StatusCode::NOT_FOUND, "未找到该札记或无权删除".into()))
        }
    } else {
        Ok(Json(json!({ "code": 0, "message": "删除成功（离线模拟）" })))
    }
}
