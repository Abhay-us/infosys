package com.infosys.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infosys.backend.dto.CartRequest;
import com.infosys.backend.dto.CartResponse;
import com.infosys.backend.service.CartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/carts")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping
    public CartResponse createCart(@Valid @RequestBody CartRequest request) {
        return cartService.createCart(request.getUserId());
    }

    @GetMapping("/{id}")
    public CartResponse getCartById(@PathVariable Long id) {
        return cartService.getCartById(id);
    }

    @GetMapping("/by-user/{userId}")
    public CartResponse getCartByUserId(@PathVariable int userId) {
        return cartService.getCartByUserId(userId);
    }

    @GetMapping
    public List<CartResponse> getAllCarts() {
        return cartService.getAllCarts();
    }

    @PutMapping("/{id}")
    public CartResponse updateCart(@PathVariable Long id, @Valid @RequestBody CartRequest request) {
        return cartService.updateCart(id, request.getUserId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id) {
        cartService.deleteCart(id);
        return ResponseEntity.noContent().build();
    }
}

