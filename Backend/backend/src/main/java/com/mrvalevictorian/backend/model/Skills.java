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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id", nullable = false)
    private Long id; // int -> Long olarak değiştirildi

    @Column(name = "skill_name")
    private String skillName;

    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    //Skill explanation may be added in the future

}
