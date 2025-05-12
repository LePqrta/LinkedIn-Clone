package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.AuthRequest;
import com.mrvalevictorian.backend.dto.CreateUserRequest;
import com.mrvalevictorian.backend.exceptions.UserNotFoundException;
import com.mrvalevictorian.backend.repo.UserRepo;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.service.AuthService;
import com.mrvalevictorian.backend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    private final JwtService jwtService;

    private final UserRepo userRepo;

    private final AuthenticationManager authenticationManager;


    @PostMapping("/register")
    public ResponseEntity<String> addUser(@RequestBody CreateUserRequest request) {
        try {
            authService.createUser(request);

            return new ResponseEntity<>("User created successfully", HttpStatus.OK);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> generateToken(@RequestBody AuthRequest request) {
        System.out.println("Login isteği alındı: " + request.getEmail());
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            System.out.println("Authentication sonucu: " + authentication.isAuthenticated());
            if (authentication.isAuthenticated()) {
                String token = jwtService.generateToken(request.getEmail());
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                return ResponseEntity.ok(response);
            }
            throw new UsernameNotFoundException("invalid username {} " + request.getEmail());
        } catch (Exception e) {
            System.out.println("Authentication hatası: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

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
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return user;
    }
}
