package com.midorlo.medina.web.controller;

import com.midorlo.medina.domain.entity.NotificationEntity;
import com.midorlo.medina.domain.entity.PostEntity;
import com.midorlo.medina.domain.repository.NotificationRepository;
import com.midorlo.medina.domain.repository.PostRepository;
import com.midorlo.medina.web.dto.NotificationDtos;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.format.datetime.standard.DateTimeFormatterFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final PostRepository postRepository;

    public NotificationController(NotificationRepository notificationRepository, PostRepository postRepository) {
        this.notificationRepository = notificationRepository;
        this.postRepository = postRepository;
    }

    @GetMapping
    public ResponseEntity<Page<NotificationDtos.NotificationItem>> list(
            @RequestHeader(name = "X-User-Id", required = false) Long currentUserId,
            Pageable pageable
    ) {
        if (currentUserId == null) {
            return ResponseEntity.ok(Page.empty(pageable));
        }
        DateTimeFormatter timeFmt = new DateTimeFormatterFactory("HH:mm").createDateTimeFormatter().withZone(ZoneId.systemDefault());
        var page = notificationRepository.findByRecipient_Id(currentUserId, pageable);
        var content = page.getContent().stream().map(n -> toDto(n, timeFmt)).toList();
        return ResponseEntity.ok(new PageImpl<>(content, pageable, page.getTotalElements()));
    }

    private NotificationDtos.NotificationItem toDto(NotificationEntity n, DateTimeFormatter timeFmt) {
        String title = "Notification";
        String subtitle = "";
        String link = "/";
        String actorName = n.getActor() != null ? (n.getActor().getName() != null ? n.getActor().getName() : n.getActor().getUsername()) : "Someone";
        switch (n.getType()) {
            case NEW_FOLLOWER -> {
                title = "New follower";
                subtitle = "<strong>" + actorName + "</strong> started following you.";
                link = n.getActor() != null ? "/profiles/" + n.getActor().getId() : "/";
            }
            case PHOTO_LIKED -> {
                title = "Photo liked";
                subtitle = "<strong>" + actorName + "</strong> liked your photo.";
                link = n.getSubjectId() != null ? "/photos/" + n.getSubjectId() : "/";
            }
            case POST_COMMENT -> {
                title = "New comment";
                subtitle = "<strong>" + actorName + "</strong> commented on your post.";
                if (n.getSubjectId() != null) {
                    try {
                        Long postId = Long.valueOf(n.getSubjectId());
                        PostEntity post = postRepository.findById(postId).orElse(null);
                        if (post != null && post.getBlog() != null) {
                            link = "/api/blogs/" + post.getBlog().getId() + "/posts/" + post.getId();
                        }
                    } catch (NumberFormatException ignored) { }
                }
            }
            case SERVER_UPDATE -> {
                title = "Server update";
                subtitle = "Your server has been updated to the latest version.";
                link = "/developer/store";
            }
        }
        String time = n.getCreatedAt() != null ? timeFmt.format(n.getCreatedAt()) : "";
        String avatar = n.getActor() != null ? n.getActor().getAvatarUrl() : null;
        boolean read = n.getReadAt() != null;
        return new NotificationDtos.NotificationItem(String.valueOf(n.getId()), title, subtitle, avatar, time, link, read);
    }
}
