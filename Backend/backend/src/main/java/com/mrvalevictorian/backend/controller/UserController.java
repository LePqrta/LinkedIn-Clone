package com.mrvalevictorian.backend.controller;


import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseEntity;

import java.util.List;


@RestController
@RequestMapping("/user")
@RequiredArgsConstructor //bu annotation direkt koyduğun objelerden constructor oluşturur constructor yazmana gerke yok
public class UserController {
    private final UserService userService;
        @GetMapping("/test")
        public List<User> findAllUsers() {
            return userService.getAllUsers();
        }
        @GetMapping("/users-without-connection")
        public List<User> findAllUsersWithoutConnection() {
            return userService.getAllUsersWithoutConnection();
        }
}
