namespace labaratory_work_2.Contracts.Pizzas;

public record class CreatePizzaRequest(
    string Name,
    int Weight,
    double Price);
