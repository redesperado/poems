use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::PgPool;
use tracing::error;

use crate::models::{Location, Poet, Poem};

#[derive(Clone)]
pub struct AppState {
    pub db: Option<PgPool>, // 允许在无数据库/Mock模式下平滑启动
}

pub fn create_router(state: AppState) -> Router {
    Router::new()
        // 健康检查与元数据
        .route("/health", get(health_check))
        .route("/api/v1/meta", get(get_meta))
        // 文人与诗路
        .route("/api/v1/poets", get(list_poets))
        .route("/api/v1/poets/:id", get(get_poet))
        .route("/api/v1/locations", get(list_locations))
        .route("/api/v1/poems", get(list_poems))
        .route("/api/v1/poems/:id", get(get_poem))
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
            sqlx::query_as::<_, Poet>("SELECT * FROM poets WHERE dynasty = $1 AND status = 'active' ORDER BY sort_order ASC, birth_year ASC")
                .bind(dynasty)
                .fetch_all(pool)
                .await
        } else {
            sqlx::query_as::<_, Poet>("SELECT * FROM poets WHERE status = 'active' ORDER BY sort_order ASC, birth_year ASC")
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
        // 无数据库连接时的备用兜底响应
        Ok(Json(json!({
            "code": 0,
            "data": [],
            "message": "数据库未配置，请检查 DATABASE_URL"
        })))
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
