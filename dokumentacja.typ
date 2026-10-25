#let redact(text, fill: black, height: 1em)={
  box(rect(fill: fill, height: height)[#hide(text)])
}

#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 2.8cm, right: 2.5cm),
  numbering: "1",
  number-align: center,
  footer: context [
    #align(center, 
    counter(page).display())
    #align(right,[Kacper Antoniak #redact[s30629]])
  ],
)

#set text(font: "Libertinus Serif", size: 11pt, lang: "pl")
#set par(justify: true, leading: 0.65em)
#set heading(numbering: "1.")


#let accent    = rgb("#1a56a0")
#let lightgray = rgb("#f2f2f2")
#let darkgray  = rgb("#1527ccc0")


#show heading.where(level: 1): it => {
  v(0.5em)
  text(fill: accent, size: 14pt, weight: "bold", it)
  line(length: 100%, stroke: 0.5pt + accent)
  v(0.4em)
}

#show heading.where(level: 1) : set align(center)

#show heading.where(level: 2): it => {
  v(0.3em)
  text(fill: accent, size: 12pt, weight: "bold", it)
  v(0.3em)
}

#show heading.where(level: 3): it => {
  v(0.6em)
  text(fill: darkgray, size: 11pt, weight: "bold", it)
  v(0.2em)
}

#page(numbering: none, footer:[] ,[
  #v(3cm)
  #align(center)[
    #text(size: 26pt, weight: "bold", fill: accent)[DOKUMENTACJA PROJEKTOWA]
    #v(0.3em)
    #text(size: 20pt, weight: "bold", fill: accent)[#redact[MAS]]
    #v(1.2em)
    #text(size: 16pt, weight: "bold")[System Wypożyczalni Sprzętu Wędkarskiego]
    #v(0.5em)
    #line(length: 60%, stroke: 1pt + accent)
    #v(1.8em)
    //#image("logo.png", height: 35%)
    #v(1.8em)
    #text(size: 11pt)[Wersja: 1.1r]\
    Data: #datetime.today().display("[day]-[month]-[year]")\
    Autor: Kacper Antoniak\
    #redact[Numer indeksu: s30629]\
    #v(2.5cm)
    #text(size: 13pt, fill: rgb("#777777"), style: "italic")[
      #redact[Polsko-Japońska Akademia Technik Komputerowych]
    ]
  ]
])

#page(numbering: none, footer:[], [
#outline(
  title: text(fill: accent, size: 14pt, weight: "bold")[Spis treści],
  indent: 1.5em,
  depth: 3,
)])

#pagebreak()

#counter(page).update(1)
= Wymagania użytkownika

== Kontekst i tło

Coraz więcej wędkarzy, zarówno amatorów, jak i doświadczonych sportowców
nie chce inwestować w kosztowny sprzęt na potrzeby jednorazowego wyjazdu lub
próby nowej techniki połowu. Sklepy wędkarskie obsługują głównie sprzedaż, a
oferta wypożyczalni jest rozproszona i zdarza się, że nie jest dostępna.

System Wypożyczalni Sprzętu Wędkarskiego ma za zadanie usprawnić proces
rezerwacji i wypożyczania sprzętu (kołowrotków, wędek, szczytówek) poprzez
scentralizowaną platformę obsługiwaną przez pracowników wypożyczalni.

Główny problem, który rozwiązuje system, to brak możliwości szybkiego
sprawdzenia dostępności konkretnego zestawu sprzętu (np. kołowrotka z nawiniętą
żyłką o określonej grubości) oraz brak mechanizmu sugestii podobnych ofert w
przypadku niedostępności wybranej konfiguracji.

== Historyjka użytkownika

