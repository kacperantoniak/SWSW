using System.ComponentModel.DataAnnotations;

namespace SWSW_MAS.Models
{
    public class Platnosc
    {
        public int Id { get; set; }
        [DataType(DataType.Currency)]
        public decimal Kwota { get; set; }
        public DateTime DataPlatnosci { get; set; }
        public string Metoda { get; set; }
        public TypPlatnosci Typ { get; set; }
        public int WypozyczenieId { get; set; }
        public Wypozyczenie Wypozyczenie { get; set; }
    }
}
