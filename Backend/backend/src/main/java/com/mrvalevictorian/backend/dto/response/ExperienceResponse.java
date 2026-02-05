package com.mrvalevictorian.backend.dto.response;

import lombok.Builder;

@Builder
public record ExperienceResponse(
        int experienceId,
        ProfileResponse profile,
        String companyName,
        String jobTitle,
        String startDate,
        String endDate,
        String description){
}
