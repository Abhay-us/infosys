package com.infosys.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.infosys.backend.dto.CartResponse;
import com.infosys.backend.model.Cart;
import com.infosys.backend.model.User;
import com.infosys.backend.repository.CartRepository;
import com.infosys.backend.repository.UserRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    public CartResponse createCart(int userId) {
        if (cartRepository.findByUserUserId(userId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Cart already exists for this user");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Cart saved = cartRepository.save(new Cart(user));
        return toResponse(saved);
    }

    public CartResponse getCartById(Long id) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));
        return toResponse(cart);
    }

    public CartResponse getCartByUserId(int userId) {
        Cart cart = cartRepository.findByUserUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found for this user"));
        return toResponse(cart);
    }

    public List<CartResponse> getAllCarts() {
        return cartRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CartResponse updateCart(Long cartId, int userId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        if (cart.getUser() != null && cart.getUser().getUserId() == userId) {
            return toResponse(cart);
        }

        cartRepository.findByUserUserId(userId).ifPresent(existing -> {
            if (!existing.getId().equals(cartId)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Cart already exists for this user");
            }
        });

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        cart.setUser(user);
        Cart saved = cartRepository.save(cart);
        return toResponse(saved);
    }

    public void deleteCart(Long id) {
        if (!cartRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found");
        }
        cartRepository.deleteById(id);
    }

    private CartResponse toResponse(Cart cart) {
        int userId = cart.getUser() == null ? 0 : cart.getUser().getUserId();
        return new CartResponse(cart.getId(), userId, cart.getCreatedAt());
    }
}

