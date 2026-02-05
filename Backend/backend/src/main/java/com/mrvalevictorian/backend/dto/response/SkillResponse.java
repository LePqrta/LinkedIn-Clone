package com.mrvalevictorian.backend.dto.response;

import lombok.Builder;

@Builder
public record SkillResponse(
        String skillName,
        Long profileId
) {
}
