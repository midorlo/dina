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
- IntelliJ Run Configuration: `Backend (local)` (already included), uses the "Active Profiles" field set to `local`.
- CLI: `./mvnw -f backend spring-boot:run -Dspring-boot.run.profiles=local`

## IntelliJ Run Configurations
- Dev: `Dev: Full Stack` (Compound): starts DB → Backend (local) → Frontend: dev.
- Backend: `Backend (local)`: runs Spring Boot with profile `local` (no DB prelaunch).
- Frontend: `Frontend: dev`: runs Vite dev server (backend optional).
- Dev: `Dev: down` (Compound): stops the DB via docker-compose down.

Groups for clarity:
- Infra: `DB: Postgres (Compose)`, `DB: Postgres (Compose) down` (low-level Compose control).
- Build: `Frontend: build`, `Frontend: preview` (CI-like build and local preview).

Tip: Use the Dev group for day-to-day; Infra and Build are optional utilities.

## IntelliJ: Quick Links
- Run/Debug configs: https://www.jetbrains.com/help/idea/run-debug-configurations.html
- Compound configs: https://www.jetbrains.com/help/idea/creating-compound-run-debug-configuration.html
- Docker Compose config: https://www.jetbrains.com/help/idea/run-debug-configuration-docker-compose.html
- npm config: https://www.jetbrains.com/help/idea/run-debug-configuration-npm.html
- Spring Boot run/debug: https://www.jetbrains.com/help/idea/spring-boot.html#run-debug
- HTTP Client basics: https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html
- HTTP environments: https://www.jetbrains.com/help/idea/exploring-http-syntax.html#environments

## Where To Click (IntelliJ)
- Open Run/Debug configs: toolbar Run dropdown → Edit Configurations…
- Start Full Stack: choose `Dev: Full Stack` → Run.
- Start services einzeln:
  - DB: Infra → `DB: Postgres (Compose)` → Run (detached).
  - Backend: Dev → `Backend (local)` → Run.
  - Frontend: Dev → `Frontend: dev` → Run.
- Stop Stack: Dev → `Dev: down` → Run.
- HTTP Client Env: open `backend/src/test/http/api.http` → rechts oben Environment auswählen (z. B. `local`).

Note on screenshots
- Falls ihr Screenshots hinzufügen wollt, legt sie unter `.docs/images/` ab und referenziert sie in diesem Dokument, z. B.:
  - `![Run Config Dropdown](./images/run-config-dropdown.png)`
  - `![Edit Configurations](./images/edit-configurations.png)`

## HTTP Client (IntelliJ)
- Requests: `backend/src/test/http/api.http` covers users, blogs, conversations, notifications, photos, profiles.
- Environments: `backend/src/test/http/http-client.env.json` with variables:
  - `baseUrl`: e.g., `http://localhost:8080`
  - `userId`: e.g., `1` (used for endpoints requiring `X-User-Id`)
  - `token`: bearer token if/when auth is enabled (empty by default)
- Usage: Open `api.http` in IntelliJ, pick environment "local" (or "docker"), then run requests. Conversations and notifications require header `X-User-Id` which is templated as `{{userId}}`. An `Authorization: Bearer {{token}}` header is included across requests and will be effective once auth is implemented.
- Tip: When a login endpoint exists, you can capture the token in a pre-response script and store it in `client.global` (see commented example in `api.http`).

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
