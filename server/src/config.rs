use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub database_url: String,
    pub server_port: u16,
    pub cors_origin: String,
}

impl AppConfig {
    pub fn from_env() -> Self {
        dotenvy::dotenv().ok();

        let database_url = env::var("DATABASE_URL").unwrap_or_else(|_| {
            "postgres://postgres:postgres@localhost:5432/tang_song_poems".to_string()
        });

        let server_port = env::var("PORT")
            .ok()
            .and_then(|p| p.parse().ok())
            .unwrap_or(8080);

        let cors_origin = env::var("CORS_ORIGIN").unwrap_or_else(|_| "*".to_string());

        Self {
            database_url,
            server_port,
            cors_origin,
        }
    }
}