*Jako pracownik wypożyczalni* chcę móc szybko zarejestrować klienta i założyć
dla niego wypożyczenie dowolnego sprzętu (wędki, szczytówki, kołowrotka z żyłką)
na określoną liczbę godzin, aby sprawnie obsłużyć wędkarza przy ladzie.
W przypadku braku dokładnie takiej konfiguracji kołowrotka z żyłką, jaką życzy sobie klient
chcę, aby system  automatycznie zaproponował podobne dostępne produkty: ten
sam model kołowrotka z inną grubością żyłki lub inny model kołowrotka z żyłką o
poszukiwanej grubości.
System powinien umożliwiać odnotowywanie zwrotów,
przeglądanie historii wypożyczeń klientów oraz naliczanie dodatkowych opłat (kary za
opóźnienie, opłaty za uszkodzenie). 

*Jako menadżer wypożyczalni* chcę zarządzać katalogiem sprzętu (dodawać nowe
egzemplarze, edytować istniejące, dezaktywować wycofane), aby oferta
wypożyczalni była zawsze aktualna.

Punkty wymagań użytkownika:

1. System umożliwia rejestrację i logowanie pracowników.
2. System przechowuje dane klientów (imię, nazwisko, telefon, e-mail) wraz z ich
   adresem.
3. System umożliwia pracownikom przeglądanie katalogu sprzętu z podziałem na
   kategorie (kołowrotki, wędki, szczytówki).
4. Klient (za pośrednictwem pracownika) może wypożyczyć dowolny zestaw sprzętu
   (wędka, szczytówka, opcjonalnie kołowrotek z nawiniętą żyłką) na określoną
   liczbę godzin.
5. Jeżeli klient wybierze kołowrotek i poda konkretną grubość żyłki, a dokładna
   konfiguracja nie jest dostępna, system proponuje podobne oferty (ten sam
   kołowrotek z inną grubością żyłki lub inny model z tą samą grubością żyłki).
6. Klient decyduje się na ofertę alternatywną lub rezygnuje z kołowrotka.
7. Po zatwierdzeniu zamówienia system tworzy wypożyczenie z odpowiednimi
   pozycjami, wyliczoną kwotą oraz rejestruje płatność.
8. Pracownik odnotowuje zwrot sprzętu, a system zmienia status wypożyczenia
   na "Zwrócone". Pracownik może też naliczać dodatkowe opłaty (kara za
   opóźnienie, opłata za uszkodzenie).
9. System przechowuje dane trwale w relacyjnej bazie danych.

= Diagram przypadków użycia

== Aktorzy systemu

- *Pracownik* - obsługuje klientów przy stanowisku, zarządza stanem
  sprzętu, rejestruje wypożyczenia i zwroty.
- *Menadżer* (specjalizacja Pracownika) - posiada dodatkowe uprawnienia do
  zarządzania katalogiem sprzętu (dodawanie, edycja, usuwanie).

Klient jest interesariuszem pośrednim. Nie korzysta z systemu samodzielnie,
lecz przekazuje swoje potrzeby pracownikowi, który wykonuje odpowiednie
operacje w systemie.

== Diagram

#image("ucd.pdf")

= Wymagania niefunkcjonalne

== Wydajność

- *WN-P-01*: System powinien obsługiwać co najmniej 20 jednoczesnych użytkowników bez
  odczuwalnego spadku wydajności.
- *WN-P-02*: Czas odpowiedzi dla typowej operacji (wyszukanie sprzętu, rejestracja wypożyczenia)
  nie powinien przekraczać 2 sekund przy standardowym połączeniu internetowym.
- *WN-P-03*: Zapytanie o podobne oferty (UC-04b) powinno zwracać wyniki w czasie poniżej
  1 sekundy dla katalogu do 10 000 pozycji sprzętowych.

== Bezpieczeństwo

- *WN-B-01*: Dostęp do panelu pracownika wymaga uwierzytelnienia (login + hasło);
  hasła będą zaszyfrowane przez bcrypt.
- *WN-B-02*: Komunikacja między frontendem Angular a backendem ASP.NET Core odbywa się
  wyłącznie przez HTTPS.

== Niezawodność i dostępność

- *WN-N-01*: System powinien być dostępny przez co najmniej 99,0% czasu w ujęciu
  miesięcznym (dopuszczalny przestój: \~7 h/miesiąc).
