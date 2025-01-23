package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.CreateUserRequest;
import com.mrvalevictorian.backend.enums.RoleEnum;
import com.mrvalevictorian.backend.model.Role;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.RoleRepo;
import com.mrvalevictorian.backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService implements UserDetailsService {

    private final UserRepo userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    private final RoleRepo roleRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElseThrow(() -> new UsernameNotFoundException("User not found"));

    }
    public Optional<User> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    public void createUser(CreateUserRequest request) throws IllegalStateException {
        userRepository.findByUsername(request.getUsername())
                .ifPresent(user -> {
                    throw new IllegalStateException("User already exists: " + user.getUsername());
                });
        userRepository.findByEmail(request.getEmail())
                .ifPresent(user -> {
                    throw new IllegalStateException("Email already exists: " + user.getEmail());
                });
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());

        // Set the role using RoleEnum
        Role role = roleRepository.findByName(RoleEnum.ADMIN)
                .orElseThrow(() -> new RuntimeException("Role not found: " + RoleEnum.ADMIN));
        newUser.setRole(role);

        userRepository.save(newUser);
    }
}
