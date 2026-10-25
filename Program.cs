using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SWSW_MAS.Data;
using SWSW_MAS.Models;
using SWSW_MAS.Services;
using System.Text;
using System.Text.Json.Serialization;

namespace SWSW_MAS
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

            builder.Services.AddScoped<KlientService>();
            builder.Services.AddScoped<WypozyczenieService>();
            builder.Services.AddScoped<SugestieService>();


            var jwtKey = builder.Configuration["Jwt:Key"];
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                    };
                });
            builder.Services.AddAuthorization();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngular", policy =>
                {
                    policy.WithOrigins("http://localhost:4200")
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            using (var scope = app.Services.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                context.Database.EnsureCreated();

                if (!context.Klienci.Any())
                {
                    var katKol = new Kategoria { Nazwa = "Kołowrotki" };
                    var katWed = new Kategoria { Nazwa = "Wędki" };
                    var katSzcz = new Kategoria { Nazwa = "Szczytówki" };
                    context.Kategorie.AddRange(katKol, katWed, katSzcz);
                    context.SaveChanges();

                    var wedki = new List<Wedka>
                    {
                        new Wedka { Nazwa = "Dragon Spinning", Producent = "Dragon", Model = "XYZ", CenaBazowaZaGodzine = 10.00m, Stan = "Bardzo dobry", Kategoria = katWed, Dlugosc = 2.70, WagaWyrobu = 140 },
                        new Wedka { Nazwa = "Shimano Catana", Producent = "Shimano", Model = "BX", CenaBazowaZaGodzine = 12.00m, Stan = "Dobry", Kategoria = katWed, Dlugosc = 2.40, WagaWyrobu = 120 },
                        new Wedka { Nazwa = "Daiwa Exceler", Producent = "Daiwa", Model = "AX", CenaBazowaZaGodzine = 14.00m, Stan = "Nowy", Kategoria = katWed, Dlugosc = 3.00, WagaWyrobu = 160 }
                    };
                    context.Set<Wedka>().AddRange(wedki);

                    var szczytowki = new List<Szczytowka>
                    {
                        new Szczytowka { Nazwa = "Szczytówka feeder", Producent = "Dragon", Model = "Feeder Pro", CenaBazowaZaGodzine = 5.00m, Stan = "Nowy", Kategoria = katSzcz, Dlugosc = 0.50, Material = "Włókno szklane" },
                        new Szczytowka { Nazwa = "Szczytówka spinning", Producent = "Shimano", Model = "Spin Tip", CenaBazowaZaGodzine = 6.00m, Stan = "Dobry", Kategoria = katSzcz, Dlugosc = 0.60, Material = "Karbon" },
                        new Szczytowka { Nazwa = "Szczytówka uniwersalna", Producent = "Daiwa", Model = "Uni Tip", CenaBazowaZaGodzine = 4.50m, Stan = "Bardzo dobry", Kategoria = katSzcz, Dlugosc = 0.45, Material = "Kompozyt" }
                    };
                    context.Set<Szczytowka>().AddRange(szczytowki);
                    context.SaveChanges();

                    var kolowrotki = new List<Kolowrotek>
                    {
                        new Kolowrotek { Nazwa = "Shimano Nexave", Producent = "Shimano", Model = "2500", CenaBazowaZaGodzine = 15.00m, Stan = "Dobry", Kategoria = katKol, Przelozka = "5.2:1", Zylka = new Zylka { Grubosc = 0.25, Material = "Plecionka" } },
                        new Kolowrotek { Nazwa = "Shimano Nexave", Producent = "Shimano", Model = "2500", CenaBazowaZaGodzine = 15.00m, Stan = "Dobry", Kategoria = katKol, Przelozka = "5.2:1", Zylka = new Zylka { Grubosc = 0.18, Material = "Plecionka" } },

                        new Kolowrotek { Nazwa = "Daiwa Legalis", Producent = "Daiwa", Model = "3000", CenaBazowaZaGodzine = 18.00m, Stan = "Bardzo dobry", Kategoria = katKol, Przelozka = "5.2:1", Zylka = new Zylka { Grubosc = 0.20, Material = "Plecionka" } },
                        new Kolowrotek { Nazwa = "Daiwa Legalis", Producent = "Daiwa", Model = "3000", CenaBazowaZaGodzine = 18.00m, Stan = "Bardzo dobry", Kategoria = katKol, Przelozka = "5.2:1", Zylka = new Zylka { Grubosc = 0.25, Material = "Plecionka" } },

                        new Kolowrotek { Nazwa = "Penn Battle II", Producent = "Penn", Model = "2000", CenaBazowaZaGodzine = 16.00m, Stan = "Nowy", Kategoria = katKol, Przelozka = "6.2:1", Zylka = new Zylka { Grubosc = 0.20, Material = "Żyłka mono" } }
                    };
                    context.Set<Kolowrotek>().AddRange(kolowrotki);
                    context.SaveChanges();

                    var hasloHash = BCrypt.Net.BCrypt.HashPassword("admin123");
                    var pracownik = new Pracownik { Login = "jk", HasloHash = hasloHash, Rola = "Pracownik" };
                    var menedzer = new Menadzer { Login = "admin", HasloHash = hasloHash, Rola = "Menadzer" };
                    context.Pracownicy.Add(pracownik);
                    context.Menadzerowie.Add(menedzer);
                    context.SaveChanges();

                    var klient1 = new Klient
                    {
                        Imie = "Jan",
                        Nazwisko = "Kowalski",
                        Telefon = "123456789",
                        Email = "jan.kowalski@example.com",
                        Adres = new Adres { Ulica = "Rybacka 5", Miasto = "Warszawa", KodPocztowy = "00-001" }
                    };
                    var klient2 = new Klient
                    {
                        Imie = "Anna",
                        Nazwisko = "Nowak",
                        Telefon = "987654321",
                        Email = "anna.nowak@example.com",
                        Adres = new Adres { Ulica = "Spławikowa 12", Miasto = "Kraków", KodPocztowy = "30-001" }
                    };
                    context.Klienci.AddRange(klient1, klient2);
                    context.SaveChanges();

                    var wyp1 = new Wypozyczenie
                    {
                        DataRezerwacji = new DateTime(2024, 4, 9, 14, 0, 0),
                        DataRozpoczecia = new DateTime(2024, 4, 10, 8, 0, 0),
                        DataZakonczenia = new DateTime(2024, 4, 10, 12, 0, 0),
                        Status = StatusWypozyczenia.Zamkniete,
                        Klient = klient1,
                        Pracownik = pracownik
                    };
                    wyp1.Pozycje.Add(new PozycjaWypozyczenia { Sprzet = kolowrotki[0], Ilosc = 1, CenaZaGodzine = kolowrotki[0].CenaBazowaZaGodzine });
                    wyp1.Pozycje.Add(new PozycjaWypozyczenia { Sprzet = wedki[0], Ilosc = 1, CenaZaGodzine = wedki[0].CenaBazowaZaGodzine });
                    wyp1.Platnosci.Add(new Platnosc { Kwota = wyp1.obliczKwoteCalkowita(), Metoda = "Gotówka", Typ = TypPlatnosci.OplataZaWypozyczenie, DataPlatnosci = new DateTime(2024, 4, 10) });

                    var wyp2 = new Wypozyczenie
                    {
                        DataRezerwacji = new DateTime(2024, 4, 10, 16, 0, 0),
                        DataRozpoczecia = new DateTime(2024, 4, 11, 10, 0, 0),
                        DataZakonczenia = new DateTime(2024, 4, 11, 14, 0, 0),
                        Status = StatusWypozyczenia.Aktywne,
                        Klient = klient2,
                        Pracownik = pracownik
                    };
                    wyp2.Pozycje.Add(new PozycjaWypozyczenia { Sprzet = kolowrotki[3], Ilosc = 1, CenaZaGodzine = kolowrotki[3].CenaBazowaZaGodzine });
                    wyp2.Platnosci.Add(new Platnosc { Kwota = wyp2.obliczKwoteCalkowita(), Metoda = "Karta", Typ = TypPlatnosci.OplataZaWypozyczenie, DataPlatnosci = new DateTime(2024, 4, 11) });

                    context.Wypozyczenia.AddRange(wyp1, wyp2);
                    context.SaveChanges();
                }
            }
            app.UseCors("AllowAngular");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
