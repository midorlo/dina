package com.midorlo.medina.web.dto;

import java.util.List;

public class ConversationDtos {
    public record MessageItem(
            String id,
            String sender,
            String text,
            String time,
            boolean read
    ) {}

    public record ConversationSummary(
            String id,
            String partner,
            String avatar,
            String lastMessage,
            String time,
            int unreadCount
    ) {}

    public record ConversationDetail(
            String id,
            String partner,
            String avatar,
            String lastMessage,
            String time,
            int unreadCount,
            List<MessageItem> messages,
            int page,
            int size,
            long totalElements
    ) {}
}

