using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SWSW_MAS.Data;
using SWSW_MAS.Models;

namespace SWSW_MAS.Controllers
{
    [ApiController, Route("api/[controller]"), Authorize]
    public class SprzetController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SprzetController(AppDbContext context) => _context = context;

        [HttpGet("all")]
        public async Task<IActionResult> GetAll()
        {
            var sprzet = await _context.SprzetyWedkarskie
                .Include(s => s.Kategoria)
                .ToListAsync();
            return Ok(sprzet);
        }

        [HttpGet("kolowrotki")]
        public async Task<IActionResult> GetKolowrotki()
        {
            var kolowrotki = await _context.Set<Kolowrotek>()
                .Include(k => k.Zylka)
                .Include(k => k.Kategoria)
                .ToListAsync();
            return Ok(kolowrotki);
        }

        [HttpGet("wedki")]
        public async Task<IActionResult> GetWedki()
        {
            var wedki = await _context.Set<Wedka>()
                .Include(w => w.Kategoria)
                .ToListAsync();
            return Ok(wedki);
        }

        [HttpGet("szczytowki")]
        public async Task<IActionResult> GetSzczytowki()
        {
            var szczytowki = await _context.Set<Szczytowka>()
                .Include(s => s.Kategoria)
                .ToListAsync();
            return Ok(szczytowki);
        }
    }
}