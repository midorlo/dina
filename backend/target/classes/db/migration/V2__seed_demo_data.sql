-- Seed demo data based on frontend mocks (and a bit more)
-- PostgreSQL dialect

-- 1) Roles
insert into roles (id, name, i18n, visible) values
    (1, 'USER', 'role.user', true),
    (2, 'MODERATOR', 'role.moderator', true),
    (3, 'ADMINISTRATOR', 'role.administrator', true),
    (4, 'DEVELOPER', 'role.developer', true),
    (5, 'BANNED', 'role.banned', false)
on conflict (id) do nothing;

-- 2) Users
-- Passwords are placeholders; adjust to your security setup if needed.
insert into users (id, username, password, email, name, avatar_url, email_verified, enabled, created_at, updated_at) values
    (1, 'john.doe', 'password', 'john.doe@example.com', 'John Doe', 'https://i.pravatar.cc/150?img=1', true, true, now(), now()),
    (2, 'jane.smith', 'password', 'jane.smith@example.com', 'Jane Smith', 'https://i.pravatar.cc/150?img=2', true, true, now(), now()),
    (3, 'peter.jones', 'password', 'peter.jones@example.com', 'Peter Jones', 'https://i.pravatar.cc/150?img=3', false, true, now(), now()),
    (4, 'mary.williams', 'password', 'mary.williams@example.com', 'Mary Williams', 'https://i.pravatar.cc/150?img=4', false, true, now(), now()),
    (5, 'david.brown', 'password', 'david.brown@example.com', 'David Brown', 'https://i.pravatar.cc/150?img=5', false, false, now(), now()),
    (6, 'alice', 'password', 'alice@example.com', 'Alice', 'https://i.pravatar.cc/150?img=6', true, true, now(), now()),
    (7, 'bob', 'password', 'bob@example.com', 'Bob', 'https://i.pravatar.cc/150?img=7', true, true, now(), now()),
    (8, 'charlie', 'password', 'charlie@example.com', 'Charlie', 'https://i.pravatar.cc/150?img=8', false, true, now(), now()),
    (9, 'eve', 'password', 'eve@example.com', 'Eve', 'https://i.pravatar.cc/150?img=9', false, true, now(), now())
on conflict (id) do nothing;

-- 3) Users ↔ Roles
insert into users_roles (user_id, role_id) values
    (1, 1), -- John: USER
    (2, 2), -- Jane: MODERATOR
    (3, 3), -- Peter: ADMIN
    (4, 4), -- Mary: DEVELOPER
    (5, 5), -- David: BANNED
    (6, 1), -- Others: USER
    (7, 1),
    (8, 1),
    (9, 1)
on conflict do nothing;

-- 4) Profiles (ONLINE/OFFLINE as per enum)
insert into profiles (id, user_id, bio, location, status, last_seen, created_at, updated_at) values
    (1, 1, 'I am a software developer from New York.', 'New York', 'ONLINE', null, now(), now()),
    (2, 2, 'I am a data scientist from Berlin.', 'Berlin', 'OFFLINE', '2025-08-20T14:00:00Z', now(), now()),
    (3, 3, 'I am a software developer from New York.', 'New York', 'ONLINE', null, now(), now()),
    (4, 4, 'I am a data scientist from Berlin.', 'Berlin', 'OFFLINE', '2025-08-21T18:30:00Z', now(), now()),
    (5, 5, 'I am a full-stack developer from Tokyo.', 'Tokyo', 'ONLINE', null, now(), now())
on conflict (id) do nothing;

-- 5) Blogs
insert into blogs (id, author_id, name, description, created_at, updated_at) values
    (1, 1, 'Johns Gedanken', 'Ein Einblick...', '2024-05-12T10:00:00Z', '2024-05-12T10:00:00Z'),
    (2, 2, 'Janes Abenteuer', 'Atemberaubende...', '2024-01-01T12:00:00Z', '2024-01-01T12:00:00Z'),
    (3, 3, 'Peters Küche', 'Einfache Rezepte...', '2024-02-22T16:00:00Z', '2024-02-22T16:00:00Z'),
    (4, 4, 'Marys grüner Daumen', 'Wie du auch ohne...', '2024-03-12T11:00:00Z', '2024-03-12T11:00:00Z'),
    (5, 5, 'Davids Sternenbilder', 'Die Sterne...', '2024-04-02T20:00:00Z', '2024-04-02T20:00:00Z')
