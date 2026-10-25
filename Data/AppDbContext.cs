using Microsoft.EntityFrameworkCore;
using SWSW_MAS.Models;

namespace SWSW_MAS.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Klient> Klienci { get; set; }
        public DbSet<Pracownik> Pracownicy { get; set; }
        public DbSet<Menadzer> Menadzerowie { get; set; }
        public DbSet<SprzetWedkarski> SprzetyWedkarskie { get; set; }
        public DbSet<Kolowrotek> Kolowrotki { get; set; }
        public DbSet<Wedka> Wedki { get; set; }
        public DbSet<Szczytowka> Szczytowki { get; set; }
        public DbSet<Kategoria> Kategorie { get; set; }
        public DbSet<Wypozyczenie> Wypozyczenia { get; set; }
        public DbSet<PozycjaWypozyczenia> PozycjeWypozyczen { get; set; }
        public DbSet<Platnosc> Platnosci { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SprzetWedkarski>()
                .HasDiscriminator<string>("TypSprzetu")
                .HasValue<Wedka>("Wedka")
                .HasValue<Kolowrotek>("Kolowrotek")
                .HasValue<Szczytowka>("Szczytowka");

            modelBuilder.Entity<Klient>()
                .OwnsOne(k => k.Adres);

            modelBuilder.Entity<Kolowrotek>()
                .OwnsOne(k => k.Zylka);

            modelBuilder.Entity<Menadzer>()
                .HasMany(m => m.ZarzadzanySprzet)
                .WithMany(s => s.ZarzadzajacyMenadzerowie)
                .UsingEntity(j => j.ToTable("MenadzerSprzet"));

            modelBuilder.Entity<Wypozyczenie>()
                .HasOne(w => w.Pracownik)
                .WithMany(p => p.Wypozyczenia)
                .HasForeignKey(w => w.PracownikId);

            modelBuilder.Entity<Wypozyczenie>()
                .HasOne(w => w.Klient)
                .WithMany(k => k.Wypozyczenia)
                .HasForeignKey(w => w.KlientId);

            modelBuilder.Entity<PozycjaWypozyczenia>()
                .HasOne(p => p.Sprzet)
                .WithMany()
                .HasForeignKey(p => p.SprzetId);

            modelBuilder.Entity<Platnosc>()
                .HasOne(p => p.Wypozyczenie)
                .WithMany(w => w.Platnosci)
                .HasForeignKey(p => p.WypozyczenieId);

            modelBuilder.Entity<Wypozyczenie>()
                .Property(w => w.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Platnosc>()
                .Property(p => p.Typ)
                .HasConversion<string>();

            modelBuilder.Entity<Platnosc>()
                .Property(p => p.Kwota)
                .HasPrecision(18, 2);

            modelBuilder.Entity<PozycjaWypozyczenia>()
                .Property(p => p.CenaZaGodzine)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SprzetWedkarski>()
                .Property(s => s.CenaBazowaZaGodzine)
                .HasPrecision(18, 2);
        }
    }
}
