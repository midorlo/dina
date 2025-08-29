package com.midorlo.medina.domain.repository;

import com.midorlo.medina.domain.entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    List<MessageEntity> findByConversation_IdOrderByCreatedAtAsc(Long conversationId);
    Optional<MessageEntity> findTopByConversation_IdOrderByCreatedAtDesc(Long conversationId);
}

