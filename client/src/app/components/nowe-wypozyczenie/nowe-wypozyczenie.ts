import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkStepperModule } from '@angular/cdk/stepper';

import { KlientService } from '../../services/klient.service';
import { WypozyczenieService, NoweWypozyczenieDto } from '../../services/wypozyczenie.service';
import { SugestieService } from '../../services/sugestie.service';
import { ApiService } from '../../services/api.service';
import { Klient, Kolowrotek, Wedka, Szczytowka, OfertaPodobna } from '../../models/models';
import { PodobneOfertyComponent } from '../podobne-oferty/podobne-oferty';
import { DialogNowyKlientComponent } from '../dialog-nowy-klient/dialog-nowy-klient';

function dataNiePrzeszla(ctrl: AbstractControl): ValidationErrors | null {
  const date = ctrl.get('dataOdDate')?.value;
  const time = ctrl.get('dataOdTime')?.value;
  if (!date || !time) return null;
  const [h, m] = time.split(':').map(Number);
  const dt = new Date(date);
  dt.setHours(h, m, 0, 0);
  const teraz = new Date();
  teraz.setMinutes(0, 0, 0);
  return dt >= teraz ? null : { dataPrzeszla: true };
}

function koniecPoPoczatku(ctrl: AbstractControl): ValidationErrors | null {
  const odDate = ctrl.get('dataOdDate')?.value;
  const odTime = ctrl.get('dataOdTime')?.value;
  const doDate = ctrl.get('dataDoDate')?.value;
  const doTime = ctrl.get('dataDoTime')?.value;
  if (!odDate || !odTime || !doDate || !doTime) return null;
  const dtOd = new Date(odDate);
  const [hOd, mOd] = odTime.split(':').map(Number);
  dtOd.setHours(hOd, mOd, 0, 0);
  const dtDo = new Date(doDate);
  const [hDo, mDo] = doTime.split(':').map(Number);
  dtDo.setHours(hDo, mDo, 0, 0);
  return dtDo > dtOd ? null : { koniecPrzedPoczatkiem: true };
}

// Walidator: co najmniej jeden sprzęt musi być zaznaczony (w dowolnej z trzech list)
function coNajmniejJedenProdukt(ctrl: AbstractControl): ValidationErrors | null {
  const w = ctrl.get('sprzetIdsWedki')?.value || [];
  const s = ctrl.get('sprzetIdsSzczytowki')?.value || [];
  const k = ctrl.get('sprzetIdsKolowrotki')?.value || [];
  return w.length + s.length + k.length > 0 ? null : { brakSprzetu: true };
}

@Component({
  selector: 'app-nowe-wypozyczenie',
  standalone: true,
  imports: [
    MatStepperModule,
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatListModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    PodobneOfertyComponent,
  ],
  viewProviders: [MatStepper],
  templateUrl: './nowe-wypozyczenie.html',
  styleUrls: ['./nowe-wypozyczenie.scss']
})
export class NoweWypozyczenieComponent implements OnInit {
  klienci: Klient[] = [];
  filteredKlienci: Klient[] = [];
  selectedClient: Klient | null = null;
  klientZablokowany = false;

  wedki: Wedka[] = [];
  szczytowki: Szczytowka[] = [];
  kolowrotki: Kolowrotek[] = [];

  ofertyPodobne: OfertaPodobna[] = [];
  pokazSugestie = false;

  klientForm: FormGroup;
  terminForm: FormGroup;
  sprzetForm: FormGroup;

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private fb: FormBuilder,
    private klientService: KlientService,
    private wypozyczenieService: WypozyczenieService,
    private sugestieService: SugestieService,
    private api: ApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    this.klientForm = this.fb.group({
      klientSearch: ['']
    });

    this.terminForm = this.fb.group({
      dataOdDate: ['', Validators.required],
      dataOdTime: ['', Validators.required],
      dataDoDate: ['', Validators.required],
      dataDoTime: ['', Validators.required]
    }, { validators: [dataNiePrzeszla, koniecPoPoczatku] });

