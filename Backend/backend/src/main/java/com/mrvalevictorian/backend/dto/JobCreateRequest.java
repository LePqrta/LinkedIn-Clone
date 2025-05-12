package com.mrvalevictorian.backend.dto;

import lombok.Data;

@Data
public class JobCreateRequest {
    private String companyName;
    private String title;
    private String description;
    private String location;
}
