package com.mrvalevictorian.backend.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class EducationRequest {

    private String institutionName;
    private String degree;
    private String fieldOfStudy;
    private LocalDate startDate;
    private LocalDate endDate;
    private String description;
    private Long profileId;
}
