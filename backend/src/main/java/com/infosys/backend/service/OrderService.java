package com.infosys.backend.service;

import com.infosys.backend.dto.CheckoutItemRequest;
import com.infosys.backend.dto.CheckoutRequest;
import com.infosys.backend.dto.OrderItemResponse;
import com.infosys.backend.dto.OrderResponse;
import com.infosys.backend.model.CustomerOrder;
import com.infosys.backend.model.OrderItem;
import com.infosys.backend.model.Product;
import com.infosys.backend.model.User;
import com.infosys.backend.repository.OrderRepository;
import com.infosys.backend.repository.ProductRepository;
import com.infosys.backend.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse checkout(String email, CheckoutRequest request) {
        User user = getUser(email);
        CustomerOrder order = new CustomerOrder();
        order.setUser(user);

        BigDecimal total = BigDecimal.ZERO;

        for (CheckoutItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

            if (!Boolean.TRUE.equals(product.getIsActive())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, product.getName() + " is not available");
            }

            int quantity = itemRequest.getQuantity();
            if (product.getStockQuantity() < quantity) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not enough stock for " + product.getName());
            }

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            product.setStockQuantity(product.getStockQuantity() - quantity);
            order.addItem(new OrderItem(product, quantity, product.getPrice(), lineTotal));
            total = total.add(lineTotal);
        }

        order.setTotalPrice(total);
        CustomerOrder saved = orderRepository.save(order);

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String email) {
        User user = getUser(email);
        return orderRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId()).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getMyOrder(String email, Long orderId) {
        User user = getUser(email);
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getUser().getUserId() != user.getUserId()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot view this order");
        }

        return toResponse(order);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private OrderResponse toResponse(CustomerOrder order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getCategory(),
                        item.getProduct().getImageUrl(),
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getLineTotal()))
                .collect(Collectors.toList());

        return new OrderResponse(
                order.getId(),
                order.getUser().getUserId(),
                order.getTotalPrice(),
                order.getStatus(),
                order.getCreatedAt(),
                items);
    }
}
