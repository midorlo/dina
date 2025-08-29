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
@Table(name = "message_receipts",
       uniqueConstraints = @UniqueConstraint(name = "uk_msg_recipient", columnNames = {"message_id","recipient_id"}),
       indexes = {
           @Index(name = "idx_receipts_recipient_id", columnList = "recipient_id"),
           @Index(name = "idx_receipts_read_at", columnList = "read_at")
       })
public class MessageReceiptEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "message_id", nullable = false)
    private MessageEntity message;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "recipient_id", nullable = false)
    private UserEntity recipient;

    @Column(name = "read_at")
    private Instant readAt;
}

