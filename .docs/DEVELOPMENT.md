# Development Guide

This project uses Docker for the local PostgreSQL database, Spring Boot with YAML profiles, and Flyway for database migrations.

## Prerequisites
- Docker + Docker Compose
- Java 21
- Maven (or use the provided `mvnw` wrapper)

## Start the Database
- Start Postgres: `docker compose up -d postgres`
- Check logs: `docker compose logs -f postgres`
- Stop & remove: `docker compose down`
- Recreate clean DB (danger: deletes data): `docker compose down -v && docker compose up -d postgres`

Postgres connection (defaults):
- Host: `localhost`
- Port: `5432`
- DB: `medina`
- User: `medina`
- Password: `medina`

## Spring Boot Configuration (YAML)
- Base config: `backend/src/main/resources/application.yml`
  - JPA `ddl-auto: validate`, Flyway enabled, open-in-view disabled.
- Local profile: `backend/src/main/resources/application-local.yml`
  - Points to the dockerized Postgres.

Activate the local profile:
- IntelliJ Run Configuration: `Backend (local)` (already included), uses `SPRING_PROFILES_ACTIVE=local`.
- CLI: `./mvnw -f backend spring-boot:run -Dspring-boot.run.profiles=local`

## Flyway Migrations
- Location: `backend/src/main/resources/db/migration`
- Applied automatically on app start (with the correct DB configured).
- Baseline: `V1__init.sql` (schema)
- Seed: `V2__seed_demo_data.sql` (demo data)

Create a new migration:
1. Add a file `V<next>__your_change.sql` in the migration folder (PostgreSQL dialect).
2. Keep changes atomic and reversible where feasible.
3. Run the app with `local` profile; Flyway will apply the new migration.

Development tips:
- If you need a clean slate, use `docker compose down -v` to drop volumes, then bring Postgres up again.
- Migrations should be idempotent only where intended; prefer append-only migrations over editing existing ones.
- Use consistent naming for constraints and indexes to aid maintenance.

## Troubleshooting
- Connection refused: ensure Postgres is up (`docker compose ps`) and listening on 5432.
- Auth errors: verify credentials in `application-local.yml` match the compose service.
- Flyway validation errors: ensure your schema aligns with the latest migrations; avoid manual DB edits.

## Notes
- API versioning: moving endpoints under `/api/v1` is planned; adjust clients when introduced.
- Security: Spring Security dependency is present; integration with real auth (e.g., JWT) will replace temporary headers.

