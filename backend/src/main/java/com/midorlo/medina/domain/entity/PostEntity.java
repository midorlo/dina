package com.midorlo.medina.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "posts", indexes = {
        @Index(name = "idx_posts_blog_id", columnList = "blog_id"),
        @Index(name = "idx_posts_published_at", columnList = "published_at")
})
public class PostEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "blog_id", nullable = false)
    private BlogEntity blog;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, length = 255)
    private String title;

    @Size(max = 255)
    @Column(length = 255)
    private String slug;

    @Size(max = 1000)
    @Column(length = 1000)
    private String excerpt;

    @Size(max = 100)
    @Column(length = 100)
    private String category;

    @Size(max = 1000)
    @Column(length = 1000)
    private String imageUrl;

    @Column(columnDefinition = "text")
    private String content;

    @Column(name = "published_at")
    private Instant publishedAt;
}
