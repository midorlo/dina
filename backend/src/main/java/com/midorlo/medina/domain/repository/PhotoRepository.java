package com.midorlo.medina.domain.repository;

import com.midorlo.medina.domain.entity.PhotoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhotoRepository extends JpaRepository<PhotoEntity, Long> {
    List<PhotoEntity> findByOwner_Id(Long ownerId);
}

