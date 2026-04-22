package com.example.demo.dto;

import java.util.UUID;

public record DishResponse(
        UUID id,
        String name,
        int weight,
        double price,
        String type,
        String fill
) {}
