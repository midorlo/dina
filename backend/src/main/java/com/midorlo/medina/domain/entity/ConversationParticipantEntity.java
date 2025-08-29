package com.midorlo.medina.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "conversation_participants",
       uniqueConstraints = @UniqueConstraint(name = "uk_conv_user", columnNames = {"conversation_id","user_id"}),
       indexes = {
           @Index(name = "idx_conv_part_user_id", columnList = "user_id"),
           @Index(name = "idx_conv_part_conv_id", columnList = "conversation_id")
       })
public class ConversationParticipantEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "conversation_id", nullable = false)
    private ConversationEntity conversation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private Instant joinedAt;
}

