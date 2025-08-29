package com.midorlo.medina.domain.repository;

import com.midorlo.medina.domain.entity.PostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<PostEntity, Long> {
    List<PostEntity> findByBlog_IdOrderByPublishedAtDesc(Long blogId);
    Page<PostEntity> findByBlog_Id(Long blogId, Pageable pageable);
    long countByBlog_Id(Long blogId);
}
