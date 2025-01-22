package com.mrvalevictorian.backend.dto;

import com.mrvalevictorian.backend.model.Role;
import lombok.Data;

@Data
public class CreateUserRequest {

    private String username;
    private String password;
    private String email;
    private Role role;
}
