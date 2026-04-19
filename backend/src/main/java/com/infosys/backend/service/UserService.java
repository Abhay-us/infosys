package com.infosys.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.infosys.backend.model.User;
import com.infosys.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    public User registerUser(User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(
                        user.getEmail()
                );

        if(existingUser.isPresent()) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }


        String encryptedPassword =
                passwordEncoder.encode(
                        user.getPassword()
                );

        user.setPassword(encryptedPassword);

        return userRepository.save(user);
    }

}