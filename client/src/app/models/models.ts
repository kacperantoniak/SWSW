// models/models.ts

export interface Adres {
  ulica: string;
  miasto: string;
  kodPocztowy: string;
}

export interface Klient {
  id: number;
  imie: string;
  nazwisko: string;
  telefon?: string;
  email?: string;
  adres: Adres;
}

export interface Pracownik {
  id: number;
  login: string;
  rola: string;
}

export interface Zylka {
  grubosc: number;
  material: string;
}

export interface Kategoria {
  id: number;
  nazwa: string;
}

export interface SprzetWedkarski {
  id: number;
  nazwa: string;
  producent: string;
  model: string;
  cenaBazowaZaGodzine: number;
  stan: string;
  kategoriaId: number;
  kategoria?: Kategoria;
}

export interface Kolowrotek extends SprzetWedkarski {
  przelozka: string;
  zylka: Zylka;
}

export interface Wedka extends SprzetWedkarski {
  dlugosc: number;
  wagaWyrobu: number;
}

export interface Szczytowka extends SprzetWedkarski {
  dlugosc: number;
  material: string;
}

export interface PozycjaWypozyczenia {
  id: number;
  ilosc: number;
  cenaZaGodzine: number;
  sprzetId: number;
  sprzet?: SprzetWedkarski;
}

export interface Platnosc {
  id: number;
  kwota: number;
  dataPlatnosci: string;
  metoda: string;
  typ: string;
}

export interface Wypozyczenie {
  id: number;
  dataRezerwacji: string;
  dataRozpoczecia: string;
  dataZakonczenia: string;
  status: string;
  klientId: number;
  klient?: Klient;
  pracownikId: number;
  pracownik?: Pracownik;
  pozycje: PozycjaWypozyczenia[];
  platnosci: Platnosc[];
}

export interface OfertaPodobna {
  typDopasowania: string;
  cenaZaGodzineWypozyczenia: number;
  kolowrotek?: Kolowrotek;
  zylka?: Zylka;
}