- *WN-N-02*: W przypadku awarii bazy danych czas przywrócenia systemu (RTO) nie
  powinien przekraczać 30 minut.
- *WN-N-03*: Baza danych objęta codzienną automatyczną kopią zapasową.

== Skalowalność

- *WN-S-01*: Architektura REST API umożliwia niezależne skalowanie warstwy backendowej
  bez zmian po stronie frontendu.
- *WN-S-02*: Model danych EF Core zaprojektowany z myślą o migracji do większej
  instancji SQL Server bez przebudowy schematu.

== Użyteczność

- *WN-U-02*: Nowy pracownik powinien być w stanie samodzielnie zarejestrować
  wypożyczenie po 15-minutowym wprowadzeniu bez formalnego szkolenia.
- *WN-U-03*: Aplikacja responsywna, poprawne działanie na rozdzielczościach
  od 1024 x 768 px (stanowisko kasowe) do pełnego HD.

== Przenośność i kompatybilność

- *WN-K-01*: Frontend powinien działać poprawnie w przeglądarkach: Chrome $gt.eq$ 120,
  Firefox $gt.eq$ 121, Edge $gt.eq$ 120.
- *WN-K-02*: Backend możliwy do uruchomienia na wielu platformach.
- *WN-K-03*: Dane przechowywane w SQL Server lub PostgreSQL.
  Zmiana silnika wymaga wyłącznie podmiany connection string i migracji EF Core.

= Diagram klas - analityczny

Na diagramie analitycznym celowo nie umieszczono metod, ich źródłem jest analiza
dynamiczna (diagramy aktywności i stanu), a ich pełna lista znajduje się dopiero
na diagramie projektowym.

== Diagram

#image("analityczny.pdf")

= Diagram klas - projektowy

Diagram projektowy różni się od analitycznego następującymi elementami:

- Wszystkie atrybuty posiadają typy zgodne z C\# (`string`, `int`, `decimal`,
  `DateTime`, `bool`, typy wyliczeniowe `enum`).
- Dodana klasa `Oferta Podobna` (wynik analizy dynamicznej) z atrybutem
  `typ dopasowania: Typ Dopasowania` i asocjacjami do `Kołowrotek` i `Żyłka`.
  Klasa nie jest persystowana, instancje tworzone w pamięci przez serwis
  `SugestieService`.
- Relacja `Kołowrotek` → `Żyłka` jest kompozycją (realizowaną przez `OwnsOne`
  w EF Core lub osobną tabelę z kluczem obcym, decyzja implementacyjna).
- Klasa `Wypożyczenie` posiada metody wynikające z diagramu stanu:
  `aktywuj()`, `odnotujZwrot()`, `zamknij()`, `anuluj()` oraz metodę
  `oblicz kwotę calkowitą(): decimal` dodaną na skutek analizy dynamicznej.
- Klasa `Płatność` posiada enum `Typ Płatności` rozróżniający rodzaje opłat.
- Wszystkie asocjacje z diagramu analitycznego mają swoje odzwierciedlenie
  w postaci kolekcji nawigacyjnych (np. `Klient.Wypozyczenia: List<Wypozyczenie>`).

Na diagramie pominięto techniczne atrybuty kluczy głównych (Id). Są one
oczywistym elementem każdej encji i nie wnoszą informacji biznesowej. Z tego
samego powodu pominięto gettery oraz settery, które będą niezbędne dopiero
na etapie implementacji.

== Diagram

#image("projektowy.pdf")
#pagebreak()

= Scenariusz przypadku użycia

== Identyfikacja przypadku użycia

