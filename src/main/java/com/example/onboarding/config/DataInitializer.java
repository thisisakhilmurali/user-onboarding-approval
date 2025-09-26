package com.example.onboarding.config;

import com.example.onboarding.model.User;
import com.example.onboarding.model.UserStatus;
import com.example.onboarding.repository.UserRepository;
import com.example.onboarding.service.PasswordHasher;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneId;

@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private static final ZoneId EST_ZONE = ZoneId.of("America/New_York");

    @PostConstruct
    public void init() {
        // Create default admin if not exists
        String adminEmail = "admin@example.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .name("Administrator")
                    .email(adminEmail)
                    .passwordHash(PasswordHasher.hash("Admin@123"))
                    .role("ROLE_ADMIN")
                    .status(UserStatus.APPROVED)
                    .createdDate(OffsetDateTime.now(EST_ZONE))
                    .build();
            userRepository.save(admin);
        }
    }
}

