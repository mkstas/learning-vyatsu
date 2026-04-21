package com.example.demo.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "pizzas")
@PrimaryKeyJoinColumn(name = "dish_id")
@OnDelete(action = OnDeleteAction.CASCADE)
@Getter @Setter
public class Pizza extends Dish {
    public enum Dough { THIN, THICK }

    @Enumerated(EnumType.STRING)
    private Dough dough = Dough.THICK;

    public Pizza() { super(); }
    public Pizza(String name) { super(name); }
    public Pizza(String name, int weight, double price) { super(name, weight, price); }

    public void changeDough() {
        this.dough = (this.dough == Dough.THIN) ? Dough.THICK : Dough.THIN;
    }

    public String cutInSlices() {
        return "Cutting the pizza " + getName() + " into slices...";
    }

    @Override
    public String displayInfo() {
        return String.format("Pizza: %s, %s dough, %dg, $%s",
                getName(), getDough(), getWeight(), calcFullPrice());
    }

    @Override
    public double calcFullPrice() {
        double factor = (this.dough == Dough.THIN) ? 1.3 : 1.5;
        double result = getPrice() * factor;
        return BigDecimal.valueOf(result)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }
}