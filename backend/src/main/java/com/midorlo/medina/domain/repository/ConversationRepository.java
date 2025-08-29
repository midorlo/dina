package com.midorlo.medina.domain.repository;

import com.midorlo.medina.domain.entity.ConversationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ConversationRepository extends JpaRepository<ConversationEntity, Long> {

    @Query("select c from ConversationEntity c join com.midorlo.medina.domain.entity.ConversationParticipantEntity p on p.conversation = c where p.user.id = :userId")
    List<ConversationEntity> findAllByParticipant(@Param("userId") Long userId);
}

