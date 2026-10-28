use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod db;
mod models;
mod routes;

use config::AppConfig;
use routes::{create_router, AppState};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // 1. 初始化结构化日志
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,poetry_server=debug,tower_http=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // 2. 加载环境配置
    let config = AppConfig::from_env();
    info!("Starting Tang-Song Poetry Game Rust Backend on port {}", config.server_port);

    // 3. 尝试连接 PostgreSQL 数据库 (支持连接失败时降级运行并提示)
    let db_pool = match db::create_pool(&config.database_url).await {
        Ok(pool) => {
            info!("PostgreSQL connection established successfully.");
            Some(pool)
        }
        Err(err) => {
            tracing::warn!(
                "Failed to connect to PostgreSQL ({}). Running in offline fallback mode.",
                err
            );
            None
        }
    };

    // 4. 构建跨域支持与路由层
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let state = AppState { db: db_pool };
    let app = create_router(state)
        .layer(cors)
        .layer(TraceLayer::new_for_http());

    // 5. 绑定端口并启动异步服务
    let addr = SocketAddr::from(([0, 0, 0, 0], config.server_port));
    info!("Poetry Server listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
