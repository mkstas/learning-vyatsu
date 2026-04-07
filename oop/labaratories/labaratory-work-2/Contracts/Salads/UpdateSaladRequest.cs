namespace labaratory_work_2.Contracts.Salads;

public record class UpdateSaladRequest(
    string Name,
    int Weight,
    double Price
);
