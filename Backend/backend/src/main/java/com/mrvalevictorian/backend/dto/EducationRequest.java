package com.mrvalevictorian.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record EducationRequest(
        @NotBlank(message = "Institution name must not be blank")
        String institutionName,
        @NotBlank(message = "Degree must not be blank")
        String degree,
        @NotBlank(message = "Field of study must not be blank")
        String fieldOfStudy,
        @NotNull(message = "Start date must not be blank")
        LocalDate startDate,
        LocalDate endDate,
        String description,
        @NotNull(message = "Profile ID must not be null")
        Long profileId
) {
}
