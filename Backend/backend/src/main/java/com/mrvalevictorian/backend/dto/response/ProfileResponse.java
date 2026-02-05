package com.mrvalevictorian.backend.dto.response;

import lombok.Builder;

@Builder
public record ProfileResponse(
        int id,
        UserResponse user,
        String location,
        String summary
) {
}
