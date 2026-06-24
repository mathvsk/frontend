import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Leitura, RegistrarLeitura } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class LeituraService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;
  listar(residenciaId: number) { return this.http.get<Leitura[]>(`${this.base}/residencias/${residenciaId}/leituras`); }
  registrar(residenciaId: number, dto: RegistrarLeitura) {
    return this.http.post<Leitura>(`${this.base}/residencias/${residenciaId}/leituras`, dto);
  }
  atualizar(residenciaId: number, leituraId: number, dto: RegistrarLeitura) {
    return this.http.put<Leitura>(`${this.base}/residencias/${residenciaId}/leituras/${leituraId}`, dto);
  }
  remover(residenciaId: number, leituraId: number) {
    return this.http.delete<void>(`${this.base}/residencias/${residenciaId}/leituras/${leituraId}`);
  }
}
