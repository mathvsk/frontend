import { Injectable, inject, signal } from '@angular/core';
import { ResidenciaService } from './residencia.service';
import { Residencia } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ResidenciaSelecionadaService {
  private service = inject(ResidenciaService);
  readonly atual = signal<Residencia | null>(null);
  private carregando: Promise<void> | null = null;

  carregar(): Promise<void> {
    if (this.atual()) return Promise.resolve();
    return this.carregando ??= new Promise<void>((resolve) => {
      this.service.me().subscribe({
        next: (r) => { this.atual.set(r); this.carregando = null; resolve(); },
        error: () => { this.atual.set(null); this.carregando = null; resolve(); },
      });
    });
  }
}