on conflict (id) do nothing;

-- 6) Posts (a representative subset + some extra for volume)
insert into posts (id, blog_id, title, slug, excerpt, category, image_url, content, published_at) values
    (101, 1, 'Mein Weg zum Minimalismus', 'mein-weg-zum-minimalismus', 'Es begann alles mit einer einfachen Frage...', 'Lebensstil', 'https://images.unsplash.com/photo-1484981138541-3d074aa97716?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Es begann alles mit einer einfachen Frage: Brauche ich das wirklich?...', '2024-05-15T10:00:00Z'),
    (102, 1, 'Produktivität neu denken', 'produktivitaet-neu-denken', 'Weniger tun, mehr erreichen...', 'Work', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Weniger tun, mehr erreichen...', '2024-05-20T12:00:00Z'),
    (201, 2, 'Reisen mit leichtem Gepäck', 'reisen-mit-leichtem-gepaeck', 'Packen wie ein Profi...', 'Travel', 'https://images.unsplash.com/photo-1500043373935-8f4e87b9ed14?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Packen wie ein Profi...', '2024-01-05T09:00:00Z'),
    (202, 2, 'Die Magie des Nordens', 'magie-des-nordens', 'Nordlichter und mehr...', 'Travel', 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Nordlichter und mehr...', '2024-01-10T19:00:00Z'),
    (301, 3, 'Pasta wie in Italien', 'pasta-wie-in-italien', 'Einfache Zutaten, großer Geschmack...', 'Food', 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Einfache Zutaten, großer Geschmack...', '2024-02-22T18:00:00Z'),
    (302, 3, 'Schnelle Suppen', 'schnelle-suppen', 'Aufwärmen in 15 Minuten...', 'Food', 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Aufwärmen in 15 Minuten...', '2024-02-25T12:00:00Z'),
    (401, 4, 'Zimmerpflanzen ohne grünen Daumen', 'zimmerpflanzen-ohne-gruenen-daumen', 'Pflegeleichte Pflanzen...', 'Garden', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Pflegeleichte Pflanzen...', '2024-03-12T13:30:00Z'),
    (402, 4, 'Kompost leicht gemacht', 'kompost-leicht-gemacht', 'So wirds was...', 'Garden', 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'So wirds was...', '2024-03-20T09:30:00Z'),
    (501, 5, 'Blicke in die Nacht', 'blicke-in-die-nacht', 'Die Sterne...', 'Science', 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'Die Sterne...', '2024-04-02T21:00:00Z'),
    (502, 5, 'Teleskop Guide', 'teleskop-guide', 'So findest du das richtige...', 'Science', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 'So findest du das richtige...', '2024-04-05T20:00:00Z')
on conflict (id) do nothing;

-- 7) Conversations
insert into conversations (id, created_at, updated_at) values
    (1, '2025-08-29T10:25:00Z', '2025-08-29T10:25:00Z'),
    (2, '2025-08-28T15:00:00Z', '2025-08-28T15:00:00Z'),
    (3, '2025-08-27T09:00:00Z', '2025-08-27T09:00:00Z'),
    (4, '2025-08-26T08:00:00Z', '2025-08-26T08:00:00Z')
on conflict (id) do nothing;

-- Participants (John u1 with u6..u9)
insert into conversation_participants (id, conversation_id, user_id, joined_at) values
    (1, 1, 1, '2025-08-29T10:25:00Z'),
    (2, 1, 6, '2025-08-29T10:25:00Z'),
    (3, 2, 1, '2025-08-28T15:00:00Z'),
    (4, 2, 7, '2025-08-28T15:00:00Z'),
    (5, 3, 1, '2025-08-27T09:00:00Z'),
    (6, 3, 8, '2025-08-27T09:00:00Z'),
    (7, 4, 1, '2025-08-26T08:00:00Z'),
    (8, 4, 9, '2025-08-26T08:00:00Z')
on conflict (id) do nothing;

-- Messages (subset from mocks + a few more)
insert into messages (id, conversation_id, sender_id, text, created_at) values
    (1, 1, 6, 'Hi there!', '2025-08-29T10:28:00Z'),
    (2, 1, 1, 'Hey, how are you?', '2025-08-29T10:30:00Z'),
    (3, 1, 6, 'I''m doing great, thanks! How about you?', '2025-08-29T10:32:00Z'),
    (4, 1, 1, 'All good here. Just busy with work.', '2025-08-29T10:35:00Z'),
    (5, 1, 6, 'Same here! We should catch up soon.', '2025-08-29T10:40:00Z'),
    (6, 2, 7, 'Are you free tomorrow for the project meeting?', '2025-08-28T15:00:00Z'),
    (7, 2, 1, 'Yes, I am. What time?', '2025-08-28T15:05:00Z'),
    (8, 3, 8, 'Ping!', '2025-08-27T09:05:00Z'),
    (9, 3, 1, 'Pong!', '2025-08-27T09:06:00Z')
on conflict (id) do nothing;

-- Message receipts (only for messages that were read)
-- For c1 m1,m2 were read; for c2 m6,m7 were read
insert into message_receipts (id, message_id, recipient_id, read_at) values
    (1, 1, 1, '2025-08-29T10:29:00Z'), -- John read Alice''s first message
    (2, 2, 6, '2025-08-29T10:31:00Z'), -- Alice read John''s reply
    (3, 6, 1, '2025-08-28T15:01:00Z'), -- John read Bob''s message
    (4, 7, 7, '2025-08-28T15:06:00Z')  -- Bob read John''s reply
on conflict (id) do nothing;

-- 8) Photos
insert into photos (id, owner_id, url, width, height, created_at, updated_at) values
    (1, 1, 'https://picsum.photos/500/300?image=15', 500, 300, now(), now()),
    (2, 1, 'https://picsum.photos/400/600?image=25', 400, 600, now(), now()),
    (3, 2, 'https://picsum.photos/600/400?image=35', 600, 400, now(), now()),
    (4, 3, 'https://picsum.photos/800/600?image=45', 800, 600, now(), now())
on conflict (id) do nothing;

-- 9) Notifications
insert into notifications (id, recipient_id, actor_id, type, subject_type, subject_id, created_at, updated_at, read_at) values
    (1, 2, 1, 'NEW_FOLLOWER', 'USER', '1', '2025-08-29T12:20:00Z', '2025-08-29T12:20:00Z', null),
    (2, 1, 2, 'PHOTO_LIKED', 'PHOTO', '1', '2025-08-29T11:30:00Z', '2025-08-29T11:30:00Z', '2025-08-29T12:00:00Z'),
    (3, 1, 3, 'POST_COMMENT', 'POST', '101', '2025-08-29T10:00:00Z', '2025-08-29T10:00:00Z', null),
    (4, 4, null, 'SERVER_UPDATE', null, null, '2025-08-28T16:00:00Z', '2025-08-28T16:00:00Z', null)
on conflict (id) do nothing;

-- 10) Bump sequences so future inserts won’t collide
select setval(pg_get_serial_sequence('roles','id'),       (select coalesce(max(id),0) from roles), true);
select setval(pg_get_serial_sequence('users','id'),       (select coalesce(max(id),0) from users), true);
select setval(pg_get_serial_sequence('profiles','id'),    (select coalesce(max(id),0) from profiles), true);
select setval(pg_get_serial_sequence('blogs','id'),       (select coalesce(max(id),0) from blogs), true);
select setval(pg_get_serial_sequence('posts','id'),       (select coalesce(max(id),0) from posts), true);
select setval(pg_get_serial_sequence('conversations','id'), (select coalesce(max(id),0) from conversations), true);
select setval(pg_get_serial_sequence('conversation_participants','id'), (select coalesce(max(id),0) from conversation_participants), true);
select setval(pg_get_serial_sequence('messages','id'),    (select coalesce(max(id),0) from messages), true);
select setval(pg_get_serial_sequence('message_receipts','id'), (select coalesce(max(id),0) from message_receipts), true);
select setval(pg_get_serial_sequence('photos','id'),      (select coalesce(max(id),0) from photos), true);
select setval(pg_get_serial_sequence('notifications','id'), (select coalesce(max(id),0) from notifications), true);

