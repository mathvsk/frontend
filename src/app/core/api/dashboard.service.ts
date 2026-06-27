import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Dashboard } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  obter(residenciaId: number) {
    return this.http.get<Dashboard>(`${environment.apiBaseUrl}/residencias/${residenciaId}/dashboard`);
  }
}
