package com.midorlo.medina.web.controller;

import com.midorlo.medina.domain.entity.ConversationEntity;
import com.midorlo.medina.domain.entity.MessageEntity;
import com.midorlo.medina.domain.entity.UserEntity;
import com.midorlo.medina.domain.repository.ConversationParticipantRepository;
import com.midorlo.medina.domain.repository.ConversationRepository;
import com.midorlo.medina.domain.repository.MessageReceiptRepository;
import com.midorlo.medina.domain.repository.MessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/conversations")
public class ConversationController {

    private final ConversationRepository conversationRepository;
    private final ConversationParticipantRepository participantRepository;
    private final MessageRepository messageRepository;
    private final MessageReceiptRepository receiptRepository;

    public ConversationController(ConversationRepository conversationRepository,
                                  ConversationParticipantRepository participantRepository,
                                  MessageRepository messageRepository,
                                  MessageReceiptRepository receiptRepository) {
        this.conversationRepository = conversationRepository;
        this.participantRepository = participantRepository;
        this.messageRepository = messageRepository;
        this.receiptRepository = receiptRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list(@RequestHeader(name = "X-User-Id", required = false) Long userId) {
        if (userId == null) return ResponseEntity.ok(List.of());
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm").withZone(ZoneId.systemDefault());
        var convos = conversationRepository.findAllByParticipant(userId).stream().map(c -> toConversationDto(c, userId, fmt)).toList();
        return ResponseEntity.ok(convos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> get(@PathVariable Long id, @RequestHeader(name = "X-User-Id", required = false) Long userId) {
        if (userId == null) return ResponseEntity.ok(Map.of());
        return conversationRepository.findById(id)
                .map(c -> toConversationDto(c, userId, DateTimeFormatter.ofPattern("HH:mm").withZone(ZoneId.systemDefault())))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{conversationId}/messages/{messageId}")
    public ResponseEntity<Map<String, Object>> getMessage(@PathVariable Long conversationId,
                                                          @PathVariable Long messageId,
                                                          @RequestHeader(name = "X-User-Id", required = false) Long userId) {
        if (userId == null) return ResponseEntity.ok(Map.of());
        return messageRepository.findById(messageId)
                .filter(m -> m.getConversation() != null && m.getConversation().getId().equals(conversationId))
                .map(m -> toMessageDto(m, userId, DateTimeFormatter.ofPattern("HH:mm").withZone(ZoneId.systemDefault())))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toConversationDto(ConversationEntity c, Long currentUserId, DateTimeFormatter fmt) {
        var participants = participantRepository.findByConversation_Id(c.getId());
        UserEntity partner = participants.stream()
                .map(p -> p.getUser())
                .filter(u -> !u.getId().equals(currentUserId))
                .findFirst().orElse(null);
        List<MessageEntity> messages = messageRepository.findByConversation_IdOrderByCreatedAtAsc(c.getId());
        MessageEntity last = messages.isEmpty() ? null : messages.get(messages.size() - 1);
        long unread = receiptRepository.countUnreadForConversation(c.getId(), currentUserId);
        return Map.of(
                "id", String.valueOf(c.getId()),
                "partner", partner != null ? (partner.getName() != null ? partner.getName() : partner.getUsername()) : "Unknown",
                "avatar", partner != null ? partner.getAvatarUrl() : null,
                "lastMessage", last != null ? last.getText() : "",
                "time", last != null ? fmt.format(last.getCreatedAt()) : "",
                "unreadCount", (int) unread,
                "messages", messages.stream().map(m -> toMessageDto(m, currentUserId, fmt)).toList()
        );
    }

    private Map<String, Object> toMessageDto(MessageEntity m, Long currentUserId, DateTimeFormatter fmt) {
        String senderName = m.getSender() != null ? (m.getSender().getId().equals(currentUserId) ? "You" : (m.getSender().getName() != null ? m.getSender().getName() : m.getSender().getUsername())) : "Unknown";
        boolean read = false; // can derive from receipts if needed per currentUserId
        return Map.of(
                "id", String.valueOf(m.getId()),
                "text", m.getText(),
                "time", fmt.format(m.getCreatedAt()),
                "sender", senderName,
                "read", read
        );
    }
}

