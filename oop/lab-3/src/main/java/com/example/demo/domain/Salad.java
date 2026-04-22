package com.example.demo.domain;

import com.example.demo.dto.DishResponse;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "salads")
@PrimaryKeyJoinColumn(name = "dish_id")
@OnDelete(action = OnDeleteAction.CASCADE)
@Getter @Setter
public class Salad extends Dish {
    public enum Dressing { OLIVE_OIL, MAYONNAISE }

    @Enumerated(EnumType.STRING)
    private Dressing dressing = Dressing.OLIVE_OIL;

    public Salad() { super(); }
    public Salad(String name) { super(name); }
    public Salad(String name, int weight, double price) { super(name, weight, price); }

    public void changeDressing() {
        this.dressing = (this.dressing == Dressing.OLIVE_OIL) ? Dressing.MAYONNAISE : Dressing.OLIVE_OIL;
    }

    public String tossWithDressing() {
        return "Tossing the salad " + getName() + " with " + getDressing() + "...";
    }

    @Override
    public String displayInfo() {
        return String.format("Salad: %s, %s dressing, %dg, $%s",
                getName(), getDressing(), getWeight(), calcFullPrice());
    }

    @Override
    public double calcFullPrice() {
        double factor = (this.dressing == Dressing.OLIVE_OIL) ? 1.4 : 1.3;
        double result = getPrice() * factor;
        return BigDecimal.valueOf(result)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    @Override
    public DishResponse getInfo() {
        return new DishResponse(
                getId(),
                getName(),
                getWeight(),
                getPrice(),
                "Salad",
                getDressing().name()
        );
    }
}