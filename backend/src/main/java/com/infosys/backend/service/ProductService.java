package com.infosys.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.infosys.backend.model.Product;
import com.infosys.backend.repository.ProductRepository;

import jakarta.validation.Valid;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(@Valid Product product) {
        return productRepository.save(product);
    }

    public List<Product> getProducts(Boolean activeOnly, String category, String q) {
        boolean onlyActive = activeOnly == null ? true : activeOnly.booleanValue();
        String query = q == null ? null : q.trim();
        String cat = category == null ? null : category.trim();

        List<Product> base;

        if (query != null && !query.isEmpty()) {
            base = productRepository.findByNameContainingIgnoreCase(query);
        } else if (cat != null && !cat.isEmpty()) {
            base = productRepository.findByCategory(cat);
        } else if (onlyActive) {
            base = productRepository.findByIsActiveTrue();
        } else {
            base = productRepository.findAll();
        }

        if (!onlyActive) {
            return base;
        }

        return base.stream()
                .filter(p -> Boolean.TRUE.equals(p.getIsActive()))
                .collect(Collectors.toList());
    }
}

