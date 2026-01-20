package com.mrvalevictorian.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record PostingRequest(
        @NotBlank (message = "Content must not be blank")
        String content,
        byte[] image
) {}

