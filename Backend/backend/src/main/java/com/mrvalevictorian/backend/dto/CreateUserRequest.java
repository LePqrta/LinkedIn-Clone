package com.mrvalevictorian.backend.dto;

public record CreateUserRequest(
        String username,
        String password,
        String email,
        String name,
        String surname
) {}