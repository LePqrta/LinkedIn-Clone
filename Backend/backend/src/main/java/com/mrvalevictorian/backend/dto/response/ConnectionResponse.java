package com.mrvalevictorian.backend.dto.response;

import lombok.Builder;

@Builder
public record ConnectionResponse(
        int connectionId,
        UserResponse sender,
        UserResponse receiver,
        String status,
        String createdAt
) {}
