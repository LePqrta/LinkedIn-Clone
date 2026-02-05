package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.response.UserResponse;
import com.mrvalevictorian.backend.mapper.AppMapper;
import com.mrvalevictorian.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AppMapper mapper;

        @GetMapping("/users-without-connection")
        public List<UserResponse> findAllUsersWithoutConnection() {
            return userService.getAllUsersWithoutConnection()
                    .stream()
                    .map(mapper::toUserResponse)
                    .toList();
        }
}
