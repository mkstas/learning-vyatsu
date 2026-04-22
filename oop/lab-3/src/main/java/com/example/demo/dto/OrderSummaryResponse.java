package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record OrderSummaryResponse(UUID id, LocalDateTime createdAt, double cost) {}
