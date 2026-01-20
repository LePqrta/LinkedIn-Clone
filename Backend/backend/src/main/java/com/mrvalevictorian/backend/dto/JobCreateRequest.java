package com.mrvalevictorian.backend.dto;

public record JobCreateRequest(
        String companyName,
        String title,
        String description,
        String location
) {}

