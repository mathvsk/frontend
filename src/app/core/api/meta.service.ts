import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Meta, DefinirMeta, MediaRegional } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class MetaService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;
  atual(residenciaId: number, mes: number, ano: number) {
    return this.http.get<Meta>(`${this.base}/residencias/${residenciaId}/metas/atual?mes=${mes}&ano=${ano}`);
  }
  definir(residenciaId: number, dto: DefinirMeta) {
    return this.http.post<Meta>(`${this.base}/residencias/${residenciaId}/metas`, dto);
  }
  mediaRegional(residenciaId: number) {
    return this.http.get<MediaRegional>(`${this.base}/residencias/${residenciaId}/media-regional`);
  }
}
