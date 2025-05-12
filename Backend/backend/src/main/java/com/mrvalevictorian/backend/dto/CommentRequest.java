package com.mrvalevictorian.backend.dto;

import lombok.Data;

@Data
public class CommentRequest {
    private String content;
    private Long postId;
}
