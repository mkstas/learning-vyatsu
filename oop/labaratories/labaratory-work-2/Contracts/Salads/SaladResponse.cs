using labaratory_work_2.Domain;

namespace labaratory_work_2.Contracts.Salads;

public record class SaladResponse(
    Guid Id,
    string Name,
    Dressing Dressing,
    int Weight,
    double Price
);
