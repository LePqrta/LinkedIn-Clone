package com.mrvalevictorian.backend.security;

import com.mrvalevictorian.backend.repo.UserRepo;
import com.mrvalevictorian.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    private final UserService userService;

    private final PasswordEncoder passwordEncoder;

    private final UserRepo userRepo;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(x ->
                        x.requestMatchers("/auth/**").permitAll()
                )
                .authorizeHttpRequests(x ->
                        x.requestMatchers("/auth/user").hasRole("USER")
                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                .requestMatchers("/post/**").hasAnyRole("USER","ADMIN")
                                .requestMatchers("/user/**").hasAnyRole("ADMIN","USER")
                                .requestMatchers("/connections/**").hasAnyRole("USER","ADMIN")
                                .requestMatchers("/like/**").hasAnyRole("USER","ADMIN")
                                .requestMatchers("/comment/**").hasAnyRole("USER","ADMIN")
                                .requestMatchers("/skills/**").hasAnyRole("USER","ADMIN")
                                .requestMatchers("/jobs/**").hasAnyRole("USER","ADMIN")
                                .requestMatchers("/application/**").hasAnyRole("USER","ADMIN")
                                .requestMatchers("/experiences/**").hasAnyRole("USER","ADMIN")
                                .requestMatchers("/profile/**").hasAnyRole("USER","ADMIN")
                                .requestMatchers("/education/**").hasAnyRole("USER","ADMIN")

                )
                .sessionManagement(x -> x.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);
        return authenticationProvider;
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();

    }
}
