namespace SWSW_MAS.Models
{
    public class Menadzer : Pracownik
    {
        public List<SprzetWedkarski> ZarzadzanySprzet { get; set; } = new();
    }
}
