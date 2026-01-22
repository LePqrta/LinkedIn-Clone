package com.mrvalevictorian.backend.dto;


import jakarta.validation.constraints.NotBlank;

public record ApplicationRequest (
    @NotBlank(message = "Cover letter must not be blank")
    String coverLetter
) {}