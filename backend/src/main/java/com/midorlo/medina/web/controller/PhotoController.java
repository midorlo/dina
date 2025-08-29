package com.midorlo.medina.web.controller;

import com.midorlo.medina.domain.entity.PhotoEntity;
import com.midorlo.medina.domain.repository.PhotoRepository;
import com.midorlo.medina.web.dto.PhotoDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    private final PhotoRepository photoRepository;

    public PhotoController(PhotoRepository photoRepository) {
        this.photoRepository = photoRepository;
    }

    @GetMapping
    public Page<PhotoDtos.GalleryItem> list(Pageable pageable) {
        var page = photoRepository.findAll(pageable);
        var content = page.getContent().stream().map(this::toDto).toList();
        return new PageImpl<>(content, pageable, page.getTotalElements());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PhotoDtos.GalleryItem> get(@PathVariable Long id) {
        return photoRepository.findById(id)
                .map(this::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    private PhotoDtos.GalleryItem toDto(PhotoEntity p) {
        double ratio = p.getWidth() != null && p.getHeight() != null && p.getHeight() != 0
                ? (double) p.getWidth() / (double) p.getHeight() : 1.0;
        String lazy = p.getUrl() != null ? p.getUrl().replace("picsum.photos", "picsum.photos/seed/" + p.getId() + "/10/6") : null;
        return new PhotoDtos.GalleryItem(String.valueOf(p.getId()), p.getUrl(), lazy, ratio);
    }
}