#grid(
  columns: (4.5cm, 1fr),
  gutter: 5pt,
  [*Nazwa:*], [UC-04 - Wypożycz sprzęt],
  [*Identyfikator:*], [UC-04],
  [*Aktor inicjujący:*], [Pracownik],
  [*Aktorzy dodatkowi:*], [Brak - Klient jest interesariuszem pośrednim],
  [*Przypadki include:*], [UC-04a - Zarejestruj płatność],
  [*Przypadki extend:*], [UC-04b - Wyszukaj podobne oferty (warunek: brak żądanej konfiguracji kołowrotka)],
  [*Warunek wstępny:*], [Pracownik jest zalogowany; katalog sprzętu jest załadowany.],
  [*Warunek końcowy (sukces):*], [Wypożyczenie zostało zapisane w bazie; status = "Zarezerwowane" lub "Aktywne"; kwota obliczona; płatność zarejestrowana.],
  [*Warunek końcowy (porażka):*], [Wypożyczenie nie zostało utworzone; stan magazynowy niezmieniony.],
)

== Scenariusz główny

+ Pracownik znajduje się w widoku głównym i wpisuje nazwisko klienta w pole wyszukiwania.
+ System filtruje listę i wyświetla tylko pasujących klientów.
+ Pracownik klika wybranego klienta na liście, system ładuje jego dane i historię wypożyczeń w prawym panelu.
+ Pracownik klika przycisk „Nowe wypożyczenie” znajdujący się nad historią wypożyczeń.
+ System otwiera formularz nowego wypożyczenia z automatycznie uzupełnionymi danymi wybranego klienta.
+ Pracownik wybiera daty i godziny wypożyczenia (data rozpoczęcia $gt.eq$ bieżąca chwila).
+ Pracownik wybiera sprzęt- dowolną kombinację wędki, szczytówki i kołowrotka (co najmniej jedna pozycja).
+ [Jeśli wybrano kołowrotek] Klient podaje żądaną grubość żyłki.
+ System sprawdza dostępność wybranego sprzętu w żądanym terminie.
+ System wyświetla zestawienie sprzętu z cenami za godzinę i wyliczoną kwotą całkowitą.
+ Pracownik zatwierdza wypożyczenie.
+ System tworzy obiekt Wypożyczenie ze statusem "Zarezerwowane".
+ System wykonuje UC-04a- rejestracja płatności (pracownik wybiera metodę, system zapisuje obiekt Płatność).
+ System wyświetla podsumowanie z numerem wypożyczenia.

== Scenariusze alternatywne

*Alt. 3a - Brak klienta w systemie:*

3a.1. System informuje, że nie znaleziono pasujących klientów.

3a.2. Pracownik wybiera opcję "Zarejestruj nowego klienta" (UC-02).

3a.3. Po rejestracji system automatycznie wczytuje dane nowego klienta, powrót do kroku 4.
#pagebreak()
*Alt. 8a - Brak dokładnej konfiguracji kołowrotka (nietrywialny):*

8a.1. System stwierdza brak kołowrotka z żyłką o żądanej grubości.

8a.2. System wykonuje UC-04b - Wyszukaj podobne oferty:
  - Wyszukuje: (a) ten sam model kołowrotka z dostępnymi grubościami żyłki,
    (b) inne modele kołowrotków z żyłką o żądanej grubości.
  - Zwraca dwie listy `Oferta Podobna` z typem dopasowania i ceną za godzinę.

8a.3. Pracownik prezentuje klientowi listę alternatyw.

8a.4. Klient wybiera jedną z ofert $->$ powrót do kroku 9 (zastąpienie kołowrotka alternatywą).

*Alt. 8b - Klient rezygnuje z kołowrotka po zobaczeniu alternatyw:*

8b.1. Klient nie akceptuje żadnej alternatywy.

8b.2. Pracownik usuwa kołowrotek z zamówienia; pozostałe pozycje zostają bez zmian.

8b.3. Powrót do kroku 9.

== Scenariusze wyjątkowe

*Wyjątek - data rozpoczęcia w przeszłości:*

System odrzuca datę rozpoczęcia wcześniejszą niż bieżąca chwila i wyświetla komunikat. Pracownik musi poprawić datę, aby kontynuować.

*Wyjątek - brak dostępności zamówienia:*

Jeśli którykolwiek z wybranych egzemplarzy (oprócz kołowrotka - obsłużonego przez UC-04b) jest niedostępny w żądanym terminie, system wyświetla komunikat i prosi o zmianę wyboru lub anulowanie.

