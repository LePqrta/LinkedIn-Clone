package com.mrvalevictorian.backend.dto.response;

import lombok.Builder;

import java.util.UUID;

@Builder
public record UserResponse(
        UUID id,
        String username,
        String name,
        String surname
) {
}
