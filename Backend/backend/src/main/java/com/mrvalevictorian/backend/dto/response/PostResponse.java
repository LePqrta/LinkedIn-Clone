package com.mrvalevictorian.backend.dto.response;

import lombok.Builder;

@Builder
public record PostResponse(
        Long postId,
        UserResponse user,
        String content,
        String createdAt
) {
}