*Wyjątek - klient odmawia zapłaty za uszkodzenie:*

Jeśli przy zwrocie zostanie stwierdzone uszkodzenie sprzętu, pracownik nalicza 
dodatkową opłatę przez UC-04a (rejestracja płatności) z typem "Opłata za uszkodzenie". 
Jeśli klient odmawia jej uiszczenia, wypożyczenie pozostaje w stanie "Zwrócone" 
z nieuregulowaną płatnością. System nie pozwala na zamknięcie wypożyczenia do 
czasu rozliczenia wszystkich należności. Taka sytuacja wymaga eskalacji do 
menedżera, który może podjąć decyzję o umorzeniu opłaty lub windykacji poza 
systemem.


#pagebreak()
// #page(margin: (
//   top: 10pt,
//   x: 0pt
// ),
// [
= Diagram aktywności dla przypadku użycia
#align(center, [
#image("aktywnosci UC-04.pdf", height: 74%)
])
#pagebreak()


= Diagram stanu dla klasy

== Wybrana klasa

Wybrana klasa: *`Wypożyczenie`*

Klasa `Wypożyczenie` jest centralnym bytem systemu i przechodzi
przez wyraźnie zdefiniowane stany w trakcie swojego cyklu życia - od momentu
utworzenia (stan `Zarezerwowane`), przez aktywne wypożyczenie, aż do zamknięcia.
Analiza stanów tej klasy bezpośrednio wpłynęła na atrybuty i metody widoczne
na projektowym diagramie klas (pole `status: Status Wypożyczenia` typu enum
oraz metody `aktywuj()`, `odnotujZwrot()`, `zamknij()`, `anuluj()`).

Przejścia między stanami:

- `[*]` $->$ `Zarezerwowane`: utworzenie nowego wypożyczenia.
- `Zarezerwowane` $->$ `Aktywne`: `aktywuj()` - sprzęt wydany klientowi.
- `Zarezerwowane` $->$ `Anulowane`: `anuluj()` - anulowanie przed wydaniem.
- `Aktywne` $->$ `Zwrócone`: `odnotujZwrot()` - klient oddał sprzęt.
- `Zwrócone` $->$ `Zamknięte`: `zamknij()` - płatność rozliczona.

== Diagram

#image("stanu wypozyczenie.pdf")
#pagebreak()
= Projekt GUI

== Makiety ekranów (mockupy)
Poniższe grafiki mają na celu przekazać wizję. Układ strony oraz niektóre elementy mogą się zmienić.

=== Ekran główny - Lista klientów / historia wypożyczeń

#image("mock/ekranglowny.png")


=== Nowe wypożyczenie

#image("mock/wybor dat.png")


=== Panel podobnych ofert

#image("mock/podobna.png")

#pagebreak()
=== Szczegóły wypożyczenia / zmiana statusu

#image("mock/szczegoly.png")

= Omówienie decyzji projektowych i skutków analizy dynamicznej


== Kluczowe decyzje architektoniczne

*Architektura REST API (ASP.NET Core) + Angular*

Wybrałem architekturę rozdzielającą backend od frontendu. Backend udostępnia
REST API zgodne z konwencjami HTTP (GET/POST/PUT/DELETE), a Angular
komunikuje się przez serwisy HTTP. Uzasadnienie: ułatwia niezależne
testowanie obu warstw, umożliwia późniejsze dodanie aplikacji mobilnej bez
zmian backendu.

*ORM Entity Framework Core (code-first) zamiast ręcznego SQL*

Schemat bazy danych generowany z klas C\# przez migracje EF Core.\
Podejście to zmniejsza rozbieżność między modelem obiektowym a relacyjnym oraz
przyspiesza development.

*Rezygnacja z warstwy repozytoriów na rzecz bezpośredniego użycia DbContext w serwisach*

