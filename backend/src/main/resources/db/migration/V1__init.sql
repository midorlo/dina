-- Flyway baseline schema for core domain
-- PostgreSQL dialect

-- Roles
create table if not exists roles (
    id bigserial primary key,
    name varchar(255) not null unique,
    i18n varchar(255) not null unique,
    visible boolean not null default true
);

-- Users
create table if not exists users (
    id bigserial primary key,
    username varchar(255) not null unique,
    password varchar(255) not null,
    email varchar(255) not null unique,
    name varchar(255),
    avatar_url varchar(1000),
    email_verified boolean not null default false,
    enabled boolean not null default true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);

-- Users ↔ Roles
create table if not exists users_roles (
    user_id bigint not null references users(id) on delete cascade,
    role_id bigint not null references roles(id) on delete cascade,
    primary key (user_id, role_id)
);

-- Profiles (1:1 User)
create table if not exists profiles (
    id bigserial primary key,
    user_id bigint not null unique references users(id) on delete cascade,
    bio varchar(1000),
    location varchar(255),
    status varchar(16),
    last_seen timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);
create index if not exists idx_profiles_user_id on profiles(user_id);

-- Blogs
create table if not exists blogs (
    id bigserial primary key,
    author_id bigint not null references users(id) on delete cascade,
    name varchar(255) not null,
    description varchar(2000),
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone
);
create index if not exists idx_blogs_author_id on blogs(author_id);

-- Posts
create table if not exists posts (
    id bigserial primary key,
    blog_id bigint not null references blogs(id) on delete cascade,
    title varchar(255) not null,
    slug varchar(255),
    excerpt varchar(1000),
    category varchar(100),
    image_url varchar(1000),
    content text,
    published_at timestamp with time zone
);
create index if not exists idx_posts_blog_id on posts(blog_id);
create index if not exists idx_posts_published_at on posts(published_at);

-- Conversations
create table if not exists conversations (
    id bigserial primary key,
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone
);

-- Conversation participants
create table if not exists conversation_participants (
    id bigserial primary key,
    conversation_id bigint not null references conversations(id) on delete cascade,
    user_id bigint not null references users(id) on delete cascade,
    joined_at timestamp with time zone not null,
    constraint uk_conv_user unique (conversation_id, user_id)
);
create index if not exists idx_conv_part_user_id on conversation_participants(user_id);
create index if not exists idx_conv_part_conv_id on conversation_participants(conversation_id);

-- Messages
create table if not exists messages (
    id bigserial primary key,
    conversation_id bigint not null references conversations(id) on delete cascade,
    sender_id bigint not null references users(id) on delete restrict,
    text varchar(4000) not null,
    created_at timestamp with time zone not null
);
create index if not exists idx_messages_conversation_id on messages(conversation_id);
create index if not exists idx_messages_created_at on messages(created_at);

-- Message receipts (per-recipient read state)
create table if not exists message_receipts (
    id bigserial primary key,
    message_id bigint not null references messages(id) on delete cascade,
    recipient_id bigint not null references users(id) on delete cascade,
    read_at timestamp with time zone,
    constraint uk_msg_recipient unique (message_id, recipient_id)
);
create index if not exists idx_receipts_recipient_id on message_receipts(recipient_id);
create index if not exists idx_receipts_read_at on message_receipts(read_at);

-- Photos
create table if not exists photos (
    id bigserial primary key,
    owner_id bigint not null references users(id) on delete cascade,
    url varchar(1000) not null,
    width integer not null check (width > 0),
    height integer not null check (height > 0),
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone
);
create index if not exists idx_photos_owner_id on photos(owner_id);

-- Notifications
create table if not exists notifications (
    id bigserial primary key,
    recipient_id bigint not null references users(id) on delete cascade,
    actor_id bigint references users(id) on delete set null,
    type varchar(32) not null,
    subject_type varchar(16),
    subject_id varchar(64),
    created_at timestamp with time zone not null,
    updated_at timestamp with time zone,
    read_at timestamp with time zone
);
create index if not exists idx_notifications_recipient_id on notifications(recipient_id);
create index if not exists idx_notifications_created_at on notifications(created_at);
