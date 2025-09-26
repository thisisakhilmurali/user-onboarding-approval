package com.example.onboarding.service;

import com.example.onboarding.dto.AuthResponse;
import com.example.onboarding.dto.LoginRequest;
import com.example.onboarding.dto.RegistrationRequest;
import com.example.onboarding.dto.UserResponse;
import com.example.onboarding.model.User;
import com.example.onboarding.model.UserStatus;
import com.example.onboarding.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    private static final ZoneId EST_ZONE = ZoneId.of("America/New_York");

    @Transactional
    public UserResponse register(RegistrationRequest req) {
        if (userRepository.existsByEmail(req.getEmail().toLowerCase())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
                .name(req.getName().trim())
                .email(req.getEmail().trim().toLowerCase())
                .passwordHash(PasswordHasher.hash(req.getPassword()))
                .status(UserStatus.PENDING)
                .role("ROLE_USER")
                .createdDate(OffsetDateTime.now(EST_ZONE))
                .build();
        userRepository.save(user);
        return toResponse(user);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        if (!user.getPasswordHash().equals(PasswordHasher.hash(req.getPassword()))) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("status", user.getStatus().name());
        String token = jwtService.generateToken(user.getEmail(), claims);
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole())
                .status(user.getStatus().name())
                .build();
    }

    public List<UserResponse> listPending() {
        return userRepository.findByStatus(UserStatus.PENDING).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // New method for fetching current authenticated user
    public UserResponse getByEmail(String email) {
        User user = userRepository.findByEmail(email.toLowerCase()).orElseThrow(() -> new IllegalArgumentException("User not found"));
        return toResponse(user);
    }

    @Transactional
    public UserResponse approve(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(UserStatus.APPROVED);
        return toResponse(user);
    }

    @Transactional
    public UserResponse reject(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setStatus(UserStatus.REJECTED);
        return toResponse(user);
    }

    private UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .status(u.getStatus().name())
                .role(u.getRole())
                .createdDate(u.getCreatedDate().toString())
                .build();
    }
}
