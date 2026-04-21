package com.example.demo.repository;

import com.example.demo.domain.Pizza;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PizzaRepository extends JpaRepository<Pizza, UUID> {
}