import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { OfertaPodobna } from '../../models/models';

@Component({
  selector: 'app-podobne-oferty',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './podobne-oferty.html',
  styleUrls: ['./podobne-oferty.scss']
})
export class PodobneOfertyComponent {
  @Input() oferty: OfertaPodobna[] = [];
  @Output() ofertaWybrana = new EventEmitter<OfertaPodobna>();
  @Output() anulowano = new EventEmitter<void>();

  get ofertyTenSamKolowrotek(): OfertaPodobna[] {
    return this.oferty.filter(o => o.typDopasowania === 'TenSamKolowrotek');
  }

  get ofertyTaSamaZylka(): OfertaPodobna[] {
    return this.oferty.filter(o => o.typDopasowania === 'TaSamaZylka');
  }

  wybierz(oferta: OfertaPodobna): void {
    this.ofertaWybrana.emit(oferta);
  }

  anuluj(): void {
    this.anulowano.emit();
  }
}