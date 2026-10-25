namespace SWSW_MAS.Models
{
    public class Kategoria
    {
        public int Id { get; set; }
        public string Nazwa { get; set; }
        public List<SprzetWedkarski> Sprzety { get; set; } = new();
    }
}
