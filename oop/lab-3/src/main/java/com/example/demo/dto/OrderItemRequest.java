package com.example.demo.dto;

import java.util.UUID;

public record OrderItemRequest(UUID dishId, int quantity) {}
