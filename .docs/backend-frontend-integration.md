# Backend/Frontend Integration Guidelines

Dieser Vorschlag beschreibt, wie die Vue-3-Frontend- und Spring-Boot-Backend-Komponenten zusammenspielen sollen. Im Fokus stehen Authentifizierung, API-Endpunkte und Fehlerbehandlung.

## Authentifizierung
- JWT-basierte, zustandslose Authentifizierung
- Endpunkte: `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`, `POST /api/v1/auth/logout`
- Access-Token kurzlebig, Refresh-Token länger; Speicherung in HTTP-only-Cookies
- `Authorization: Bearer <token>` für geschützte Requests
- Rollen/Permissions: Backend vergibt Claims, Frontend prüft über `authStore`
- Automatisches Refresh bei 401, danach Retry des ursprünglichen Requests

## API-Endpunkte
- Versionierung über Präfix `/api/v1/`
- REST-Konventionen: Substantive im Plural, HTTP-Methoden als Aktionen
- Beispiele: `GET /api/v1/users`, `POST /api/v1/blogs`, `GET /api/v1/blogs/{id}`
- Benutzerkontext aus JWT-Claims statt zusätzlichen Headern
- OpenAPI/Swagger-Dokumentation zur Synchronisation von Frontend und Backend

## Fehlerbehandlung
### Backend
- Zentrale `@ControllerAdvice` mit `@ExceptionHandler`
- Rückgabe im Problem-Details-Format (RFC 7807): `type`, `title`, `status`, `detail`, `instance`
- Mapping: Validierungsfehler → 400, Authentifizierung → 401, Autorisierung → 403 usw.
- Unerwartete Fehler mit eindeutiger ID loggen

### Frontend
- `apiFetch` parst Fehler-JSON und wirft typisierte Fehler
- Globale Fehlerverarbeitung (Store/Plugin) für Benachrichtigungen oder Redirects (`/error/401`, `/error/403`, `/error/500`)
- Retry bei Netzwerkfehlern oder nach Token-Refresh

## Nächste Schritte
- Refresh-Token-Endpunkt und Client-Logik implementieren
- `ControllerAdvice` und Fehler-DTO erstellen
- `apiFetch` um JSON-Parsing und strukturierte Fehler erweitern
