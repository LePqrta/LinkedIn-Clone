package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.CreateUserRequest;
import com.mrvalevictorian.backend.enums.RoleEnum;
import com.mrvalevictorian.backend.model.Role;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.RoleRepo;
import com.mrvalevictorian.backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final RoleRepo roleRepository;
    private final UserRepo userRepository;
    public User createUser(CreateUserRequest request) {
        userRepository.findByUsername(request.getUsername())
                .ifPresent(user -> {
                    throw new IllegalStateException("User already exists: " + user.getUsername());
                });
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            throw new IllegalStateException("Email already exists: " + user.getEmail());
        });
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());

        // Set the role using RoleEnum
        Role role = roleRepository.findByName(RoleEnum.USER)
                .orElseThrow(() -> new RuntimeException("Role not found: " + RoleEnum.USER));
        newUser.setRole(role);

        return userRepository.save(newUser);
    }
}
