package com.example.demo.service;

import com.example.demo.domain.Pizza;
import com.example.demo.repository.PizzaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class PizzaService {
    private final PizzaRepository pizzaRepository;

    @Transactional
    public Pizza createPizza(Pizza pizza) {
        return pizzaRepository.save(pizza);
    }

    public List<Pizza> getAllPizzas() {
        return pizzaRepository.findAll();
    }

    public Pizza getPizzaById(UUID id) {
        return pizzaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pizza with id: " + id + " not found"));
    }

    @Transactional
    public Pizza updatePizza(UUID id, Pizza pizzaDetails) {
        Pizza existingPizza = getPizzaById(id);
        existingPizza.setName(pizzaDetails.getName());
        existingPizza.setWeight(pizzaDetails.getWeight());
        existingPizza.setPrice(pizzaDetails.getPrice());
        existingPizza.setDough(pizzaDetails.getDough());
        return pizzaRepository.save(existingPizza);
    }

    @Transactional
    public void deletePizza(UUID id) {
        if (!pizzaRepository.existsById(id)) {
            throw new RuntimeException("Pizza with id: " + id + " not found");
        }
        pizzaRepository.deleteById(id);
    }

    @Transactional
    public Pizza toggleDough(UUID id) {
        Pizza pizza = getPizzaById(id);
        pizza.changeDough();
        return pizza;
    }

    public double calculatePizzaPrice(UUID id) {
        return getPizzaById(id).calcFullPrice();
    }

    public String getPizzaDisplayInfo(UUID id) {
        return getPizzaById(id).displayInfo();
    }

    public String cutPizza(UUID id) {
        return getPizzaById(id).cutInSlices();
    }
}