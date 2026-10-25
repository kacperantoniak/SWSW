import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Klient, Wypozyczenie } from '../models/models';

@Injectable({ providedIn: 'root' })
export class KlientService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Klient[]> {
    return this.api.get<Klient[]>('klienci');
  }

  getById(id: number): Observable<Klient> {
    return this.api.get<Klient>(`klienci/${id}`);
  }

  getWypozyczenia(id: number): Observable<Wypozyczenie[]> {
    return this.api.get<Wypozyczenie[]>(`klienci/${id}/wypozyczenia`);
  }

  create(klient: Partial<Klient>): Observable<Klient> {
    return this.api.post<Klient>('klienci', klient);
  }
}