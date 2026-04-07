namespace labaratory_work_2.Contracts.Salads;

public record class CreateSaladRequest(
    string Name,
    int Weight,
    double Price
);
