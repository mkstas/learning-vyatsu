package com.example.demo.repository;

import com.example.demo.domain.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DishRepository extends JpaRepository<Dish, UUID> {
}