package com.infosys.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

        @Bean
        public BCryptPasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http)
                        throws Exception {

                http
                                .csrf(csrf -> csrf.disable()) // VERY IMPORTANT

                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/api/users/register",
                                                                "/api/users/login")
                                                .permitAll() // allow these APIs

                                                .anyRequest().authenticated())

                                .formLogin(form -> form.disable()) // disable login page

                                .httpBasic(basic -> basic.disable()); // disable basic auth

                return http.build();
        }
}