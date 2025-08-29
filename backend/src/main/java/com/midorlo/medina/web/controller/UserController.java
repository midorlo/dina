package com.midorlo.medina.web.controller;

import com.midorlo.medina.domain.entity.RoleEntity;
import com.midorlo.medina.domain.entity.UserEntity;
import com.midorlo.medina.domain.repository.UserRepository;
import com.midorlo.medina.web.dto.AuthDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public Page<AuthDtos.User> list(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        var page = userRepository.findAll(pageable);
        var content = page.getContent().stream().map(this::toDto).toList();
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthDtos.User> get(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private AuthDtos.User toDto(UserEntity u) {
        String role = u.getRoles() == null || u.getRoles().isEmpty()
                ? "user"
                : u.getRoles().stream().map(RoleEntity::getName).min(Comparator.naturalOrder()).orElse("user");
        String name = u.getName() != null ? u.getName() : u.getUsername();
        return new AuthDtos.User(String.valueOf(u.getId()), u.getEmail(), name, u.getUsername(), role.toLowerCase(), u.getAvatarUrl());
    }
}
