package com.infosys.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.infosys.backend.model.User;
import com.infosys.backend.service.UserService;
import com.infosys.backend.dto.LoginRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User registerUser(
            @Valid @RequestBody User user) {

        return userService.registerUser(user);

    }

    @PostMapping("/login")
    public String loginUser(
            @RequestBody LoginRequest request) {

        return userService.loginUser(
                request.getEmail(),
                request.getPassword());

    }

    @GetMapping("/validate")
    public ResponseEntity<String> validateToken() {
        return ResponseEntity.ok("Token is valid");
    }

}
