namespace SWSW_MAS.Models
{
    public abstract class SprzetWedkarski
    {
        public int Id { get; set; }
        public string Nazwa { get; set; }
        public string Producent { get; set; }
        public string Model { get; set; }
        public decimal CenaBazowaZaGodzine { get; set; }
        public string Stan { get; set; }
        public int KategoriaId { get; set; }
        public Kategoria Kategoria { get; set; }
        public List<Menadzer> ZarzadzajacyMenadzerowie { get; set; } = new();
    }
}
