using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SWSW_MAS.Models;
using SWSW_MAS.Models.DTOs;
using SWSW_MAS.Services;

namespace SWSW_MAS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class WypozyczeniaController : ControllerBase
    {
        private readonly WypozyczenieService _service;
        public WypozyczeniaController(WypozyczenieService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(WypozyczenieDTO dto)
        {
            var w = new Wypozyczenie
            {
                DataRozpoczecia = dto.DataRozpoczecia,
                DataZakonczenia = dto.DataZakonczenia,
                KlientId = dto.KlientId,
                PracownikId = dto.PracownikId
            };
            var result = await _service.Create(w, dto.SprzetIds, dto.Ceny);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id) => Ok(await _service.GetById(id));

        [HttpPost("{id}/akcja")]
        public async Task<IActionResult> ZmienStatus(int id, [FromBody] string akcja)
        {
            try
            {
                await _service.ZmienStatus(id, akcja);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("{id}/platnosci")]
        public async Task<IActionResult> DodajPlatnosc(int id, [FromBody] DodajPlatnoscDTO dto)
        {
            var platnosc = new Platnosc
            {
                Kwota = dto.Kwota,
                Metoda = dto.Metoda,
                Typ = dto.Typ
            };
            await _service.DodajPlatnosc(id, platnosc);
            return NoContent();
        }
    }
}
