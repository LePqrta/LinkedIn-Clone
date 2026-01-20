package com.mrvalevictorian.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record LikeRequest(
        @NotBlank(message = "Post ID cannot be blank")
        Long postId
) {}

