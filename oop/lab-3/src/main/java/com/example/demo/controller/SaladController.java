package com.example.demo.controller;

import com.example.demo.domain.Salad;
import com.example.demo.service.SaladService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/salads")
@RequiredArgsConstructor
public class SaladController {
    private final SaladService saladService;

    @PostMapping
    public Salad create(@RequestBody Salad salad) {
        return saladService.createSalad(salad);
    }

    @GetMapping
    public List<Salad> getAll() {
        return saladService.getAllSalads();
    }

    @GetMapping("/{id}")
    public Salad getOne(@PathVariable UUID id) {
        return saladService.getSaladById(id);
    }

    @GetMapping("/{id}/info")
    public String getInfo(@PathVariable UUID id) {
        return saladService.getSaladDisplayInfo(id);
    }

    @GetMapping("/{id}/price")
    public double getPrice(@PathVariable UUID id) {
        return saladService.calculateSaladPrice(id);
    }

    @GetMapping("/{id}/toss")
    public String toss(@PathVariable UUID id) {
        return saladService.tossSalad(id);
    }

    @PutMapping("/{id}")
    public Salad update(@PathVariable UUID id, @RequestBody Salad saladDetails) {
        return saladService.updateSalad(id, saladDetails);
    }

    @PatchMapping("/{id}/dressing")
    public Salad changeDressing(@PathVariable UUID id) {
        return saladService.toggleDressing(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) {
        saladService.deleteSalad(id);
    }
}