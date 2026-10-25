import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, Observable, of } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CdkStepperModule } from '@angular/cdk/stepper';

import { KlientService } from '../../services/klient.service';
import { Klient, Wypozyczenie } from '../../models/models';
import { DialogNowyKlientComponent } from '../dialog-nowy-klient/dialog-nowy-klient';

@Component({
  selector: 'app-master-detail',
  standalone: true,
  imports: [
    CdkStepperModule,
    CommonModule,
    RouterModule,
    MatTableModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './master-detail.html',
  styleUrls: ['./master-detail.scss']
})
export class MasterDetailComponent implements OnInit, OnDestroy {
  klienci: Klient[] = [];
  filteredKlienci: Klient[] = [];
  selectedClient: Klient | null = null;

  displayedColumns: string[] = ['nr', 'dataOd', 'dataDo', 'status', 'kwota', 'akcje'];

  wypozyczenia$!: Observable<Wypozyczenie[]>;
  private destroy$ = new Subject<void>();

  constructor(
    private klientService: KlientService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.klientService.getAll().subscribe(klienci => {
      this.klienci = klienci;
      this.filteredKlienci = [...klienci];
      this.cdr.detectChanges();
    });
    this.wypozyczenia$ = of([]);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value?.toLowerCase() || '';
    this.filteredKlienci = this.klienci.filter(k =>
      k.nazwisko.toLowerCase().includes(filterValue) ||
      k.imie.toLowerCase().includes(filterValue)
    );
  }

  selectClient(klient: Klient): void {
    this.selectedClient = klient;
    this.wypozyczenia$ = this.klientService.getWypozyczenia(klient.id).pipe(startWith([]));
  }

  clearClient(): void {
    this.selectedClient = null;
    this.wypozyczenia$ = of([]);
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

  nowyKlient(): void {
    const dialogRef = this.dialog.open(DialogNowyKlientComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe((nowyKlient: Partial<Klient>) => {
      if (nowyKlient) {
        this.klientService.create(nowyKlient).subscribe({
          next: (klient) => {
            this.klienci.push(klient);
            this.filteredKlienci = [...this.klienci];
            this.cdr.markForCheck();
            this.snackBar.open('Klient został dodany', 'OK', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Nie udało się dodać klienta', 'OK', { duration: 3000 });
          }
        });
      }
    });
  }

  noweWypozyczenie(): void {
    if (this.selectedClient) {
      this.router.navigate(['/nowe-wypozyczenie'], { queryParams: { klientId: this.selectedClient.id } });
    } else {
      this.router.navigate(['/nowe-wypozyczenie']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}