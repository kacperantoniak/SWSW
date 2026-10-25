import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';

import { WypozyczenieService, DodajPlatnoscDto } from '../../services/wypozyczenie.service';
import { Wypozyczenie, PozycjaWypozyczenia } from '../../models/models';

@Component({
  selector: 'app-wypozyczenie-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './wypozyczenie-details.html',
  styleUrls: ['./wypozyczenie-details.scss']
})
export class WypozyczenieDetailsComponent implements OnInit {
  wypozyczenie?: Wypozyczenie;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private wypozyczenieService: WypozyczenieService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id || isNaN(id)) {
      this.errorMessage = 'Nieprawidłowy identyfikator wypożyczenia.';
      return;
    }

    this.wypozyczenieService.getById(id).subscribe({
      next: (w) => {
        console.log('Wypożyczenie:', w);
        this.wypozyczenie = w;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Błąd pobierania wypożyczenia:', err);
        this.errorMessage = 'Nie udało się załadować danych. Sprawdź połączenie z serwerem.';
        this.snackBar.open(this.errorMessage, 'OK', { duration: 5000 });
      }
    });
  }

  get godziny(): number {
    if (!this.wypozyczenie) return 0;
    const od = new Date(this.wypozyczenie.dataRozpoczecia);
    const do_ = new Date(this.wypozyczenie.dataZakonczenia);
    return (do_.getTime() - od.getTime()) / 36e5;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Aktywne': return 'status-aktywne';
      case 'Zamkniete': return 'status-zamkniete';
      case 'Zarezerwowane': return 'status-zarezerwowane';
      case 'Anulowane': return 'status-anulowane';
      case 'Zwrocone': return 'status-zwrocone';
      default: return '';
    }
  }

  getTypSprzetu(pozycja: PozycjaWypozyczenia): string {
    const sprzet = pozycja.sprzet as any;
    if (!sprzet) return '—';
    if (sprzet.przelozka) return 'Kołowrotek';
    if (sprzet.material && sprzet.dlugosc) return 'Szczytówka';
    return 'Wędka';
  }

  zmienStatus(akcja: string): void {
    if (!this.wypozyczenie) return;
    this.wypozyczenieService.zmienStatus(this.wypozyczenie.id, akcja).subscribe({
      next: () => {
        this.snackBar.open(`Status zmieniony: ${akcja}`, 'OK', { duration: 3000 });
        this.ngOnInit();
      },
      error: (err) => {
        this.snackBar.open(err.error?.error || 'Błąd zmiany statusu', 'OK', { duration: 3000 });
      }
    });
  }

  dodajPlatnosc(): void {
    if (!this.wypozyczenie) return;
    const kwota = prompt('Kwota:');
    const metoda = prompt('Metoda (Gotówka/Karta/Przelew):', 'Gotówka');
    const typ = prompt('Typ (OplataZaWypozyczenie/KaraZaOpoznienie/OplataZaUszkodzenie/DopłataZaPrzedluzenie):', 'KaraZaOpoznienie');
    if (!kwota || !metoda || !typ) return;

    const dto: DodajPlatnoscDto = { kwota: Number(kwota), metoda, typ };
    this.wypozyczenieService.dodajPlatnosc(this.wypozyczenie.id, dto).subscribe({
      next: () => {
        this.snackBar.open('Płatność dodana', 'OK', { duration: 2000 });
        this.ngOnInit();
      },
      error: () => this.snackBar.open('Błąd dodawania płatności', 'OK', { duration: 2000 })
    });
  }

  goBack(): void {
    if (this.wypozyczenie?.klientId) {
      this.router.navigate(['/'], { queryParams: { klientId: this.wypozyczenie.klientId } });
    } else {
      this.router.navigate(['/']);
    }
  }
}