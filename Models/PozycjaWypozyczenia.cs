namespace SWSW_MAS.Models
{
    public class PozycjaWypozyczenia
    {
        public int Id { get; set; }
        public int Ilosc { get; set; }
        public decimal CenaZaGodzine { get; set; }
        public int WypozyczenieId { get; set; }
        public Wypozyczenie Wypozyczenie { get; set; }
        public int SprzetId { get; set; }
        public SprzetWedkarski Sprzet { get; set; }
    }
}
