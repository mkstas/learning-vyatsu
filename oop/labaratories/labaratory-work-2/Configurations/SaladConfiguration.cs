using labaratory_work_2.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace labaratory_work_2.Configurations;

public class SaladConfiguration : IEntityTypeConfiguration<Salad>
{
    public void Configure(EntityTypeBuilder<Salad> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Name);
        builder.Property(s => s.Weight);
        builder.Property(s => s.Price);

        builder.Property(s => s.Dressing)
               .HasConversion(
                    d => d.ToString(),
                    d => Enum.Parse<Dressing>(d)
               );
    }
}

