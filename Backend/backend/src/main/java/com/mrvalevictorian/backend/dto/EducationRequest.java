package com.mrvalevictorian.backend.dto;

import java.time.LocalDate;

public record EducationRequest(
        String institutionName,
        String degree,
        String fieldOfStudy,
        LocalDate startDate,
        LocalDate endDate,
        String description,
        Long profileId
) {
}
