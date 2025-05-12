package com.mrvalevictorian.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ExperienceRequest {


    private Long profileId;
    private String companyName;
    private String description;
    private LocalDate endDate;
    private LocalDate startDate;
    private String jobTitle;

}
