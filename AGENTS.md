# Repository Guidelines

Use this guide to work effectively in this repository. Keep changes small, focused, and consistent with existing patterns.

## Project Structure & Modules

- Root: `frontend/` (Vue 3 + Vite) and `backend/` (Spring Boot).
- Frontend: source under `frontend/src` (pages, components, stores, router, services), static in `frontend/public`.
- Backend: Java sources in `backend/src/main/java`, resources in `backend/src/main/resources`, tests in `backend/src/test/java`.

## Build, Test, and Development Commands

- Frontend dev: `cd frontend && npm run dev` — start Vite dev server.
- Frontend build: `npm run build` — type-check + production build; CI: `npm run build:ci`.
- Lint/format: `npm run lint` and `npm run format`.
- Backend run: `cd backend && ./mvnw spring-boot:run` (Windows: `mvnw.cmd ...`).
- Backend tests: `./mvnw test`; package: `./mvnw package -DskipTests`.

## Coding Style & Naming

- Frontend: Prettier (2 spaces, single quotes, semicolons, width 120, LF). ESLint for Vue 3/TS (Vuetify + scoped CSS configs). TypeScript strict.
- Backend: Java 21, standard Spring conventions; keep controllers/services small and cohesive. Line endings normalized via `.gitattributes`.
- Names: kebab-case for files/routes, PascalCase for Vue components, camelCase for variables/functions.

## Testing Guidelines

- Backend: JUnit via `spring-boot-starter-test`; run with `./mvnw test`. Cover services and web layers.
- Frontend: no unit tests present; rely on `npm run type-check` and ESLint. If adding tests, prefer Vitest + Vue Test Utils, `*.spec.ts` near sources.

## Commit & Pull Requests

- Conventional Commits: `feat(scope): summary`, `fix(frontend): ...`, `chore(ui): ...`. Keep subjects imperative and concise.
- PRs: clear description, link issues, include UI screenshots, and note breaking changes. Ensure `npm run build:ci` and `./mvnw test` pass locally.

## Security & Config Tips

- Do not commit secrets. Use `frontend/.env` and `backend/src/main/resources/application.properties` locally.
- Frontend sanitizes HTML via DOMPurify; Sentry initialization is guarded by DSN. Auth tokens are not persisted long-term—keep that behavior.

# AI Guidelines

- Use the Vue Router Composition API (`useRouter`, `useRoute`) instead of legacy globals like `$router` or `$route`.
- Prefer modern Vue 3 patterns and avoid relying on deprecated APIs.

# Assistant Style Conventions

- Letzter Satz: immer fett darstellen.
- Abstand: Vor dem letzten Satz eine Leerzeile einfügen.
- Farbe: Bevorzugt dunkelgrün. Da die CLI keine Farbcodes erzwingt und ANSI-Codes nicht verwendet werden sollen, bleibt die Farbwahl dem Renderer vorbehalten.

Hinweise zur Umgebung

- Keine ANSI-Farbcodes direkt ausgeben; die CLI steuert die Darstellung.
- Kurze, prägnante Antworten; nur dort strukturieren, wo es den Überblick verbessert.

Beispiel

Normale Antwortinhalte und ggf. kurze Aufzählungen zur Übersicht.

**Letzter Satz in fett (mit Leerzeile davor), Farbe wenn von der Oberfläche unterstützt dunkelgrün.**

## Synonyme Anweisungen

- Wenn ich dich bitte zu comitten, dann sollst du: Den diff anschauen und überlegen, ob wir das in einem , oder mehreren commits absetzen sollten. Falls es sinn macht, mach mehrere commits.

- Wenn ich dich bitte, etwas vorzuschlagen, dann meine ich damit immer, das du eine Analyse wie gefordert betreiben sollst, einen
  Vorgehensvorschlag ausarbeitest, und diesen als markdown dokument an geeigneter stelle ablegst.
