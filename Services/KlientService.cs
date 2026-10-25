using Microsoft.EntityFrameworkCore;
using SWSW_MAS.Data;
using SWSW_MAS.Models;

namespace SWSW_MAS.Services
{
    public class KlientService
    {
        private readonly AppDbContext _context;
        public KlientService(AppDbContext context) => _context = context;

        public async Task<List<Klient>> GetAll() => await _context.Klienci.ToListAsync();

        public async Task<Klient> GetById(int id) =>
            await _context.Klienci.FindAsync(id);

        public async Task<List<Wypozyczenie>> GetWypozyczeniaKlienta(int klientId)
        {
            var klient = await _context.Klienci
                .Include(k => k.Wypozyczenia)
                    .ThenInclude(w => w.Pracownik)
                .Include(k => k.Wypozyczenia)
                    .ThenInclude(w => w.Pozycje)
                        .ThenInclude(p => p.Sprzet)
                .Include(k => k.Wypozyczenia)
                    .ThenInclude(w => w.Platnosci)
                .FirstOrDefaultAsync(k => k.Id == klientId);
            return klient?.Wypozyczenia.ToList() ?? new();
        }

        public async Task<Klient> Add(Klient klient)
        {
            _context.Klienci.Add(klient);
            await _context.SaveChangesAsync();
            return klient;
        }
    }
}
