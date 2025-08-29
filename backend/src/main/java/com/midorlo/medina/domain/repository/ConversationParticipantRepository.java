package com.midorlo.medina.domain.repository;

import com.midorlo.medina.domain.entity.ConversationParticipantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConversationParticipantRepository extends JpaRepository<ConversationParticipantEntity, Long> {
    List<ConversationParticipantEntity> findByConversation_Id(Long conversationId);
    List<ConversationParticipantEntity> findByUser_Id(Long userId);
}

