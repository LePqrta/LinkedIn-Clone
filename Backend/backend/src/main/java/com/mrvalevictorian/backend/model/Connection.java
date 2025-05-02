package com.mrvalevictorian.backend.model;


import com.mrvalevictorian.backend.enums.StatusEnum;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "connections")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Connection {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "connection_id")
    private int connectionId;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusEnum status = StatusEnum.PENDING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt ;


}
