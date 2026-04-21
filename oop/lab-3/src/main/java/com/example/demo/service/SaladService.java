package com.example.demo.service;

import com.example.demo.domain.Salad;
import com.example.demo.repository.SaladRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SaladService {
    private final SaladRepository saladRepository;

    @Transactional
    public Salad createSalad(Salad salad) {
        return saladRepository.save(salad);
    }

    public List<Salad> getAllSalads() {
        return saladRepository.findAll();
    }

    public Salad getSaladById(UUID id) {
        return saladRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salad with id: " + id + " not found"));
    }

    @Transactional
    public Salad updateSalad(UUID id, Salad saladDetails) {
        Salad existingSalad = getSaladById(id);
        existingSalad.setName(saladDetails.getName());
        existingSalad.setWeight(saladDetails.getWeight());
        existingSalad.setPrice(saladDetails.getPrice());
        existingSalad.setDressing(saladDetails.getDressing());
        return saladRepository.save(existingSalad);
    }

    @Transactional
    public void deleteSalad(UUID id) {
        if (!saladRepository.existsById(id)) {
            throw new RuntimeException("Salad with id: " + id + " not found");
        }
        saladRepository.deleteById(id);
    }

    @Transactional
    public Salad toggleDressing(UUID id) {
        Salad salad = getSaladById(id);
        salad.changeDressing();
        return salad;
    }

    public String tossSalad(UUID id) {
        return getSaladById(id).tossWithDressing();
    }

    public String getSaladDisplayInfo(UUID id) {
        return getSaladById(id).displayInfo();
    }

    public double calculateSaladPrice(UUID id) {
        return getSaladById(id).calcFullPrice();
    }
}