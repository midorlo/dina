# Backend Domain- und Entity-Vorschlag

Quelle: Analyse der Frontend-Mockdaten unter `frontend/src/data/normalized-mock-data.ts` sowie der Services (`frontend/src/services/*`).

## Überblick Mock-Daten (Ist-Zustand)
- Users: `id`, `name`, `email`, `role`, `avatarUrl`.
- Profiles: `id`, `userId` (1:1), `username`, `bio`, `status` ('online'|'offline'), `lastSeen`.
- Blogs: `id`, `authorId` (User), `name`, `description`, `createdAt`.
- Posts: `id`, `blogId`, `title`, `excerpt`, `category`, `imageUrl`, `content[]`, `createdAt`.
- Conversations: `id`, `participantIds[]` (2er-Chats im Mock).
- Messages: `id`, `conversationId`, `senderId`, `text`, `createdAt`, `read` (vereinfachtes Flag).
- Photos: `id`, `ownerId`, `src`, `aspectRatio`.
- Notifications: `id`, `recipientId`, `actorId|null`, `type` (NEW_FOLLOWER|PHOTO_LIKED|POST_COMMENT|SERVER_UPDATE), `subject {type, id}|null`, `createdAt`, `read`.

## Ziele für das Backend-Datenmodell
- Saubere Normalisierung, klare Beziehungen, gute Indizierung.
- Erweitbarkeit (mehr Teilnehmer in Konversationen, Read-Receipts pro Nutzer, Post-Inhalte/Medien erweiterbar).
- Abgleich mit bestehenden API-Routen aus dem Frontend (`/api/blogs`, `/api/conversations`, `/api/profiles`, `/api/photos`, `/api/notifications`, `/api/users`).

## Entities (JPA) – Vorschlag

### 1) User
- Felder: `id (UUID)`, `email (unique)`, `name`, `username (unique)`, `role (enum)`, `avatarUrl`, `createdAt`, `updatedAt`, `isActive`.
- Hinweise: Im Frontend gibt es `username` sowohl in `auth.User` als auch in `profiles`. Im Backend sollte `username` klar zu `User` gehören; `Profile.username` wird daraus abgeleitet/angezeigt.
- Indizes: unique `email`, unique `username`.

### 2) Profile (1:1 zu User)
- Felder: `id (UUID)`, `user (unique FK)`, `bio`, `location`, `status (enum: ONLINE/OFFLINE)`, `lastSeen (Instant)`.
- Index: unique auf `user_id`.

### 3) Blog (User 1:n Blogs)
- Felder: `id (UUID)`, `author (FK User)`, `name`, `description`, `createdAt`.
- Index: `author_id`.

### 4) Post (Blog 1:n Posts)
- Felder: `id (UUID)`, `blog (FK)`, `title`, `slug`, `excerpt`, `category`, `imageUrl`, `content (TEXT/Markdown)`, `publishedAt`.
- Hinweise: Frontend nutzt `content: string[]`; im Backend als ein Markdown/Textfeld speichern, Frontend kann in Absätze splitten.
- Indizes: `blog_id`, `slug (unique per blog)` optional global unique.

### 5) Conversation (n:m User via Join-Tabelle)
- Felder: `id (UUID)`, `createdAt`.
- Beziehung: `@OneToMany` `participants: ConversationParticipant`.
- Hinweis: erlaubt Gruppen-Chats, deckt 2er-Chats ab.

### 6) ConversationParticipant (Join)
- Felder: `id (UUID)`, `conversation (FK)`, `user (FK)`, `joinedAt`.
- Unique-Constraint: `(conversation_id, user_id)`.
- Index: `user_id` (für Inbox-Queries).

### 7) Message
- Felder: `id (UUID)`, `conversation (FK)`, `sender (FK User)`, `text`, `createdAt`.
- Indizes: `conversation_id`, `createdAt` (Sortierung), `sender_id`.

### 8) MessageReceipt (pro User Read-Status) – empfohlen
- Felder: `id (UUID)`, `message (FK)`, `recipient (FK User)`, `readAt (Instant|null)`.
- Unique-Constraint: `(message_id, recipient_id)`.
- Hinweis: Mock hat nur `read: boolean`; für korrekte Modellierung pro Empfänger nötig.

### 9) Photo
- Felder: `id (UUID)`, `owner (FK User)`, `url`, `width`, `height`, `createdAt`.
- Hinweis: `aspectRatio` lässt sich aus `width/height` berechnen; optional als Materialized-Feld.
- Index: `owner_id`.

### 10) Notification
- Felder: `id (UUID)`, `recipient (FK User)`, `actor (FK User, nullable)`, `type (enum)`,
  `subjectType (enum: USER|PHOTO|POST|NONE)`, `subjectId (UUID|string)`, `createdAt`, `readAt (nullable)`.
- Indizes: `recipient_id, createdAt`, ggf. zusammengesetzt `(recipient_id, readAt)`.

### 11) Enums
- `Role`: ANY, GUEST, USER, MODERATOR, ADMINISTRATOR, DEVELOPER, BANNED (aus Frontend übernommen).
- `UserStatus`: ONLINE, OFFLINE.
- `NotificationType`: NEW_FOLLOWER, PHOTO_LIKED, POST_COMMENT, SERVER_UPDATE.
- `SubjectType`: USER, PHOTO, POST, NONE.

## Beziehungen (Kurzüberblick)
- User 1:1 Profile
- User 1:n Blog
- Blog 1:n Post
- Conversation n:m User (via ConversationParticipant)
- Conversation 1:n Message
- Message 1:n MessageReceipt (je Empfänger)
- User 1:n Photo
- Notification: recipient -> User, actor -> User (nullable), polymorphe subject-Referenz (type + id)

