package com.mrvalevictorian.backend.dto;

public record PostingRequest(
        String content,
        byte[] image
) {}

