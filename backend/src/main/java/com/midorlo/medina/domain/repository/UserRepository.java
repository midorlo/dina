package com.midorlo.medina.domain.repository;

import com.midorlo.medina.domain.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    @Override
    @EntityGraph(attributePaths = "roles")
    Page<UserEntity> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "roles")
    Optional<UserEntity> findById(Long id);
}
