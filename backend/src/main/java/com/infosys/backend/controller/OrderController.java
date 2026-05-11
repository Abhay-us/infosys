package com.infosys.backend.controller;

import com.infosys.backend.dto.CheckoutRequest;
import com.infosys.backend.dto.OrderResponse;
import com.infosys.backend.service.OrderService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public OrderResponse checkout(Principal principal, @Valid @RequestBody CheckoutRequest request) {
        return orderService.checkout(principal.getName(), request);
    }

    @GetMapping("/my")
    public List<OrderResponse> getMyOrders(Principal principal) {
        return orderService.getMyOrders(principal.getName());
    }

    @GetMapping("/my/{orderId}")
    public OrderResponse getMyOrder(Principal principal, @PathVariable Long orderId) {
        return orderService.getMyOrder(principal.getName(), orderId);
    }
}
