package com.mrvalevictorian.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name = "entries")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Entry {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "content")
    private String content;

    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}