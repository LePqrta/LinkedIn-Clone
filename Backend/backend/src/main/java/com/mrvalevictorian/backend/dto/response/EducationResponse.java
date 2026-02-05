package com.mrvalevictorian.backend.dto.response;

import lombok.Builder;

@Builder
public record EducationResponse(
        Integer educationId,
        String institutionName,
        String degree,
        String fieldOfStudy,
        String startDate,
        String endDate
) {
}
