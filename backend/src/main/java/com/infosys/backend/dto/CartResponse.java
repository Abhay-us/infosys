package com.infosys.backend.dto;

import java.time.LocalDateTime;

public class CartResponse {

    private Long id;
    private int userId;
    private LocalDateTime createdAt;

    public CartResponse(Long id, int userId, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public int getUserId() {
        return userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}

