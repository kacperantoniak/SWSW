namespace SWSW_MAS.Models.DTOs
{
    public class WypozyczenieDTO
    {
        public DateTime DataRozpoczecia { get; set; }
        public DateTime DataZakonczenia { get; set; }
        public int KlientId { get; set; }
        public int PracownikId { get; set; }
        public List<int> SprzetIds { get; set; } = new();
        public List<decimal> Ceny { get; set; } = new();
    }
}
