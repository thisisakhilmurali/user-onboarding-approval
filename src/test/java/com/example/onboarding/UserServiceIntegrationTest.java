package com.example.onboarding;

import com.example.onboarding.dto.RegistrationRequest;
import com.example.onboarding.dto.UserResponse;
import com.example.onboarding.model.UserStatus;
import com.example.onboarding.repository.UserRepository;
import com.example.onboarding.service.UserService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;
import java.util.UUID;

@SpringBootTest
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void registerAndApproveFlow() {
        RegistrationRequest req = new RegistrationRequest();
        req.setName("Test User");
        req.setEmail("u" + UUID.randomUUID().toString().substring(0,8) + "@example.com");
        req.setPassword("Password123");
        UserResponse created = userService.register(req);
        Assertions.assertEquals(UserStatus.PENDING.name(), created.getStatus());

        List<UserResponse> pending = userService.listPending();
        Assertions.assertTrue(pending.stream().anyMatch(u -> u.getId().equals(created.getId())));

        UserResponse approved = userService.approve(created.getId());
        Assertions.assertEquals(UserStatus.APPROVED.name(), approved.getStatus());
    }
}

