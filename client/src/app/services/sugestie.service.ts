import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { OfertaPodobna } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SugestieService {
  constructor(private api: ApiService) {}

  getSugestie(kolowrotekId: number, grubosc: number): Observable<OfertaPodobna[]> {
    return this.api.get<OfertaPodobna[]>(`sugestie?kolowrotekId=${kolowrotekId}&grubosc=${grubosc}`);
  }
}