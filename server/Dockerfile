# ==============================================================================
# Multi-stage Dockerfile for Rust Backend (Axum + SQLx)
# Resulting image is tiny (<30MB) and production ready
# ==============================================================================

# Stage 1: Build binary
FROM rust:1.77-slim AS builder

WORKDIR /app

# 安装必要的编译依赖 (如 OpenSSL/pkg-config)
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

COPY Cargo.toml Cargo.lock* ./
COPY src ./src

# 编译 release 产物
RUN cargo build --release

# Stage 2: Runtime image
FROM debian:bookworm-slim AS runner

WORKDIR /app

# 运行时仅需 ca-certificates 与基础运行时库
RUN apt-get update && apt-get install -y ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/release/poetry-server /app/poetry-server

ENV PORT=8080
EXPOSE 8080

CMD ["/app/poetry-server"]
