package com.mrvalevictorian.backend.dto.response;

import lombok.Builder;

@Builder
public record CommentResponse(
        Long commentId,
        PostResponse post,
        UserResponse author,
        String content,
        String createdAt
) {
}
