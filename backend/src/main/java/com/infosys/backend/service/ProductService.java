package com.infosys.backend.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.validation.annotation.Validated;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.infosys.backend.model.Product;
import com.infosys.backend.repository.ProductRepository;

import jakarta.validation.Valid;

@Service
@Validated
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product addProduct(@Valid Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, @Valid Product incoming) {
        Product existing = getProductById(id);
        existing.setName(incoming.getName());
        existing.setDescription(incoming.getDescription());
        existing.setPrice(incoming.getPrice());
        existing.setStockQuantity(incoming.getStockQuantity());
        existing.setCategory(incoming.getCategory());
        existing.setImageUrl(incoming.getImageUrl());
        existing.setIsActive(incoming.getIsActive());

        return productRepository.save(existing);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    public List<Product> getProducts(Boolean activeOnly, String category, String q) {
        boolean onlyActive = activeOnly == null ? true : activeOnly.booleanValue();
        String query = normalize(q);
        String cat = normalize(category);

        return productRepository.findAll().stream()
                .filter(product -> !onlyActive || Boolean.TRUE.equals(product.getIsActive()))
                .filter(product -> cat == null || matchesCategory(product, cat))
                .filter(product -> query == null || matchesQuery(product, query))
                .collect(Collectors.toList());
    }

    private String normalize(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }

        return value.trim().toLowerCase();
    }

    private boolean matchesCategory(Product product, String category) {
        return contains(product.getCategory(), category);
    }

    private boolean matchesQuery(Product product, String query) {
        return contains(product.getName(), query)
                || contains(product.getDescription(), query)
                || contains(product.getCategory(), query);
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase().contains(query);
    }
}
