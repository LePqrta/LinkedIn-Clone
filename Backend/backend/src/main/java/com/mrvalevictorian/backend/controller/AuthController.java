package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.AuthRequest;
import com.mrvalevictorian.backend.dto.CreateUserRequest;
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
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(request.getUsername());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);
        }
        throw new UsernameNotFoundException("invalid username {} " + request.getUsername());
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
}
