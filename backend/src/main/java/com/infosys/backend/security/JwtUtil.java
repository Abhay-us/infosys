package com.infosys.backend.security;

import java.util.Date;

import javax.crypto.SecretKey;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final String SECRET =
      "mysecretkeymysecretkeymysecretkey123";

    private final SecretKey key =
      Keys.hmacShaKeyFor(
         SECRET.getBytes()
      );

    public String generateToken(
        String email
    ){

       return Jwts.builder()
            .subject(email)
            .issuedAt(new Date())
            .expiration(
               new Date(
                 System.currentTimeMillis()
                 + 86400000
               )
            )
            .signWith(key)
            .compact();

    }

    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, String email) {
        String tokenEmail = extractEmail(token);
        return tokenEmail.equals(email) && !extractClaims(token).getExpiration().before(new Date());
    }

    private Claims extractClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException ex) {
            throw new RuntimeException("Invalid JWT token", ex);
        }
    }

}
