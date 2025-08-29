package com.midorlo.medina.web.dto;

public class PhotoDtos {
    public record GalleryItem(
            String id,
            String src,
            String lazySrc,
            double aspectRatio
    ) {}
}

