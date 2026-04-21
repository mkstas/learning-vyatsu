package com.example.demo.service;

import com.example.demo.domain.*;
import com.example.demo.dto.OrderCreateRequest;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final DishRepository dishRepository;

    @Transactional
    public Order createOrder(OrderCreateRequest request) {
        Order order = new Order();

        for (var itemReq : request.items()) {
            Dish dish = dishRepository.findById(itemReq.dishId())
                    .orElseThrow(() -> new RuntimeException("Dish not found"));

            OrderItem item = new OrderItem();
            item.setDish(dish);
            item.setQuantity(itemReq.quantity());
            item.setOrder(order);

            order.getItems().add(item);
        }

        updateOrderCost(order);
        return orderRepository.save(order);
    }

    @Transactional
    public void updateOrderCost(Order order) {
        double total = order.getItems().stream()
                .mapToDouble(item -> item.getDish().calcFullPrice() * item.getQuantity())
                .sum();
        order.setCost(total);
    }

    public Order getOrder(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}