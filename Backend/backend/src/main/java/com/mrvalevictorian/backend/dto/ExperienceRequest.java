package com.mrvalevictorian.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ExperienceRequest(
        @NotNull(message = "Profile ID is required")
        Long profileId,
        @NotBlank(message = "Company name must not be blank")
        String companyName,
        @NotBlank(message = "Description must not be blank")
        String description,
        LocalDate endDate,
        @NotNull(message = "Start date is required")
        LocalDate startDate,
        @NotBlank(message = "Job title must not be blank")
        String jobTitle
) {
}
