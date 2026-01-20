package com.mrvalevictorian.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SkillRequest(
        @NotBlank(message = "Skill name cannot be blank")
        String skillName,
        @NotNull(message = "Profile ID is required")
        Long profileId
) {}

