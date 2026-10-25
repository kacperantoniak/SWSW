using Microsoft.EntityFrameworkCore;
using SWSW_MAS.Data;
using SWSW_MAS.Models;

namespace SWSW_MAS.Services
{
    public class WypozyczenieService
    {
        private readonly AppDbContext _context;
        public WypozyczenieService(AppDbContext context) => _context = context;

        public async Task<Wypozyczenie> Create(Wypozyczenie wypozyczenie, List<int> sprzetIds, List<decimal> ceny)
        {
            var sprzet = await _context.SprzetyWedkarskie
                .Where(s => sprzetIds.Contains(s.Id))
                .ToListAsync();

            for (int i = 0; i < sprzet.Count; i++)
            {
                wypozyczenie.Pozycje.Add(new PozycjaWypozyczenia
                {
                    Sprzet = sprzet[i],
                    Ilosc = 1,
                    CenaZaGodzine = Math.Round(ceny[i], 2, MidpointRounding.AwayFromZero)
                });
            }

            wypozyczenie.DataRezerwacji = DateTime.Now;
            wypozyczenie.Status = StatusWypozyczenia.Zarezerwowane;

            _context.Wypozyczenia.Add(wypozyczenie);
            await _context.SaveChangesAsync();
            return wypozyczenie;
        }

        public async Task<Wypozyczenie> GetById(int id)
        {
            return await _context.Wypozyczenia
                .Include(w => w.Pozycje).ThenInclude(p => p.Sprzet)
                .Include(w => w.Platnosci)
                .Include(w => w.Klient)
                .FirstOrDefaultAsync(w => w.Id == id);
        }

        public async Task ZmienStatus(int id, string akcja)
        {
            var w = await _context.Wypozyczenia.FindAsync(id)
                    ?? throw new Exception("Wypożyczenie nie istnieje");
            switch (akcja)
            {
                case "aktywuj": w.aktywuj(); break;
                case "zwrot": w.odnotujZwrot(); break;
                case "zamknij": w.zamknij(); break;
                case "anuluj": w.anuluj(); break;
                default: throw new ArgumentException("Nieznana akcja");
            }
            await _context.SaveChangesAsync();
        }

        public async Task DodajPlatnosc(int wypozyczenieId, Platnosc platnosc)
        {
            var w = await _context.Wypozyczenia
                .Include(w => w.Platnosci)
                .FirstOrDefaultAsync(w => w.Id == wypozyczenieId)
                    ?? throw new Exception("Wypożyczenie nie istnieje");
            platnosc.DataPlatnosci = DateTime.Now;
            w.Platnosci.Add(platnosc);
            await _context.SaveChangesAsync();
        }
    }
}
