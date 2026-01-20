package com.mrvalevictorian.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record LocationEditRequest(
        @NotBlank(message = "Location must not be blank")
        String location
) {}

