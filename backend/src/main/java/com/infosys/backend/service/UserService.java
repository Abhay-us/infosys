package com.infosys.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.infosys.backend.dto.LoginResponse;
import com.infosys.backend.model.User;
import com.infosys.backend.repository.UserRepository;
import com.infosys.backend.security.JwtUtil;

@Service
public class UserService {

        @Autowired
        private JwtUtil jwtUtil;
        @Autowired
        private UserRepository userRepository;

        @Autowired
        private BCryptPasswordEncoder passwordEncoder;

        @Value("${app.admin.email}")
        private String adminEmail;

        @Value("${app.admin.password}")
        private String adminPassword;

        public User registerUser(User user) {

                Optional<User> existingUser = userRepository.findByEmail(
                                user.getEmail());

                if (existingUser.isPresent()) {

                        throw new RuntimeException(
                                        "Email already registered");
                }

                String encryptedPassword = passwordEncoder.encode(
                                user.getPassword());

                user.setPassword(encryptedPassword);

                return userRepository.save(user);
        }

        public LoginResponse loginUser(
                        String email,
                        String password) {

                if (adminEmail.equalsIgnoreCase(email) && adminPassword.equals(password)) {
                        return new LoginResponse(jwtUtil.generateToken(adminEmail), "ADMIN", "/admin");
                }

                User user = userRepository.findByEmail(email)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found"));

                if (!passwordEncoder.matches(
                                password,
                                user.getPassword())) {
                        throw new RuntimeException(
                                        "Invalid password");
                }

                return new LoginResponse(jwtUtil.generateToken(email), "USER", "/products");

        }
}
