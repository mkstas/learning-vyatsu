using labaratory_work_2.Domain;

namespace labaratory_work_2.Contracts.Pizzas;

public record class PizzaResponse(
    Guid Id,
    string Name,
    Dough Dough,
    int Weight,
    double Price);
