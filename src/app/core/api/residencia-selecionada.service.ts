import { Injectable, inject, signal } from '@angular/core';
import { ResidenciaService } from './residencia.service';
import { Residencia } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ResidenciaSelecionadaService {
  private service = inject(ResidenciaService);
  readonly atual = signal<Residencia | null>(null);

  async carregar(): Promise<void> {
    if (this.atual()) return;
    const r = await new Promise<Residencia | null>((res) =>
      this.service.me().subscribe({ next: res, error: () => res(null) }));
    this.atual.set(r);
  }
}
