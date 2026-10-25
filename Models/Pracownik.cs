namespace SWSW_MAS.Models
{
    public class Pracownik
    {
        public int Id { get; set; }
        public string Login { get; set; }
        public string HasloHash { get; set; }
        public string Rola { get; set; }
        public List<Wypozyczenie> Wypozyczenia { get; set; } = new();
    }
}
