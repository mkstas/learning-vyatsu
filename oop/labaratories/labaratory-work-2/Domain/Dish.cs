namespace labaratory_work_2.Domain;

public abstract class Dish(string name, int weight = 100, double price = 10.0)
{
    public Guid Id { get; } = Guid.NewGuid();
    public string Name { get; set; } = name;
    public int Weight { get; set; } = weight;
    public double Price { get; set; } = price;

    public Dish(string name) : this(name, 200, 20.0)
    {
    }

    public Dish() : this("Dish")
    {
    }

    public abstract string DisplayInfo();
    public abstract double CalcFullPrice();
}
