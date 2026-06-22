import { Injectable, inject, signal } from '@angular/core';
import { ResidenciaService } from './residencia.service';
import { Residencia } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ResidenciaSelecionadaService {
  private service = inject(ResidenciaService);
  readonly lista = signal<Residencia[]>([]);
  readonly atual = signal<Residencia | null>(null);

  async carregar(): Promise<void> {
    const rs = await new Promise<Residencia[]>((res) => this.service.listar().subscribe(res));
    this.lista.set(rs);
    if (!this.atual() && rs.length) this.atual.set(rs[0]);
  }
  selecionar(r: Residencia): void { this.atual.set(r); }
}
