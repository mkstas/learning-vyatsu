using labaratory_work_2.Configurations;
using labaratory_work_2.Contracts.Pizzas;
using labaratory_work_2.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace labaratory_work_2.Controllers;

[ApiController]
[Route("[controller]")]
public class PizzasController(LabaratoryDbContext context) : Controller
{
    private readonly LabaratoryDbContext _context = context;

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreatePizzaRequest request)
    {
        await _context.Pizzas.AddAsync(
            new Pizza(request.Name, request.Weight, request.Price));
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        var pizzas = await _context.Pizzas.ToListAsync();

        List<PizzaResponse> response = [.. pizzas.Select(
            p => new PizzaResponse(p.Id, p.Name, p.Dough, p.Weight, p.Price))];

        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id)
    {
        var pizza = await _context.Pizzas.FirstOrDefaultAsync(p => p.Id == id);
        var response = new PizzaResponse(pizza!.Id, pizza.Name, pizza.Dough, pizza.Weight, pizza.Price);

        return Ok(response);
    }

    [HttpGet("{id:guid}/cut")]
    public async Task<IActionResult> CutAsync([FromRoute] Guid id)
    {
        var pizza = await _context.Pizzas.FirstOrDefaultAsync(p => p.Id == id);
        string message = pizza!.CutInSlices();

        return Ok(message);
    }

    [HttpGet("{id:guid}/info")]
    public async Task<IActionResult> DisplayInfoAsync([FromRoute] Guid id)
    {
        var pizza = await _context.Pizzas.FirstOrDefaultAsync(p => p.Id == id);
        string message = pizza!.DisplayInfo();

        return Ok(message);
    }

    [HttpGet("{id:guid}/fullprice")]
    public async Task<IActionResult> GetFullPriceAsync([FromRoute] Guid id)
    {
        var pizza = await _context.Pizzas.FirstOrDefaultAsync(p => p.Id == id);
        double message = pizza!.CalcFullPrice();

        return Ok(message);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute] Guid id,
        [FromBody] UpdatePizzaRequest request
    )
    {
        await _context.Pizzas
            .Where(p => p.Id == id)
            .ExecuteUpdateAsync(p => p
                .SetProperty(p => p.Name, request.Name)
                .SetProperty(p => p.Weight, request.Weight)
                .SetProperty(p => p.Price, request.Price));

        return NoContent();
    }

    [HttpPatch("{id:guid}/dough")]
    public async Task<IActionResult> ChangeDressingAsync([FromRoute] Guid id)
    {
        var pizza = await _context.Pizzas.FirstOrDefaultAsync(p => p.Id == id);
        pizza!.ChangeDough();
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await _context.Pizzas
            .Where(p => p.Id == id)
            .ExecuteDeleteAsync();

        return NoContent();
    }
}
