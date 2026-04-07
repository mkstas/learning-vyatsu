using labaratory_work_2.Configurations;
using labaratory_work_2.Contracts.Salads;
using labaratory_work_2.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace labaratory_work_2.Controllers;

[ApiController]
[Route("[controller]")]
public class SaladsController(LabaratoryDbContext context) : Controller
{
    private readonly LabaratoryDbContext _context = context;

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateSaladRequest request)
    {
        await _context.Salads.AddAsync(
            new Salad(request.Name, request.Weight, request.Price));
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet]
    public async Task<IActionResult> GetAllAsync()
    {
        var salads = await _context.Salads.ToListAsync();

        List<SaladResponse> response = [.. salads.Select(s =>
            new SaladResponse(s.Id, s.Name, s.Dressing, s.Weight, s.Price))];

        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync([FromRoute] Guid id)
    {
        var salad = await _context.Salads.FirstOrDefaultAsync(s => s.Id == id);
        var response = new SaladResponse(salad!.Id, salad.Name, salad.Dressing, salad.Weight, salad.Price);

        return Ok(response);
    }

    [HttpGet("{id:guid}/toss")]
    public async Task<IActionResult> TossAsync([FromRoute] Guid id)
    {
        var salad = await _context.Salads.FirstOrDefaultAsync(s => s.Id == id);
        string message = salad!.TossWithDressing();

        return Ok(message);
    }

    [HttpGet("{id:guid}/info")]
    public async Task<IActionResult> DisplayInfoAsync([FromRoute] Guid id)
    {
        var salad = await _context.Salads.FirstOrDefaultAsync(s => s.Id == id);
        string message = salad!.DisplayInfo();

        return Ok(message);
    }

    [HttpGet("{id:guid}/fullprice")]
    public async Task<IActionResult> GetFullPriceAsync([FromRoute] Guid id)
    {
        var salad = await _context.Salads.FirstOrDefaultAsync(s => s.Id == id);
        double message = salad!.CalcFullPrice();

        return Ok(message);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateAsync(
        [FromRoute] Guid id,
        [FromBody] UpdateSaladRequest request
    )
    {
        await _context.Salads
            .Where(s => s.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(s => s.Name, request.Name)
                .SetProperty(s => s.Weight, request.Weight)
                .SetProperty(s => s.Price, request.Price));

        return NoContent();
    }

    [HttpPatch("{id:guid}/dressing")]
    public async Task<IActionResult> ChangeDressingAsync([FromRoute] Guid id)
    {
        var salad = await _context.Salads.FirstOrDefaultAsync(p => p.Id == id);
        salad!.ChangeDressing();
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync([FromRoute] Guid id)
    {
        await _context.Salads
            .Where(s => s.Id == id)
            .ExecuteDeleteAsync();

        return NoContent();
    }
}
