package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderResponse(UUID id, LocalDateTime createdAt, double cost, List<OrderItemResponse> items) {}
