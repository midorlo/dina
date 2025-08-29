package com.midorlo.medina.web.dto;

public class NotificationDtos {
    public record NotificationItem(
            String id,
            String title,
            String subtitle,
            String avatar,
            String time,
            String link,
            boolean read
    ) {}
}

