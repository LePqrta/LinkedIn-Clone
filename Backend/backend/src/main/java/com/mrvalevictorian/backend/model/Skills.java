package com.mrvalevictorian.backend.model;


import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "skills")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Skills {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "skill_id", nullable = false)
    private int id;

    @Column(name = "skill_name")
    private String skillName;

    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

}
