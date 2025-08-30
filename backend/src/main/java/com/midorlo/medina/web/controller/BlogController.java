package com.midorlo.medina.web.controller;

import com.midorlo.medina.domain.entity.BlogEntity;
import com.midorlo.medina.domain.entity.PostEntity;
import com.midorlo.medina.domain.entity.UserEntity;
import com.midorlo.medina.domain.repository.BlogRepository;
import com.midorlo.medina.domain.repository.PostRepository;
import com.midorlo.medina.web.dto.BlogDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/blogs")
public class BlogController {

    private final BlogRepository blogRepository;
    private final PostRepository postRepository;

    public BlogController(BlogRepository blogRepository, PostRepository postRepository) {
        this.blogRepository = blogRepository;
        this.postRepository = postRepository;
    }

    @GetMapping
    public Page<BlogDtos.BlogListItem> list(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        var page = blogRepository.findAll(pageable);
        var content = page.getContent().stream().map(this::toListItem).toList();
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogDtos.BlogListItem> get(@PathVariable Long id) {
        return blogRepository.findById(id)
                .map(this::toListItem)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<Page<BlogDtos.PostItem>> posts(
            @PathVariable Long id,
            @PageableDefault(size = 20, sort = "publishedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Optional<BlogEntity> blog = blogRepository.findById(id);
        if (blog.isEmpty()) return ResponseEntity.notFound().build();
        var page = postRepository.findByBlog_Id(id, pageable);
        var content = page.getContent().stream().map(this::toPostItem).toList();
        return ResponseEntity.ok(new PageImpl<>(content, pageable, page.getTotalElements()));
    }

    @GetMapping("/{id}/posts/{postId}")
    public ResponseEntity<BlogDtos.PostDetail> postDetail(@PathVariable Long id, @PathVariable Long postId) {
        Optional<PostEntity> post = postRepository.findById(postId);
        if (post.isEmpty() || post.get().getBlog() == null || !post.get().getBlog().getId().equals(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toPostDetail(post.get()));
    }

    private BlogDtos.BlogListItem toListItem(BlogEntity b) {
        UserEntity author = b.getAuthor();
        int postCount = postRepository == null ? 0 : (int) postRepository.countByBlog_Id(b.getId());
        return new BlogDtos.BlogListItem(
                String.valueOf(b.getId()),
                b.getName(),
                b.getDescription(),
                author != null ? String.valueOf(author.getId()) : null,
                author != null ? (author.getName() != null ? author.getName() : author.getUsername()) : "Unknown",
                author != null ? author.getAvatarUrl() : null,
                postCount,
                b.getCreatedAt()
        );
    }

    private BlogDtos.PostItem toPostItem(PostEntity p) {
        return new BlogDtos.PostItem(
                String.valueOf(p.getId()),
                p.getTitle(),
                p.getPublishedAt(),
                p.getExcerpt()
        );
    }

    private BlogDtos.PostDetail toPostDetail(PostEntity p) {
        BlogEntity blog = p.getBlog();
        UserEntity author = blog != null ? blog.getAuthor() : null;
        return new BlogDtos.PostDetail(
                String.valueOf(p.getId()),
                blog != null ? String.valueOf(blog.getId()) : null,
                blog != null ? blog.getName() : "",
                p.getTitle(),
                author != null ? (author.getName() != null ? author.getName() : author.getUsername()) : "Unknown",
                author != null ? author.getAvatarUrl() : null,
                p.getPublishedAt(),
                p.getCategory(),
                p.getImageUrl(),
                p.getContent() == null ? List.of() : List.of(p.getContent())
        );
    }
}
