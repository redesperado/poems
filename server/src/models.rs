use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_json::Value as JsonValue;

// -----------------------------------------------------------------------------
// 1. 文人档案模型
// -----------------------------------------------------------------------------
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Poet {
    pub id: String,
    pub name: String,
    pub dynasty: String,
    pub courtesy_name: Option<String>,
    pub art_name: Option<String>,
    pub title: String,
    pub birth_year: i32,
    pub death_year: i32,
    pub birth_place: String,
    pub avatar_url: String,
    pub portrait_url: String,
    pub quotes: JsonValue,
    pub biography: String,
    pub start_location_id: String,
    pub start_year: i32,
    pub initial_mood: JsonValue,
    pub attributes: JsonValue,
    pub metadata: JsonValue,
    pub status: String,
    pub sort_order: i32,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

// -----------------------------------------------------------------------------
// 2. 名城舆图模型
// -----------------------------------------------------------------------------
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Location {
    pub id: String,
    pub name: String,
    pub modern_name: String,
    pub dynasty: String,
    pub dynasty_names: JsonValue,
    pub lat: f64,
    pub lng: f64,
    pub province: String,
    pub description: String,
    pub historical_importance: String,
    pub specialty_artifact_id: Option<String>,
    pub scenery_tags: JsonValue,
    pub metadata: JsonValue,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

// -----------------------------------------------------------------------------
// 3. 传世名篇模型
// -----------------------------------------------------------------------------
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Poem {
    pub id: String,
    pub poet_id: String,
    pub title: String,
    pub dynasty: String,
    pub year: Option<i32>,
    pub location_id: Option<String>,
    pub form: String,
    pub background: String,
    pub paragraphs: JsonValue,
    pub blanks: JsonValue,
    pub pedagogy: JsonValue,
    pub tags: JsonValue,
    pub audio_url: Option<String>,
    pub audio_config: JsonValue,
    pub metadata: JsonValue,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

// -----------------------------------------------------------------------------
// 4. 人生年谱与重大纪事模型
// -----------------------------------------------------------------------------
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct PoetEvent {
    pub id: String,
    pub poet_id: String,
    pub year: i32,
    pub location_id: Option<String>,
    pub title: String,
    pub event_type: Option<String>,
    pub historical_context: Option<String>,
    pub narrative: String,
    pub triggered_poem_id: Option<String>,
    pub triggered_choice_id: Option<String>,
    pub triggered_encounter_id: Option<String>,
    pub choices: JsonValue,
    pub mood_impact: JsonValue,
    pub requirements: JsonValue,
    pub metadata: JsonValue,
    pub sort_order: Option<i32>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

// -----------------------------------------------------------------------------
// 5. 山河风物信物模型
// -----------------------------------------------------------------------------
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Artifact {
    pub id: String,
    pub name: String,
    pub category: String,
    pub rarity: String,
    pub description: String,
    pub historical_story: Option<String>,
    pub icon: Option<String>,
    pub poet_exclusive_id: Option<String>,
    pub city_origin_id: Option<String>,
    pub buffs: JsonValue,
    pub metadata: JsonValue,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

// -----------------------------------------------------------------------------
// 6. 千古相遇羁绊模型
// -----------------------------------------------------------------------------
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Encounter {
    pub id: String,
    pub primary_poet_id: String,
    pub secondary_poet_id: String,
    pub year: i32,
    pub location_id: Option<String>,
    pub title: String,
    pub description: Option<String>,
    pub dialogues: JsonValue,
    pub gift_poem_id: Option<String>,
    pub bond_seal: JsonValue,
    pub metadata: JsonValue,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

// -----------------------------------------------------------------------------
// 7. 用户账户模型
// -----------------------------------------------------------------------------
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct User {
    pub id: String,
    pub username: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub pen_name: String,
    pub avatar_icon: String,
    pub rank_title: String,
    pub level: i32,
    pub exp: i64,
    pub status: String,
    pub preferences: JsonValue,
    pub metadata: JsonValue,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

// -----------------------------------------------------------------------------
// 8. 游历多槽位存档模型
// -----------------------------------------------------------------------------
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct JourneySave {
    pub id: String,
    pub user_id: String,
    pub slot_index: i32,
    pub slot_name: String,
    pub poet_id: String,
    pub current_year: i32,
    pub current_location_id: String,
    pub mood: JsonValue,
    pub unlocked_poem_ids: JsonValue,
    pub poem_scores: JsonValue,
    pub unlocked_artifact_ids: JsonValue,
    pub unlocked_bond_ids: JsonValue,
    pub completed_event_ids: JsonValue,
    pub choices_made: JsonValue,
    pub journey_logs: JsonValue,
    pub game_state: JsonValue,
    pub is_active: bool,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

// -----------------------------------------------------------------------------
// 9. 诗词推敲默写答卷模型
// -----------------------------------------------------------------------------
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct PoemStudyRecord {
    pub id: String,
    pub user_id: String,
    pub save_slot_id: Option<String>,
    pub poem_id: String,
    pub mode: String,
    pub score: i32,
    pub grade: String,
    pub duration_seconds: i32,
    pub mistakes: JsonValue,
    pub extra_data: JsonValue,
    pub completed_at: Option<DateTime<Utc>>,
}

// -----------------------------------------------------------------------------
// 10. 文心墨札随笔模型
// -----------------------------------------------------------------------------
#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct PoetryNote {
    pub id: String,
    pub user_id: String,
    pub poem_id: Option<String>,
    pub poet_id: Option<String>,
    pub location_id: Option<String>,
    pub title: String,
    pub content: String,
    pub tags: JsonValue,
    pub bookmark_style: JsonValue,
    pub metadata: JsonValue,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

// -----------------------------------------------------------------------------
// 前端请求与传输 DTO
// -----------------------------------------------------------------------------
#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub pen_name: String,
    pub password: Option<String>,
    pub avatar_icon: Option<String>,
    pub rank_title: Option<String>,
    pub metadata: Option<JsonValue>,
}

#[derive(Debug, Deserialize)]
pub struct SaveSlotRequest {
    pub slot_index: Option<i32>,
    pub slot_name: String,
    pub poet_id: String,
    pub current_year: i32,
    pub current_location_id: String,
    pub mood: JsonValue,
    pub unlocked_poem_ids: Option<JsonValue>,
    pub poem_scores: Option<JsonValue>,
    pub unlocked_artifact_ids: Option<JsonValue>,
    pub unlocked_bond_ids: Option<JsonValue>,
    pub completed_event_ids: Option<JsonValue>,
    pub choices_made: Option<JsonValue>,
    pub journey_logs: Option<JsonValue>,
    pub game_state: Option<JsonValue>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct StudyRecordRequest {
    pub save_slot_id: Option<String>,
    pub poem_id: String,
    pub mode: Option<String>,
    pub score: i32,
    pub grade: String,
    pub duration_seconds: i32,
    pub mistakes: Option<JsonValue>,
    pub extra_data: Option<JsonValue>,
}

#[derive(Debug, Deserialize)]
pub struct PoetryNoteRequest {
    pub poem_id: Option<String>,
    pub poet_id: Option<String>,
    pub location_id: Option<String>,
    pub title: String,
    pub content: String,
    pub tags: Option<JsonValue>,
    pub bookmark_style: Option<JsonValue>,
    pub metadata: Option<JsonValue>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateProfileRequest {
    pub pen_name: Option<String>,
    pub avatar_icon: Option<String>,
    pub preferences: Option<JsonValue>,
    pub metadata: Option<JsonValue>,
}
