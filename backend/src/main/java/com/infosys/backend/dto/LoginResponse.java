package com.infosys.backend.dto;

public class LoginResponse {

    private String token;
    private String role;
    private String redirectTo;

    public LoginResponse(String token, String role, String redirectTo) {
        this.token = token;
        this.role = role;
        this.redirectTo = redirectTo;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }

    public String getRedirectTo() {
        return redirectTo;
    }
}
