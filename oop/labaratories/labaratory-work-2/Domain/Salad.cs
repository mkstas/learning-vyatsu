namespace labaratory_work_2.Domain;

public enum Dressing
{
    OliveOil,
    Mayonnaise
}

public class Salad : Dish
{
    public Dressing Dressing { get; set; } = Dressing.OliveOil;

    public Salad() : base()
    {
    }

    public Salad(string name) : base(name)
    {
    }

    public Salad(string name, int weight, double price)
        : base(name, weight, price)
    {
    }

    public void ChangeDressing()
    {
        Dressing = Dressing == Dressing.OliveOil ? Dressing.Mayonnaise : Dressing.OliveOil;
    }

    public string TossWithDressing()
    {
        return $"Tossing the salad {Name} with {Dressing}...";
    }

    public override string DisplayInfo()
    {
        return $"Salad: {Name}, {Dressing} dressing, {Weight}g, ${CalcFullPrice()}";
    }

    public override double CalcFullPrice()
    {
        return Math.Round(
           Dressing == Dressing.OliveOil ? Price * 1.4 : Price * 1.3,
           2,
           MidpointRounding.AwayFromZero
        );
    }
}
