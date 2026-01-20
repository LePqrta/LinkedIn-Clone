package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.CreateUserRequest;
import com.mrvalevictorian.backend.enums.RoleEnum;
import com.mrvalevictorian.backend.model.User;
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


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElseThrow(() -> new UsernameNotFoundException("User not found"));

    }
    public Optional<User> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    public void createUser(CreateUserRequest request) throws IllegalStateException {
        userRepository.findByUsername(request.username())
                .ifPresent(user -> {
                    throw new IllegalStateException("User already exists: " + user.getUsername());
                });
        userRepository.findByEmail(request.email())
                .ifPresent(user -> {
                    throw new IllegalStateException("Email already exists: " + user.getEmail());
                });

        var newUser = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .role(RoleEnum.ADMIN)
                .build();

        userRepository.save(newUser);
    }
}
