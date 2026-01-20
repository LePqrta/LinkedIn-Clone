package com.mrvalevictorian.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CommentRequest(
        @NotBlank(message = "Post ID is required")
        Long postId,
        @NotBlank(message = "Content cannot be blank")
        String content
) {
}
