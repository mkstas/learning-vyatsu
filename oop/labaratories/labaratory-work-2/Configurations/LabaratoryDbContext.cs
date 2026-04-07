using labaratory_work_2.Domain;
using Microsoft.EntityFrameworkCore;

namespace labaratory_work_2.Configurations;

public class LabaratoryDbContext(
    DbContextOptions<LabaratoryDbContext> options) : DbContext(options)
{
    public DbSet<Pizza> Pizzas { get; set; }
    public DbSet<Salad> Salads { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new PizzaConfiguration());
        modelBuilder.ApplyConfiguration(new SaladConfiguration());

        base.OnModelCreating(modelBuilder);
    }
}
