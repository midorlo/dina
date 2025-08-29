# Globale Verhaltensvorschriften

- Bitte führe den folgenden Befehl aus, wenn du auf die Interaktion des Anwenders angewiesen bist, um diesen darauf
  Aufmerksam zu machen:
  ``powershell -c "[System.Media.SystemSounds]::Asterisk.Play()"``
- Bitte weise zu Beginn jedes Gespräches darauf hin, das du diese Datei AGENTS.md gelesen hast, und nenne das Datum
  ihrer letzten Änderung.

## Synonyme Anweisungen

- "Committen": Wenn ich dich bitte zu comitten, dann sollst du: Den Diff prüfen und überlegen, ob wir ihn in einem oder
  mehreren
  Commits absetzen sollten. Falls sinnvoll, mehrere Commits machen.

- "Vorschlagen": Wenn ich dich bitte, etwas vorzuschlagen, dann meine ich damit immer, dass du eine Analyse wie
  gefordert erstellst,
  einen Vorgehensvorschlag ausarbeitest und diesen als Markdown-Dokument an geeigneter Stelle ablegst. Lege diese unter
  .docs mit einem angemessenen Dateinamen ab.

- "todos abarbeiten": Wenn ich dich bitte, "die todos abzuarbeiten", dann meine ich damit das du unter .docs/todo.md
  nachschaust, ob irgendwas in der file steht. Falls ja, bearbeite was dort gefordert wird, und entferne das todo
  anschliessend aus der datei.

# Repository-Richtlinien

Nutze diesen Leitfaden, um effizient in diesem Repository zu arbeiten. Halte Änderungen klein, fokussiert und konsistent
zu bestehenden Mustern.

## Projektstruktur & Module

- Root: `frontend/` (Vue 3 + Vite) und `backend/` (Spring Boot).
- Frontend: Quellcode unter `frontend/src` (pages, components, stores, router, services), statische Dateien in
  `frontend/public`.
- Backend: Java-Quellcode in `backend/src/main/java`, Ressourcen in `backend/src/main/resources`, Tests in
  `backend/src/test/java`.

## Build-, Test- und Entwicklungsbefehle

- Frontend-Entwicklung: `cd frontend && npm run dev` — startet Vite Dev-Server.
- Frontend-Build: `npm run build` — Typprüfung + Produktions-Build; CI: `npm run build:ci`.
- Lint/Formatierung: `npm run lint` und `npm run format`.
- Backend starten: `cd backend && ./mvnw spring-boot:run` (Windows: `mvnw.cmd ...`).
- Backend-Tests: `./mvnw test`; Paket bauen: `./mvnw package -DskipTests`.

## Coding Style & Benennung

- Frontend: Prettier (2 Leerzeichen, einfache Anführungszeichen, Semikolons, Breite 120, LF). ESLint für Vue 3/TS (
  Vuetify + scoped CSS). TypeScript strict.
- Backend: Java 21, Standard-Spring-Konventionen; Controller/Services klein und kohärent halten. Zeilenenden via
  `.gitattributes` normalisiert.
- Namen: kebab-case für Dateien/Routes, PascalCase für Vue-Komponenten, camelCase für Variablen/Funktionen.

## Test-Richtlinien

- Backend: JUnit via `spring-boot-starter-test`; ausführen mit `./mvnw test`. Services und Web-Layer abdecken.
- Frontend: Keine Unit-Tests vorhanden; rely on `npm run type-check` und ESLint. Bei neuen Tests: Vitest + Vue Test
  Utils, `*.spec.ts` nicht nah an den Quellen, sondern in einer spiegelung der ordnerstruktur von src innerhalb eines
- test ordners (um mit der Struktur von java harmonisch zu sein)

## Commits & Pull Requests

- Conventional Commits: `feat(scope): summary`, `fix(frontend): ...`, `chore(ui): ...`. Betreff im Imperativ und
  prägnant halten.
- PRs: Klare Beschreibung, Issues verlinken, UI-Screenshots beilegen und Breaking Changes vermerken. Vorher lokal
  sicherstellen, dass `npm run build:ci` und `./mvnw test` erfolgreich laufen.

## Sicherheit & Konfiguration

- Keine Secrets committen. Nutze `frontend/.env` und `backend/src/main/resources/application.properties` lokal.
- Frontend: HTML wird via DOMPurify sanitisiert; Sentry-Init ist durch DSN abgesichert. Auth-Tokens werden nicht
  langfristig gespeichert—dieses Verhalten beibehalten.

# KI-Richtlinien

## Vuejs

- Vue Router Composition API (`useRouter`, `useRoute`) verwenden, statt alte Globals wie `$router` oder `$route`.
- Moderne Vue-3-Patterns bevorzugen und auf veraltete APIs verzichten.

# Stilkonventionen für den Assistenten

- Letzter Satz: immer fett darstellen.
- Abstand: Vor dem letzten Satz eine Leerzeile einfügen.
- Farbe: Bevorzugt dunkelgrün. Da die CLI keine Farbcodes erzwingt und ANSI-Codes nicht genutzt werden sollen, bleibt
  die Farbwahl dem Renderer überlassen.


# Hinweise zur Umgebung

- Keine ANSI-Farbcodes direkt ausgeben; CLI steuert die Darstellung.
- Kurze, prägnante Antworten; Struktur nur, wenn sie den Überblick verbessert.
- Letzter Satz in fett (mit Leerzeile davor), Farbe wenn von der Oberfläche unterstützt dunkelgrün. Damit soll sie
  Lesbarkeit erhöht werden, und erkennbarer sein, das deine Interaktion abgeschlossen ist.

