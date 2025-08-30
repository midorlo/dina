package com.midorlo.medina.web.controller;

import com.midorlo.medina.domain.entity.ConversationEntity;
import com.midorlo.medina.domain.entity.MessageEntity;
import com.midorlo.medina.domain.entity.UserEntity;
import com.midorlo.medina.domain.repository.ConversationParticipantRepository;
import com.midorlo.medina.domain.repository.ConversationRepository;
import com.midorlo.medina.domain.repository.MessageReceiptRepository;
import com.midorlo.medina.domain.repository.MessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import com.midorlo.medina.web.dto.ConversationDtos;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;

@RestController
@RequestMapping("/api/v1/conversations")
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
    public ResponseEntity<Page<ConversationDtos.ConversationSummary>> list(@RequestHeader(name = "X-User-Id", required = false) Long userId,
                                                          @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        if (userId == null) return ResponseEntity.ok(Page.empty(pageable));
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm").withZone(ZoneId.systemDefault());
        var page = conversationRepository.findPageByParticipant(userId, pageable);
        var content = page.getContent().stream().map(c -> toConversationSummary(c, userId, fmt)).toList();
        return ResponseEntity.ok(new PageImpl<>(content, pageable, page.getTotalElements()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConversationDtos.ConversationDetail> get(@PathVariable Long id, @RequestHeader(name = "X-User-Id", required = false) Long userId,
                                                   @RequestParam(name = "page", defaultValue = "0") int page,
                                                   @RequestParam(name = "size", defaultValue = "50") int size) {
        if (userId == null) return ResponseEntity.noContent().build();
        return conversationRepository.findById(id)
                .map(c -> toConversationDtoPaged(c, userId, DateTimeFormatter.ofPattern("HH:mm").withZone(ZoneId.systemDefault()), page, size))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{conversationId}/messages/{messageId}")
    public ResponseEntity<ConversationDtos.MessageItem> getMessage(@PathVariable Long conversationId,
                                                          @PathVariable Long messageId,
                                                          @RequestHeader(name = "X-User-Id", required = false) Long userId) {
        if (userId == null) return ResponseEntity.noContent().build();
        return messageRepository.findById(messageId)
                .filter(m -> m.getConversation() != null && m.getConversation().getId().equals(conversationId))
                .map(m -> toMessageDto(m, userId, DateTimeFormatter.ofPattern("HH:mm").withZone(ZoneId.systemDefault())))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private ConversationDtos.ConversationSummary toConversationSummary(ConversationEntity c, Long currentUserId, DateTimeFormatter fmt) {
        var participants = participantRepository.findByConversation_Id(c.getId());
        UserEntity partner = participants.stream()
                .map(p -> p.getUser())
                .filter(u -> !u.getId().equals(currentUserId))
                .findFirst().orElse(null);
        List<MessageEntity> messages = messageRepository.findByConversation_IdOrderByCreatedAtAsc(c.getId());
        MessageEntity last = messages.isEmpty() ? null : messages.get(messages.size() - 1);
        long unread = receiptRepository.countUnreadForConversation(c.getId(), currentUserId);
        return new ConversationDtos.ConversationSummary(
                String.valueOf(c.getId()),
                partner != null ? (partner.getName() != null ? partner.getName() : partner.getUsername()) : "Unknown",
                partner != null ? partner.getAvatarUrl() : null,
                last != null ? last.getText() : "",
                last != null ? fmt.format(last.getCreatedAt()) : "",
                (int) unread
        );
    }

    private ConversationDtos.ConversationDetail toConversationDtoPaged(ConversationEntity c, Long currentUserId, DateTimeFormatter fmt, int page, int size) {
        var summary = toConversationSummary(c, currentUserId, fmt);
        List<ConversationDtos.MessageItem> msgs = messageRepository.findByConversation_IdOrderByCreatedAtAsc(c.getId())
                .stream().map(m -> toMessageDto(m, currentUserId, fmt)).toList();
        int from = Math.min(page * size, msgs.size());
        int to = Math.min(from + size, msgs.size());
        List<ConversationDtos.MessageItem> slice = msgs.subList(from, to);
        return new ConversationDtos.ConversationDetail(
                summary.id(), summary.partner(), summary.avatar(), summary.lastMessage(), summary.time(), summary.unreadCount(),
                slice, page, size, msgs.size()
        );
    }

    private ConversationDtos.MessageItem toMessageDto(MessageEntity m, Long currentUserId, DateTimeFormatter fmt) {
        String senderName = m.getSender() != null ? (m.getSender().getId().equals(currentUserId) ? "You" : (m.getSender().getName() != null ? m.getSender().getName() : m.getSender().getUsername())) : "Unknown";
        boolean read = false; // could be derived via receipts per currentUserId
        return new ConversationDtos.MessageItem(String.valueOf(m.getId()), senderName, m.getText(), fmt.format(m.getCreatedAt()), read);
    }
}
