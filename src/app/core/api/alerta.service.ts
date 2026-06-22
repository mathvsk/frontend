import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Alerta } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AlertaService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/alertas`;
  listar() { return this.http.get<Alerta[]>(this.base); }
  marcarLido(id: number) { return this.http.put<void>(`${this.base}/${id}/lido`, {}); }
}
