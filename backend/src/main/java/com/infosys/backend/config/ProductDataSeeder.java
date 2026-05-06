package com.infosys.backend.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.infosys.backend.model.Product;
import com.infosys.backend.repository.ProductRepository;

@Configuration
public class ProductDataSeeder {

    @Bean
    CommandLineRunner seedProducts(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() > 0) {
                return;
            }

            List<Product> defaults = List.of(
                    new Product(
                            "Noise-Canceling Headphones",
                            "Wireless over-ear headphones with active noise cancellation, 40-hour battery life, and fast charging.",
                            new BigDecimal("4999.00"),
                            32,
                            "Electronics",
                            "https://images.unsplash.com/photo-1518445695493-6d6c6b0d7b9f?auto=format&fit=crop&w=1200&q=70"),
                    new Product(
                            "Stainless Steel Water Bottle (1L)",
                            "Vacuum-insulated bottle that keeps drinks cold for 24 hours and hot for 12 hours. Leak-proof lid and easy-carry handle.",
                            new BigDecimal("899.00"),
                            120,
                            "Home & Kitchen",
                            "https://images.unsplash.com/photo-1526401485004-2aa7f3bb78f5?auto=format&fit=crop&w=1200&q=70"),
                    new Product(
                            "Running Shoes",
                            "Lightweight daily trainers with breathable mesh upper, cushioned midsole, and durable outsole for road runs.",
                            new BigDecimal("2799.00"),
                            54,
                            "Sports",
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=70"),
                    new Product(
                            "Ergonomic Office Chair",
                            "High-back chair with adjustable lumbar support, headrest, and armrests. Designed for long work sessions.",
                            new BigDecimal("7499.00"),
                            18,
                            "Furniture",
                            "https://images.unsplash.com/photo-1582582429413-21baf3b594b9?auto=format&fit=crop&w=1200&q=70"),
                    new Product(
                            "Smartwatch",
                            "Health tracking smartwatch with heart-rate monitoring, sleep insights, notifications, and 7-day battery life.",
                            new BigDecimal("5999.00"),
                            41,
                            "Electronics",
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=70"),
                    new Product(
                            "Non-stick Cookware Set",
                            "5-piece non-stick cookware set with even heat distribution and easy-clean coating. Works on gas and induction.",
                            new BigDecimal("3299.00"),
                            26,
                            "Home & Kitchen",
                            "https://images.unsplash.com/photo-1556910096-6f5e72db6803?auto=format&fit=crop&w=1200&q=70"));

            productRepository.saveAll(defaults);
        };
    }
}

