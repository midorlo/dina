package com.midorlo.medina.domain.repository;

import com.midorlo.medina.domain.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByRecipient_IdOrderByCreatedAtDesc(Long recipientId);
}

