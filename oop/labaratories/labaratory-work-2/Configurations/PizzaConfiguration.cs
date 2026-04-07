using labaratory_work_2.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace labaratory_work_2.Configurations;

public class PizzaConfiguration : IEntityTypeConfiguration<Pizza>
{
    public void Configure(EntityTypeBuilder<Pizza> builder)
    {
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Name);
        builder.Property(p => p.Weight);
        builder.Property(p => p.Price);

        builder.Property(p => p.Dough)
               .HasConversion(
                    d => d.ToString(),
                    d => Enum.Parse<Dough>(d)
               );
    }
}
