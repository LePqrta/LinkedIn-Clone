package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.AuthRequest;
import com.mrvalevictorian.backend.dto.CreateUserRequest;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.UserRepo;
import com.mrvalevictorian.backend.service.AuthService;
import com.mrvalevictorian.backend.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepo userRepo;


    @PostMapping("/register")
    public ResponseEntity<String> addUser(@RequestBody @Valid CreateUserRequest request) {
        authService.createUser(request);

        return new ResponseEntity<>("User created successfully", HttpStatus.OK);
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> generateToken(@RequestBody @Valid AuthRequest request) {
        var map = authService.login(request);

        return new ResponseEntity<>(map, HttpStatus.OK);
    }//postman scriptinin çalışması için json olarak alıyorum outputu.
    //generateToken'ı login yaptım içinde script'e bak script orada

    @GetMapping("/verify")
    public String verifyUser(@RequestParam("token") String token) {
        boolean isVerified = authService.verifyUser(token);
        if (isVerified) {
            return "Email verified successfully.";
        } else {
            return "Invalid or expired token.";
        }
    }
    @GetMapping("/test")
    public User returnUser() {
        String username = jwtService.extractUser(jwtService.getToken());
        // find the user by username, if exists, set the user, if not, throw an exception
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
}
}
