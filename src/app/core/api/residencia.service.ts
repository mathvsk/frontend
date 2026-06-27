import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Residencia, CriarResidencia } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ResidenciaService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/residencias`;
  listar() { return this.http.get<Residencia[]>(this.base); }
  me() { return this.http.get<Residencia>(`${this.base}/me`); }
  obter(id: number) { return this.http.get<Residencia>(`${this.base}/${id}`); }
  criar(dto: CriarResidencia) { return this.http.post<Residencia>(this.base, dto); }
  atualizar(id: number, dto: CriarResidencia) { return this.http.put<void>(`${this.base}/${id}`, dto); }
  remover(id: number) { return this.http.delete<void>(`${this.base}/${id}`); }
}
