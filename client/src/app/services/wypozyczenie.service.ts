import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Wypozyczenie } from '../models/models';

export interface NoweWypozyczenieDto {
  dataRozpoczecia: string;
  dataZakonczenia: string;
  klientId: number;
  pracownikId: number;
  sprzetIds: number[];
  ceny: number[];
}

export interface DodajPlatnoscDto {
  kwota: number;
  metoda: string;
  typ: string;
}

@Injectable({ providedIn: 'root' })
export class WypozyczenieService {
  constructor(private api: ApiService) {}

  create(dto: NoweWypozyczenieDto): Observable<Wypozyczenie> {
    return this.api.post<Wypozyczenie>('wypozyczenia', dto);
  }

  getById(id: number): Observable<Wypozyczenie> {
    return this.api.get<Wypozyczenie>(`wypozyczenia/${id}`);
  }

  zmienStatus(id: number, akcja: string): Observable<any> {
    return this.api.postBlob(`wypozyczenia/${id}/akcja`, `"${akcja}"`);
  }

  dodajPlatnosc(id: number, dto: DodajPlatnoscDto): Observable<any> {
    return this.api.postBlob(`wypozyczenia/${id}/platnosci`, dto);
  }
}