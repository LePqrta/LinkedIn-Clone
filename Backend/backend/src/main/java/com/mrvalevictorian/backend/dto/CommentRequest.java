package com.mrvalevictorian.backend.dto;

public record CommentRequest(
        Long postId,
        String content
) {
}
