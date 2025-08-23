# Backend API Planung

Dieser Plan beschreibt die geplanten Backend-Endpunkte, die den aktuellen Mock-Services des Frontends entsprechen.

## Authentifizierung
- `POST /api/login` – Benutzeranmeldung, liefert Benutzerinformationen und Tokens.

## Nachrichten
- `GET /api/conversations` – Liste aller Konversationen.
- `GET /api/conversations/{id}` – Details einer Konversation inklusive Nachrichtenverlauf.
- `GET /api/conversations/{conversationId}/messages/{messageId}` – Einzelne Nachricht einer Konversation.

## Benachrichtigungen
- `GET /api/notifications` – Liste der Benachrichtigungen des aktuellen Nutzers.

## Blogs
- `GET /api/blogs` – Alle Blogs abrufen.
- `GET /api/blogs/{id}` – Details zu einem Blog.
- `GET /api/blogs/{blogId}/posts` – Beiträge eines Blogs.
- `GET /api/blogs/{blogId}/posts/{postId}` – Details zu einem einzelnen Beitrag.

## Nutzer & Profile
- `GET /api/users/{userId}/profile` – Profilinformationen zu einem Nutzer.
- `GET /api/profiles` – Liste aller Profile.
- `GET /api/profiles/{id}` – Einzelnes Profil abrufen.
- `PUT /api/profiles/{id}` – Profil aktualisieren (authentifizierter Zugriff erforderlich).

## Fotos
- `GET /api/photos` – Galerie mit Fotos.
- `GET /api/photos/{id}` – Einzelnes Foto abrufen.

