import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Dica, DicaRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class DicaService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/dicas`;
  listar(categoria?: string) {
    const q = categoria ? `?categoria=${encodeURIComponent(categoria)}` : '';
    return this.http.get<Dica[]>(`${this.base}${q}`);
  }
  criar(dto: DicaRequest) { return this.http.post<Dica>(this.base, dto); }
  atualizar(id: number, dto: DicaRequest) { return this.http.put<void>(`${this.base}/${id}`, dto); }
  remover(id: number) { return this.http.delete<void>(`${this.base}/${id}`); }
}
