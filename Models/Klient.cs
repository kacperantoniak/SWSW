namespace SWSW_MAS.Models
{
    public class Klient
    {
        public int Id { get; set; }
        public string Imie { get; set; }
        public string Nazwisko { get; set; }
        public string Telefon { get; set; }
        public string Email { get; set; }
        public Adres Adres { get; set; }
        public List<Wypozyczenie> Wypozyczenia { get; set; } = new();
    }
}