## API-Abgleich (Front → Back)
- `/api/blogs` → Blog-Listen-DTO inkl. `postCount`, `authorHandle`, `authorAvatarUrl` (JOIN: Blog → User, COUNT Posts)
- `/api/blogs/{id}` → Blog-Detail-DTO wie oben
- `/api/blogs/{id}/posts` → leichte `PostItem`-DTOs (`id`, `title`, `createdAt`, `excerpt`)
- `/api/blogs/{id}/posts/{postId}` → `Post`-DTO inkl. `blogName`, `author`, `authorAvatarUrl`
- `/api/conversations` → pro Conversation: Partner-Name/Avatar, `lastMessage`, `unreadCount` (JOINs + Receipts)
- `/api/conversations/{id}` → Details inkl. Messages (konvertiert in Frontend-Shape)
- `/api/conversations/{conversationId}/messages/{messageId}` → Einzelmessage
- `/api/profiles` & `/api/profiles/{userId}` → Profile-DTO
- `/api/photos` & `/api/photos/{id}` → GalleryItem-DTO (`lazySrc` wird im Frontend generiert)
- `/api/notifications` → NotificationItem-DTO (Titel/Subtitle werden serverseitig aus Type/Subject zusammengesetzt oder roh geliefert und Frontend baut Texte)
- `/api/users` & `/api/users/{id}` → User-DTO

## Beispielhafte JPA-Skelette (Auszug)
```java
@Entity
@Table(name = "users", uniqueConstraints = {
  @UniqueConstraint(columnNames = {"email"}),
  @UniqueConstraint(columnNames = {"username"})
})
public class UserEntity {
  @Id UUID id;
  String email;
  String name;
  String username;
  @Enumerated(EnumType.STRING) Role role;
  String avatarUrl;
  Instant createdAt;
  Instant updatedAt;
  boolean isActive;
}

@Entity
@Table(name = "profiles")
public class ProfileEntity {
  @Id UUID id;
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", unique = true, nullable = false)
  UserEntity user;
  String bio;
  String location;
  @Enumerated(EnumType.STRING) UserStatus status;
  Instant lastSeen;
}

@Entity
@Table(name = "blogs")
public class BlogEntity {
  @Id UUID id;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_id", nullable = false)
  UserEntity author;
  String name;
  @Column(length = 2000) String description;
  Instant createdAt;
}

@Entity
@Table(name = "posts")
public class PostEntity {
  @Id UUID id;
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "blog_id", nullable = false)
  BlogEntity blog;
  String title;
  String slug;
  String category;
  String imageUrl;
  @Lob String content; // Markdown/Text
  Instant publishedAt;
}

@Entity
@Table(name = "conversations")
public class ConversationEntity { @Id UUID id; Instant createdAt; }

@Entity
@Table(name = "conversation_participants", uniqueConstraints = @UniqueConstraint(columnNames = {"conversation_id","user_id"}))
public class ConversationParticipantEntity {
  @Id UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "conversation_id") ConversationEntity conversation;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") UserEntity user;
  Instant joinedAt;
}

@Entity
@Table(name = "messages")
public class MessageEntity {
  @Id UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "conversation_id") ConversationEntity conversation;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "sender_id") UserEntity sender;
  @Column(length = 4000) String text;
  Instant createdAt;
}

@Entity
@Table(name = "message_receipts", uniqueConstraints = @UniqueConstraint(columnNames = {"message_id","recipient_id"}))
public class MessageReceiptEntity {
  @Id UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "message_id") MessageEntity message;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "recipient_id") UserEntity recipient;
  Instant readAt; // null = ungelesen
}

@Entity
@Table(name = "photos")
public class PhotoEntity {
  @Id UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "owner_id") UserEntity owner;
  String url; Integer width; Integer height; Instant createdAt;
}

@Entity
@Table(name = "notifications")
public class NotificationEntity {
  @Id UUID id;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "recipient_id") UserEntity recipient;
  @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "actor_id") UserEntity actor; // nullable
  @Enumerated(EnumType.STRING) NotificationType type;
  @Enumerated(EnumType.STRING) SubjectType subjectType;
  String subjectId; // UUID als String oder separate FKs pro Typ
  Instant createdAt; Instant readAt; // null = ungelesen
}
```

## Indizes & Performance (empfohlen)
- `messages(conversation_id, created_at)` → Listen/Sortierung.
- `message_receipts(recipient_id, read_at)` → Badge/Unread-Counts.
- `notifications(recipient_id, created_at)` → Notification-Feeds.
- `posts(blog_id, published_at)` → Blog-Listing.

## Offene Punkte / Annahmen
- Auth/Identity: `username` liegt zentral bei `User` (Frontend aktuell inkonsistent). Beim DTO darauf achten.
- `content[]` im Frontend aus `Post.content` (Text) erzeugen (split by paragraphs) oder künftig Rich-Text/Blocks modellieren.
- Read-Receipts: Falls 1:1-Chats dauerhaft, kann einfaches `read` beibehalten werden; für Gruppen ist `MessageReceipt` nötig.
- Notification-Subject: polymorphes Mapping mit `(subject_type, subject_id)` genügt; bei Bedarf später echte FKs mit drei optionalen Spalten.

## Nächste Schritte
- Entities und Enums anlegen (Spring Boot, JPA, Flyway/Liquibase).
- DTOs/Mapper bauen, damit die Frontend-Services ohne Änderungen funktionieren.
- Controller/Repos für genutzte Endpunkte hinzufügen; Queries optimieren (JOINs/Counts).
- Migrations: Basis-Schema + Demodaten, die den Mock-Datensätzen entsprechen.

