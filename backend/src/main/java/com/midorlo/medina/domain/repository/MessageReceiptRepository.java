package com.midorlo.medina.domain.repository;

import com.midorlo.medina.domain.entity.MessageReceiptEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MessageReceiptRepository extends JpaRepository<MessageReceiptEntity, Long> {

    @Query("select count(r) from MessageReceiptEntity r where r.message.conversation.id = :conversationId and r.recipient.id = :recipientId and r.readAt is null")
    long countUnreadForConversation(@Param("conversationId") Long conversationId, @Param("recipientId") Long recipientId);
}

