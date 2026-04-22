package com.example.demo.service;

import com.example.demo.domain.*;
import com.example.demo.dto.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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

    public List<OrderSummaryResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> new OrderSummaryResponse(
                        order.getId(),
                        order.getCreatedAt(),
                        order.getCost()
                ))
                .toList();
    }

    public OrderResponse getOrder(UUID id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        List<OrderItemResponse> responses = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                    item.getId(),
                    item.getDish().getInfo(),
                    item.getQuantity()
                ))
                .toList();

        return new OrderResponse(order.getId(), order.getCreatedAt(), order.getCost(), responses);
    }
}