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

    public record LoginRequest(String username, String password) {}

    public record LoginResponse(String token) {}
}

