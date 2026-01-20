package com.mrvalevictorian.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record SummaryEditRequest(
        @NotBlank(message = "Summary must not be blank")
        String summary
) {}

