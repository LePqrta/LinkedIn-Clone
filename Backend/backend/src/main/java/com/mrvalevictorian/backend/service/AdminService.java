package com.mrvalevictorian.backend.service;

import com.mrvalevictorian.backend.dto.CreateUserRequest;
import com.mrvalevictorian.backend.enums.RoleEnum;
import com.mrvalevictorian.backend.model.Role;
import com.mrvalevictorian.backend.model.User;
import com.mrvalevictorian.backend.repo.RoleRepo;
import com.mrvalevictorian.backend.repo.UserRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AdminService implements UserDetailsService {

    private final UserRepo userRepository;

    private final BCryptPasswordEncoder passwordEncoder;

    private final RoleRepo roleRepository;


    public AdminService(UserRepo userRepository, BCryptPasswordEncoder passwordEncoder, RoleRepo roleRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        return user.orElseThrow(() -> new UsernameNotFoundException("User not found"));

    }
    public Optional<User> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    public User createUser(CreateUserRequest request) {

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

        return userRepository.save(newUser);
    }
}