    this.sprzetForm = this.fb.group({
      sprzetIdsWedki: [[]],
      sprzetIdsSzczytowki: [[]],
      sprzetIdsKolowrotki: [[]],
      gruboscZylki: [null],
      metodaPlatnosci: ['Gotówka']
    }, { validators: [coNajmniejJedenProdukt] });
  }

  ngOnInit(): void {
    this.klientService.getAll().subscribe(klienci => this.klienci = klienci);

    this.api.get<Wedka[]>('sprzet/wedki').subscribe(w => this.wedki = w);
    this.api.get<Szczytowka[]>('sprzet/szczytowki').subscribe(s => this.szczytowki = s);
    this.api.get<Kolowrotek[]>('sprzet/kolowrotki').subscribe(k => this.kolowrotki = k);

    this.klientForm.get('klientSearch')?.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        this.filteredKlienci = this.klienci.filter(k =>
          k.nazwisko.toLowerCase().includes(value.toLowerCase()) ||
          k.imie.toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    const klientId = Number(this.route.snapshot.queryParamMap.get('klientId'));
    if (klientId) {
      this.klientZablokowany = true;
      this.klientService.getById(klientId).subscribe(klient => {
        this.selectedClient = klient;
        setTimeout(() => {
          this.klientForm.patchValue({ klientSearch: klient });
          this.stepper.selectedIndex = 1;
        });
      });
    }
  }

  get sprzetIds(): number[] {
    return [
      ...(this.sprzetForm.get('sprzetIdsWedki')?.value || []),
      ...(this.sprzetForm.get('sprzetIdsSzczytowki')?.value || []),
      ...(this.sprzetForm.get('sprzetIdsKolowrotki')?.value || [])
    ];
  }

  onKlientSelected(klient: Klient): void {
    this.selectedClient = klient;
  }

  displayKlient(klient: Klient): string {
    return klient ? `${klient.imie} ${klient.nazwisko}` : '';
  }

  nowyKlient(): void {
    const dialogRef = this.dialog.open(DialogNowyKlientComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((nowyKlient: Partial<Klient>) => {
      if (nowyKlient) {
        this.klientService.create(nowyKlient).subscribe(klient => {
          this.selectedClient = klient;
          this.klientForm.patchValue({ klientSearch: klient });
          this.snackBar.open('Klient został dodany i wybrany', 'OK', { duration: 3000 });
        });
      }
    });
  }

  get kolowrotekWybrany(): boolean {
    const kolIds: number[] = this.sprzetForm.get('sprzetIdsKolowrotki')?.value || [];
    return kolIds.length > 0;
  }

  get wybranyKolowrotek(): Kolowrotek | undefined {
    const kolIds: number[] = this.sprzetForm.get('sprzetIdsKolowrotki')?.value || [];
    return this.kolowrotki.find(k => k.id === kolIds[0]);
  }

  sprawdzDostepnosc(): void {
    const kolowrotek = this.wybranyKolowrotek;
    const grubosc = this.sprzetForm.value.gruboscZylki;
    if (!kolowrotek || !grubosc) return;

    this.sugestieService.getSugestie(kolowrotek.id, grubosc).subscribe((res: any) => {
      if (res.czyDostepna) {
        this.snackBar.open('Konfiguracja dostępna – kontynuuj.', 'OK', { duration: 3000 });
        this.pokazSugestie = false;
      } else {
        this.ofertyPodobne = res.oferty;
        if (this.ofertyPodobne.length === 0) {
          this.snackBar.open('Brak dostępnych alternatyw. Możesz zrezygnować z kołowrotka.', 'OK', { duration: 5000 });
          this.pokazSugestie = false;
        } else {
          this.pokazSugestie = true;
        }
      }
    });
  }

  zastapKolowrotek(oferta: OfertaPodobna): void {
    // Zmieniamy WYŁĄCZNIE formant kołowrotków – wędki i szczytówki pozostają nietknięte
    const noweIds = oferta.kolowrotek?.id ? [oferta.kolowrotek.id] : [];
    this.sprzetForm.patchValue({ sprzetIdsKolowrotki: noweIds });
    this.pokazSugestie = false;
    this.ofertyPodobne = [];
    this.snackBar.open('Kołowrotek został zastąpiony.', 'OK', { duration: 2000 });
  }

  usunKolowrotek(): void {
    // Usuwamy WYŁĄCZNIE kołowrotek – wędki i szczytówki pozostają nietknięte
    this.sprzetForm.patchValue({ sprzetIdsKolowrotki: [] });
    this.pokazSugestie = false;
    this.ofertyPodobne = [];
    this.snackBar.open('Kołowrotek został usunięty.', 'OK', { duration: 2000 });
  }

  get podsumowaniePozycji(): { nazwa: string; cenaZaGodzine: number }[] {
    return this.sprzetIds.map(id => {
      const s = [...this.wedki, ...this.szczytowki, ...this.kolowrotki].find(x => x.id === id);
      return { nazwa: s ? `${s.producent} ${s.model}` : '', cenaZaGodzine: s?.cenaBazowaZaGodzine || 0 };
    });
  }

  private combineDateTime(dateControl: string, timeControl: string): string {
    const date = this.terminForm.get(dateControl)?.value;
    const time = this.terminForm.get(timeControl)?.value;
    if (!date || !time) return '';
    const dateObj = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    dateObj.setHours(hours, minutes, 0, 0);
    return dateObj.toISOString().substring(0, 16);
  }

get szacowanaKwota(): number {
  const dataOdStr = this.combineDateTime('dataOdDate', 'dataOdTime');
  const dataDoStr = this.combineDateTime('dataDoDate', 'dataDoTime');
  if (!dataOdStr || !dataDoStr) return 0;

  const dataOd = new Date(dataOdStr);
  const dataDo = new Date(dataDoStr);

  const godziny = Math.round((dataDo.getTime() - dataOd.getTime()) / 3_600_000);
  if (godziny <= 0) return 0;

  const kwota = this.podsumowaniePozycji
    .reduce((sum, p) => sum + p.cenaZaGodzine * godziny, 0);

  return Math.round(kwota * 100) / 100;
}

  zlozZamowienie(): void {
    const dto: NoweWypozyczenieDto = {
      dataRozpoczecia: this.combineDateTime('dataOdDate', 'dataOdTime'),
      dataZakonczenia: this.combineDateTime('dataDoDate', 'dataDoTime'),
      klientId: this.selectedClient!.id,
      pracownikId: 1,
      sprzetIds: this.sprzetIds,
      ceny: this.podsumowaniePozycji.map(p => p.cenaZaGodzine)
    };

    this.wypozyczenieService.create(dto).subscribe({
      next: (wypozyczenie) => {
        const platnoscDto = {
          kwota: this.szacowanaKwota,
          metoda: this.sprzetForm.value.metodaPlatnosci,
          typ: 'OplataZaWypozyczenie'
        };
        this.wypozyczenieService.dodajPlatnosc(wypozyczenie.id, platnoscDto).subscribe({
          next: () => {
            this.snackBar.open('Wypożyczenie utworzone i opłacone!', 'OK', { duration: 3000 });
            this.router.navigate(['/wypozyczenia', wypozyczenie.id]);
          },
          error: () => {
            this.snackBar.open('Wypożyczenie utworzone, ale nie udało się dodać płatności.', 'OK', { duration: 5000 });
            this.router.navigate(['/wypozyczenia', wypozyczenie.id]);
          }
        });
      },
      error: () => this.snackBar.open('Błąd podczas tworzenia wypożyczenia', 'OK', { duration: 3000 })
    });
  }

  anuluj(): void {
    this.router.navigate(['/']);
  }
}