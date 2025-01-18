package com.mrvalevictorian.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.*;

@Entity
@Table(name = "likes")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
public class Like {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "entry_id", nullable = false)
    private Entry entry;

    @Column(name = "type")
    private String type;

    @Column(name = "created_at")
    private LocalDateTime updatedAt;
}