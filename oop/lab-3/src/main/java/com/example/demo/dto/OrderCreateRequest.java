package com.example.demo.dto;

import java.util.List;

public record OrderCreateRequest(List<OrderItemRequest> items) {}
