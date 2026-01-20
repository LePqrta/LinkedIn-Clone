package com.mrvalevictorian.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record JobCreateRequest(
        @NotBlank(message = "Company name must not be blank")
        String companyName,
        @NotBlank(message = "Title must not be blank")
        String title,
        @NotBlank(message = "Description must not be blank")
        String description,
        @NotBlank(message = "Location must not be blank")
        String location
) {}

