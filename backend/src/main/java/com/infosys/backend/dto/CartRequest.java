package com.infosys.backend.dto;

import jakarta.validation.constraints.Positive;

public class CartRequest {

    @Positive(message = "userId must be positive")
    private int userId;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
}

