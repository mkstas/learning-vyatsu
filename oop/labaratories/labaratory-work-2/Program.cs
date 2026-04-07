using labaratory_work_2.Configurations;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()!)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddDbContext<LabaratoryDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(LabaratoryDbContext)));
});

var app = builder.Build();

app.UseCors();

app.MapControllers();

app.Run();
