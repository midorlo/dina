package com.midorlo.medina.web.dto;

public class ProfileDtos {
    public record Profile(
            String id,
            String userId,
            String username,
            String avatarUrl,
            String bio,
            String status,
            String lastSeen
    ) {}
}

