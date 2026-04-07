namespace labaratory_work_2.Domain;

public enum Dough
{
    Thin,
    Thick
}

public class Pizza : Dish
{
    public Dough Dough { get; set; } = Dough.Thick;

    public Pizza() : base()
    {
    }

    public Pizza(string name) : base(name)
    {
    }

    public Pizza(string name, int weight, double price)
        : base(name, weight, price)
    {
    }

    public void ChangeDough()
    {
        Dough = Dough == Dough.Thin ? Dough.Thick : Dough.Thin;
    }

    public string CutInSlices()
    {
        return $"Cutting the pizza {Name} into slices...";
    }

    public override string DisplayInfo()
    {
        return $"Pizza: {Name}, {Dough} dough, {Weight}g, ${CalcFullPrice()}";
    }

    public override double CalcFullPrice()
    {
        return Math.Round(
            Dough == Dough.Thin ? Price * 1.3 : Price * 1.5,
            2,
            MidpointRounding.AwayFromZero
        );
    }
}
