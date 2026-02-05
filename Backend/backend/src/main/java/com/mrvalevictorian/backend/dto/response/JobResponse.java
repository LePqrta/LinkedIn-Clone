package com.mrvalevictorian.backend.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record JobResponse(
        int jobId,
        UserResponse recruiter,
        String companyName,
        String title,
        String description,
        String location,
        LocalDateTime postedAt
) {}
