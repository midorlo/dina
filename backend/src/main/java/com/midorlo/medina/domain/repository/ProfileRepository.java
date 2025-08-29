package com.midorlo.medina.domain.repository;

import com.midorlo.medina.domain.entity.ProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<ProfileEntity, Long> {
    Optional<ProfileEntity> findByUser_Id(Long userId);
}

