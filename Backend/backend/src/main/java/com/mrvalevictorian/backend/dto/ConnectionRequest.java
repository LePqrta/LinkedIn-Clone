package com.mrvalevictorian.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record ConnectionRequest(
        @NotBlank(message = "Username cannot be blank")
        String username
) {
}
