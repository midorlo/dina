# Backend Controller Pagination & API Guidelines

Dieser Leitfaden dokumentiert die Umstellung auf Spring Data Pageable für alle Listen-Endpunkte und beschreibt die resultierenden API-Signaturen.

## Prinzipien
- Alle Endpunkte, die Mengen zurückgeben, akzeptieren `Pageable` (Query-Params: `page`, `size`, `sort`).
- Rückgabeformat ist `Page<T>` (bzw. analoger Wrapper), damit Meta-Infos (`totalElements`, `totalPages`, `number`, `size`, `sort`) verfügbar sind.
- Sortierung: Standard via `sort=field,asc|desc` steuerbar; Controller erzwingen nur notwendige Default-Sortierungen (z. B. Created/Published).

## Endpunkte (aktuell implementiert)
- `GET /api/blogs` → `Page<BlogListItem>`
- `GET /api/blogs/{id}` → `BlogListItem`
- `GET /api/blogs/{id}/posts` → `Page<PostItem>`
- `GET /api/blogs/{id}/posts/{postId}` → `PostDetail`
- `GET /api/profiles` → `Page<Profile>`
- `GET /api/profiles/{userId}` → `Profile`
- `GET /api/photos` → `Page<GalleryItem>`
- `GET /api/photos/{id}` → `GalleryItem`
- `GET /api/notifications` (Header `X-User-Id`) → `Page<NotificationItem>`
- `GET /api/users` → `Page<User>`
- `GET /api/users/{id}` → `User`
- `GET /api/conversations` (Header `X-User-Id`) → `Page<ConversationSummary>` (aktuell als `Map` serialisiert)
- `GET /api/conversations/{id}` (Header `X-User-Id`) → Conversation-Detail inkl. paginierter `messages` über `page/size` Query-Params

## Repositories (Paging-spezifisch)
- `PostRepository.findByBlog_Id(Long, Pageable)`
- `NotificationRepository.findByRecipient_Id(Long, Pageable)`
- `ConversationRepository.findPageByParticipant(Long, Pageable)` (inkl. `countQuery`)

## Rückwärtskompatibilität
- Detail-Endpunkte bleiben unverändert (keine Page).
- Conversation-Detail liefert zusätzlich `page/size/totalElements` für `messages`.

## Nächste Schritte (optional)
- Eigene DTOs für `ConversationSummary`/`MessageItem` statt `Map`.
- Standard-Sortierung per `@PageableDefault` an Endpunkten deklarieren.
- HATEOAS-Links (optional) für Page-Navigation.

