namespace SWSW_MAS.Models
{
    public class Wypozyczenie
    {
        public int Id { get; set; }
        public DateTime DataRezerwacji { get; set; }
        public DateTime DataRozpoczecia { get; set; }
        public DateTime DataZakonczenia { get; set; }
        public StatusWypozyczenia Status { get; set; }
        public int KlientId { get; set; }
        public Klient Klient { get; set; }
        public int PracownikId { get; set; }
        public Pracownik Pracownik { get; set; }
        public List<PozycjaWypozyczenia> Pozycje { get; set; } = new();
        public List<Platnosc> Platnosci { get; set; } = new();

        public decimal obliczKwoteCalkowita()
        {
            if (Pozycje == null || !Pozycje.Any()) return 0;
            var godziny = (int)Math.Round(
                (DataZakonczenia - DataRozpoczecia).TotalHours,
                MidpointRounding.AwayFromZero);

            if (godziny <= 0) return 0;

            var kwota = Pozycje.Sum(p => p.CenaZaGodzine * p.Ilosc) * godziny;
            return Math.Round(kwota, 2, MidpointRounding.AwayFromZero);
        }

        public void aktywuj()
        {
            if (Status != StatusWypozyczenia.Zarezerwowane)
                throw new InvalidOperationException("Tylko zarezerwowane wypożyczenie można aktywować.");
            Status = StatusWypozyczenia.Aktywne;
        }

        public void odnotujZwrot()
        {
            if (Status != StatusWypozyczenia.Aktywne)
                throw new InvalidOperationException("Tylko aktywne wypożyczenie można zwrócić.");
            Status = StatusWypozyczenia.Zwrocone;
        }

        public void zamknij()
        {
            if (Status != StatusWypozyczenia.Zwrocone)
                throw new InvalidOperationException("Tylko zwrócone wypożyczenie można zamknąć.");
            Status = StatusWypozyczenia.Zamkniete;
        }

        public void anuluj()
        {
            if (Status != StatusWypozyczenia.Zarezerwowane)
                throw new InvalidOperationException("Tylko zarezerwowane wypożyczenie można anulować.");
            Status = StatusWypozyczenia.Anulowane;
        }

    }
}
