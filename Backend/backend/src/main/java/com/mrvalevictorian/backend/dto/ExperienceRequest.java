package com.mrvalevictorian.backend.dto;

import java.time.LocalDate;

public record ExperienceRequest(
        Long profileId,
        String companyName,
        String description,
        LocalDate endDate,
        LocalDate startDate,
        String jobTitle
) {
}
