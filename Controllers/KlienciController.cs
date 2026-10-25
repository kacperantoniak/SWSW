using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SWSW_MAS.Data;
using SWSW_MAS.Models;
using SWSW_MAS.Services;
using System.Security.Claims;
using System.Text;

namespace SWSW_MAS.Controllers
{
    [ApiController, Route("api/[controller]"), Authorize]
    public class KlienciController : ControllerBase
    {
        private readonly KlientService _service;
        public KlienciController(KlientService service) => _service = service;

        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAll());

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id) => Ok(await _service.GetById(id));

        [HttpGet("{id}/wypozyczenia")]
        public async Task<IActionResult> GetWypozyczenia(int id) =>
            Ok(await _service.GetWypozyczeniaKlienta(id));

        [HttpPost]
        public async Task<IActionResult> Add(Klient klient) =>
            Ok(await _service.Add(klient));
    }
}
