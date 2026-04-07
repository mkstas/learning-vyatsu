namespace labaratory_work_2.Contracts.Pizzas;

public record class UpdatePizzaRequest(
    string Name,
    int Weight,
    double Price);
