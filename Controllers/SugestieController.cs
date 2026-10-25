using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SWSW_MAS.Services;

namespace SWSW_MAS.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SugestieController : ControllerBase
    {
        private readonly SugestieService _sugestieService;
        public SugestieController(SugestieService sugestieService) =>
            _sugestieService = sugestieService;

        [HttpGet]
        public async Task<IActionResult> GetSugestie(int kolowrotekId, double grubosc)
        {
            var (czyDostepna, oferty) = await _sugestieService.GenerujSugestie(kolowrotekId, grubosc);
            return Ok(new { czyDostepna, oferty });
        }
    }
}
