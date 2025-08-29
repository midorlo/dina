package com.midorlo.medina.web.dto;

import java.time.Instant;
import java.util.List;

public class BlogDtos {
    public record BlogListItem(
            String id,
            String name,
            String description,
            String authorId,
            String authorHandle,
            String authorAvatarUrl,
            int postCount,
            Instant createdAt
    ) {}

    public record PostItem(
            String id,
            String title,
            Instant createdAt,
            String excerpt
    ) {}

    public record PostDetail(
            String id,
            String blogId,
            String blogName,
            String title,
            String author,
            String authorAvatarUrl,
            Instant date,
            String category,
            String imageUrl,
            List<String> content
    ) {}
}