W architekturze backendu każdy serwis aplikacyjny (np. `KlientService`,
`WypozyczenieService`) otrzymuje wstrzyknięty `AppDbContext`. Logika dostępu
do danych realizowana jest przez LINQ bezpośrednio na `DbSet`, z wykorzystaniem
`Include` do ładowania powiązanych encji.
#pagebreak()

== Decyzje dotyczące modelu danych

*Realizacja dziedziczenia - Table-Per-Hierarchy (TPH)*

Klasy `Kołowrotek`, `Wędka`, `Szczytówka` dziedziczące po `Sprzęt Wędkarski`
zmapowane do jednej tabeli `SprzetyWedkarskie` z kolumną dyskryminatora
`TypSprzetu` (varchar). Uzasadnienie: prostsze zapytania, mniejsza liczba
joinów. Wadą są kolumny nullable dla atrybutów specyficznych podklas.

*Realizacja kompozycji Kołowrotek - Żyłka:*

W encji `Kołowrotek` zastosuję owned entity (`OwnsOne`) lub obowiązkowy
klucz obcy `ZylkaId` (NOT NULL). Zapewnia to spójność z regułą biznesową:
każdy kołowrotek ma nawiniętą żyłkę, która nie istnieje jako
samodzielny byt w naszym systemie. Usunięcie kołowrotka kaskadowo usuwa przypisaną mu żyłkę.\
Reguła ta wynika z tego, że nawijanie żyłki na kołowrotek jest czasochłonne a zdjęcie jej sprawia, że żyłka nie nadaje się do dalszego użytkowania. 

*Realizacja klasy asocjacji `Pozycja Wypożyczenia`:*

`Pozycja Wypożyczenia` jest klasą asocjacji między klasą `Wypożyczenie` a klasą
`Sprzęt Wędkarski`, przechowującą atrybuty samego powiązania (`ilość`,
`cena za godzinę`). W EF Core realizowana jako zwykła encja z dwoma kluczami
obcymi.

*Realizacja klasy `Oferta Podobna`:*

Klasa wynikła z analizy dynamicznej (diagram aktywności, gałąź UC-04b).
Nie jest persystowana w bazie, instancje tworzone w pamięci przez serwis
`SugestieService` na podstawie zapytania LINQ do tabel `Koloworotki`
i `Zylki`. Atrybut `typd opasowania` (enum: `ten sam kolowrotek`,
`TaSamaZylka`) pojawia się na projektowym diagramie klas jako skutek analizy.

== Analiza dynamiczna - wnioski

Przeprowadzenie analizy dynamicznej ujawniło następujące skutki implementacyjne widoczne
na projektowym diagramie klas:

- Dodana metoda `oblicz kwotę całkowitą(): decimal` w klasie `Wypożyczenie`.
- Dodany atrybut `status: Status Wypożyczenia` jako enum.
- Dodane metody `aktywuj()`, `odnotujZwrot()`, `zamknij()`, `anuluj()`
  w klasie `Wypożyczenie`.
- Dodana klasa `Oferta Podobna` z asocjacjami do `Kołowrotek` i `Żyłka`.
- Dodany warunek w metodzie `zamknij()` blokujący zamknięcie wypożyczenia
  przy nieuregulowanych płatnościach (wynika ze scenariusza wyjątkowego
  o odmowie zapłaty).

== Wnioski końcowe

Na etapie analizy i projektowania zdefiniowano pełny model dziedziny dla
systemu wypożyczalni sprzętu wędkarskiego: 13 klas biznesowych,
hierarchię dziedziczenia, nietrywialny przypadek użycia UC-04 z mechanizmem sugestii
alternatyw oraz scenariusze alternatywne i wyjątkowe.

Analiza dynamiczna (diagram aktywności i diagram stanu klasy `Wypożyczenie`)
pozwoliła uzupełnić projektowy diagram klas o metody i atrybuty niewidoczne
na etapie analizy statycznej.

== Wykorzystane narzędzia
Diagramowanie: #link("https://lucidchart.com")[Lucidchart]  \
Dokumentacja: #link("https://typst.app/")[Typst]