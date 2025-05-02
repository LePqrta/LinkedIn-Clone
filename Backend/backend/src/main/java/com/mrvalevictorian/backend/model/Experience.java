package com.mrvalevictorian.backend.model;


import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "experience")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "experience_id")
    private int experienceId;

    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile profile;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "job_title")
    private String jobTitle;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "description")
    private String description;
}
