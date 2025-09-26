package com.example.onboarding.controller;

import com.example.onboarding.dto.UserResponse;
import com.example.onboarding.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/pending")
    public ResponseEntity<List<UserResponse>> pending() {
        return ResponseEntity.ok(userService.listPending());
    }

    @PostMapping("/approve/{userId}")
    public ResponseEntity<UserResponse> approve(@PathVariable("userId") Long userId) { // explicit name
        return ResponseEntity.ok(userService.approve(userId));
    }

    @PostMapping("/reject/{userId}")
    public ResponseEntity<UserResponse> reject(@PathVariable("userId") Long userId) { // explicit name
        return ResponseEntity.ok(userService.reject(userId));
    }
}
