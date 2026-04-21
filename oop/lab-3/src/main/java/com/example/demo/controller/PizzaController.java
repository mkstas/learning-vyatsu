package com.example.demo.controller;

import com.example.demo.domain.Pizza;
import com.example.demo.service.PizzaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pizzas")
public class PizzaController {
    private final PizzaService pizzaService;

    public PizzaController(PizzaService pizzaService) {
        this.pizzaService = pizzaService;
    }

    @PostMapping
    public Pizza create(@RequestBody Pizza pizza) {
        return pizzaService.createPizza(pizza);
    }

    @GetMapping
    public List<Pizza> getAll() {
        return pizzaService.getAllPizzas();
    }

    @GetMapping("/{id}")
    public Pizza getOne(@PathVariable UUID id) {
        return pizzaService.getPizzaById(id);
    }

    @GetMapping("/{id}/info")
    public String getInfo(@PathVariable UUID id) {
        return pizzaService.getPizzaDisplayInfo(id);
    }

    @GetMapping("/{id}/price")
    public double getPrice(@PathVariable UUID id) {
        return pizzaService.calculatePizzaPrice(id);
    }

    @GetMapping("/{id}/cut")
    public String cut(@PathVariable UUID id) {
        return pizzaService.cutPizza(id);
    }

    @PutMapping("/{id}")
    public Pizza update(@PathVariable UUID id, @RequestBody Pizza pizzaDetails) {
        return pizzaService.updatePizza(id, pizzaDetails);
    }

    @PatchMapping("/{id}/dough")
    public Pizza changeDough(@PathVariable UUID id) {
        return pizzaService.toggleDough(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        pizzaService.deletePizza(id);
    }
}