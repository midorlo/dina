package com.midorlo.medina.web.controller;

import com.midorlo.medina.domain.entity.ProfileEntity;
import com.midorlo.medina.domain.entity.UserEntity;
import com.midorlo.medina.domain.repository.ProfileRepository;
import com.midorlo.medina.web.dto.ProfileDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileRepository profileRepository;

    public ProfileController(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @GetMapping
    public Page<ProfileDtos.Profile> list(
            @PageableDefault(size = 20, sort = "updatedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        var page = profileRepository.findAll(pageable);
        var content = page.getContent().stream().map(this::toDto).toList();
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDtos.Profile> getByUserId(@PathVariable Long userId) {
        return profileRepository.findByUser_Id(userId)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private ProfileDtos.Profile toDto(ProfileEntity p) {
        UserEntity u = p.getUser();
        String username = u.getName() != null ? u.getName() : u.getUsername();
        String status = p.getStatus() != null ? p.getStatus().name().toLowerCase() : null;
        String lastSeen = p.getLastSeen() != null ? p.getLastSeen().toString() : null;
        return new ProfileDtos.Profile(
                String.valueOf(p.getId()),
                u != null ? String.valueOf(u.getId()) : null,
                username,
                u != null ? u.getAvatarUrl() : null,
                p.getBio(),
                status,
                lastSeen
        );
    }
}
