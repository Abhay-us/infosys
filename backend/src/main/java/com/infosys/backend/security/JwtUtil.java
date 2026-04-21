package com.infosys.backend.security;

import java.security.Key;
import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final String SECRET =
      "mysecretkeymysecretkeymysecretkey123";

    private final Key key =
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

}