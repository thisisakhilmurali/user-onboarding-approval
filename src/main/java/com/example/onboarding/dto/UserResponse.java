package com.example.onboarding.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String status;
    private String role;
    private String createdDate; // ISO string
}

