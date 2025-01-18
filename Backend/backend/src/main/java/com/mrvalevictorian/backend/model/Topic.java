package com.mrvalevictorian.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name = "topics")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}