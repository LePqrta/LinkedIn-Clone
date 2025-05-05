package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.CreateUserRequest;
import com.mrvalevictorian.backend.enums.RoleEnum;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepository;
    private final Map<String, User> tokenStorage = new HashMap<>();
    private final EmailService emailService;

    public void createUser(CreateUserRequest request) {
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
        newUser.setRole(RoleEnum.USER);

        userRepository.save(newUser);

//        try {
//            // Doğrulama token'ı oluştur
//            String token = createVerificationToken(newUser);
//
//            // Doğrulama email'i gönder
//            emailService.sendVerificationEmail(newUser.getEmail(), token);
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to send verification email", e);
//        }
    }


    public String createVerificationToken(User user) {
        // Benzersiz bir token oluştur
        String token = UUID.randomUUID().toString();
        tokenStorage.put(token, user);
        return token;
    }

    public boolean verifyUser(String token) {
        User user = tokenStorage.get(token);
        if (user != null) {
            user.setVerified(true);
            userRepository.save(user);
            tokenStorage.remove(token);
            return true;
        }
        return false;
    }


}
