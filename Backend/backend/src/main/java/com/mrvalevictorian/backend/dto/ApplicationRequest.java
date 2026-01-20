package com.mrvalevictorian.backend.dto;


import jakarta.validation.constraints.NotBlank;

public record ApplicationRequest (
    //String resumeUrl;
    @NotBlank(message = "Cover letter must not be blank")
    String coverLetter
    //int jobId;
) {}