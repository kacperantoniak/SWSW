using Microsoft.EntityFrameworkCore;
using SWSW_MAS.Data;
using SWSW_MAS.Models;
using SWSW_MAS.Models.DTOs;

namespace SWSW_MAS.Services
{
    public class SugestieService
    {
        private readonly AppDbContext _context;
        public SugestieService(AppDbContext context) => _context = context;

        public async Task<(bool czyDostepna, List<OfertaPodobnaDTO> oferty)> GenerujSugestie(int kolowrotekId, double gruboscZylki)
        {
            var kolowrotek = await _context.Set<Kolowrotek>()
                .Include(k => k.Zylka)
                .FirstOrDefaultAsync(k => k.Id == kolowrotekId);
            if (kolowrotek == null) return (false, new List<OfertaPodobnaDTO>());

            if (Math.Abs(kolowrotek.Zylka.Grubosc - gruboscZylki) < 0.001)
                return (true, new List<OfertaPodobnaDTO>());

            var result = new List<OfertaPodobnaDTO>();

            var inneZylki = await _context.Set<Kolowrotek>()
                .Include(k => k.Zylka)
                .Where(k => k.Model == kolowrotek.Model && k.Id != kolowrotekId)
                .ToListAsync();
            result.AddRange(inneZylki.Select(k => new OfertaPodobnaDTO
            {
                TypDopasowania = TypDopasowania.TenSamKolowrotek,
                CenaZaGodzineWypozyczenia = k.CenaBazowaZaGodzine,
                Kolowrotek = k,
                Zylka = k.Zylka
            }));

            var inneKolowrotki = await _context.Set<Kolowrotek>()
                .Include(k => k.Zylka)
                .Where(k => k.Id != kolowrotekId && Math.Abs(k.Zylka.Grubosc - gruboscZylki) < 0.001)
                .ToListAsync();
            result.AddRange(inneKolowrotki.Select(k => new OfertaPodobnaDTO
            {
                TypDopasowania = TypDopasowania.TaSamaZylka,
                CenaZaGodzineWypozyczenia = k.CenaBazowaZaGodzine,
                Kolowrotek = k,
                Zylka = k.Zylka
            }));

            return (false, result);
        }
    }
}
