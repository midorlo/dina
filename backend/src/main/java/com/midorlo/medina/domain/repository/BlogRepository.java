package com.midorlo.medina.domain.repository;

import com.midorlo.medina.domain.entity.BlogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogRepository extends JpaRepository<BlogEntity, Long> {
    List<BlogEntity> findByAuthor_Id(Long authorId);
}

