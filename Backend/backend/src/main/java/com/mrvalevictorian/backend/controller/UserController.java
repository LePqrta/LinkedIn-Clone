package com.mrvalevictorian.backend.controller;

import com.mrvalevictorian.backend.dto.AuthRequest;
import com.mrvalevictorian.backend.dto.CreateUserRequest;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.service.AdminService;
import com.mrvalevictorian.backend.service.JwtService;
import com.mrvalevictorian.backend.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;

    private final JwtService jwtService;

    private final AuthenticationManager authenticationManager;

    private final AdminService adminService;


    public UserController(UserService service, JwtService jwtService, AuthenticationManager authenticationManager, AdminService adminService) {
        this.userService = service;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.adminService = adminService;
    }

    @GetMapping("/welcome")
    public String welcome() {
        System.out.println("alkfdşkals");
        return "Hello World! this is FOLSDEV";
    }
    @PostMapping("/asd")
    public String asd(@RequestBody String asd) {
        System.out.println(asd);
        return asd;
    }

    @PostMapping("/addNewUser")
    public User addUser(@RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }
    @PostMapping("/addNewAdmin")
    public User addAdmin(@RequestBody CreateUserRequest request) {
        return adminService.createUser(request);
    }

    @PostMapping("/generateToken")
    public String generateToken(@RequestBody AuthRequest request) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        if (authentication.isAuthenticated()) {
            return jwtService.generateToken(request.getUsername());
        }
        throw new UsernameNotFoundException("invalid username {} " + request.getUsername());
    }

    @GetMapping("/user")
    public String getUserString() {
        System.out.println("lafkjşalkfdsjfşlakdsjfşl");
        return "This is USER!";
    }

    @GetMapping("/admin")
    public String getAdminString() {
        return "This is ADMIN!";
    }
}
