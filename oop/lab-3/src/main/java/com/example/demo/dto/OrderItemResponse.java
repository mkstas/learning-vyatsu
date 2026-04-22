package com.example.demo.dto;

import java.util.UUID;

public record OrderItemResponse(UUID id, DishResponse dish, int quantity) {}
