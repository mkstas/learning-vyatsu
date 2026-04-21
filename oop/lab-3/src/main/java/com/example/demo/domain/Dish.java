package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "dishes")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter @Setter
public abstract class Dish {
    @Id
    @GeneratedValue
    private UUID id;
    private String name;
    private int weight;
    private double price;

    protected Dish() {}

    public Dish(String name, int weight, double price) {
        this.name = name;
        this.weight = weight;
        this.price = price;
    }

    public Dish(String name) {
        this(name, 200, 20.0);
    }

    public abstract String displayInfo();
    public abstract double calcFullPrice();
}