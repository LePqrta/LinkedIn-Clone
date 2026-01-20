package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.AuthRequest;
import com.mrvalevictorian.backend.dto.CreateUserRequest;
import com.mrvalevictorian.backend.enums.RoleEnum;
import com.mrvalevictorian.backend.model.Profile;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.ProfileRepo;
import com.mrvalevictorian.backend.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final UserRepo userRepository;
    private final Map<String, User> tokenStorage = new HashMap<>();
    private final EmailService emailService;
    private final UserService userService;
    private final JwtService jwtService;
    private final ProfileRepo profileRepo;
    private final AuthenticationManager authenticationManager;

    public void createUser(CreateUserRequest request) {
        userRepository.findByUsername(request.username())
                .ifPresent(user -> {
                    throw new IllegalStateException("User already exists: " + user.getUsername());
                });
        userRepository.findByEmail(request.email()).ifPresent(user -> {
            throw new IllegalStateException("Email already exists: " + user.getEmail());
        });
        var newUser = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .name(request.name())
                .surname(request.surname())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .role(RoleEnum.USER)
                .build();

        userRepository.save(newUser);

        Profile newProfile = new Profile();
        newProfile.setUser(newUser);
        profileRepo.save(newProfile);


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
    public Map<String, String> login(AuthRequest request){
        User user = userService.getByUsername(request.username())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(request.username());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("name", user.getName());
            response.put("surname", user.getSurname());
            return response;
        }
        throw new UsernameNotFoundException("Username can not be found or the password is incorrect");
    }
    /*public String createVerificationToken(User user) {
        // Benzersiz bir token oluştur
        String token = UUID.randomUUID().toString();
        tokenStorage.put(token, user);
        return token;
    }*/

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
