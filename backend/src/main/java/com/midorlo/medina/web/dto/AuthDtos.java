package com.midorlo.medina.web.dto;

public class AuthDtos {
    public record User(
            String id,
            String email,
            String name,
            String username,
            String role,
            String avatarUrl
    ) {}
}

