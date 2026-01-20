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
import org.springframework.web.cors.CorsConfiguration; // Import this
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // Import this
import org.springframework.web.cors.CorsConfigurationSource; // Import this

import java.util.List; // Import this

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
                .cors(withDefaults()) // This will now use the apiConfigurationSource bean below
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(x -> x
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/auth/user").hasRole("USER")
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/post/**").hasAnyRole("USER","ADMIN")
                        // ... your other matchers ...
                        .requestMatchers("/connections/**").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/like/**").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/comment/**").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/skills/**").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/jobs/**").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/application/**").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/experiences/**").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/profile/**").hasAnyRole("USER","ADMIN")
                        .requestMatchers("/education/**").hasAnyRole("USER","ADMIN")
                        .anyRequest().authenticated() // Good practice to close any gaps
                )
                .sessionManagement(x -> x.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow your frontend origin
        configuration.setAllowedOriginPatterns(List.of("*")); // Or specific origins like "http://localhost:5173"
        // Allow standard methods including OPTIONS
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Allow all headers (needed for Authorization)
        configuration.setAllowedHeaders(List.of("*"));
        // Allow credentials (needed because your frontend uses credentials: 'include')
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ... existing beans (authenticationProvider, authenticationManager) ...
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