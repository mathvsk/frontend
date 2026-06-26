import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../core/api/dashboard.service';
import { LeituraService } from '../../core/api/leitura.service';
import { ResidenciaSelecionadaService } from '../../core/api/residencia-selecionada.service';
import { HistoricoItem } from '../../core/models/api.models';
const MESES = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

@Component({
  selector: 'app-leituras',
  imports: [],
  template: `
    <h1 class="mb-4 text-h1 font-medium">Leituras</h1>
    <table class="w-full text-[13px]">
      <thead><tr class="text-muted">
        <th class="py-2 text-left">Mês</th><th class="text-right">Consumo</th><th class="text-right">Valor</th><th></th>
      </tr></thead>
      <tbody>
        @for (l of historico(); track l.id) {
          <tr class="border-t border-border">
            <td class="py-2">{{ rotulo(l.mes, l.ano) }}</td>
            <td class="text-right">{{ l.consumoKwh }} kWh</td>
            <td class="text-right">R$ {{ l.custoEstimado.toFixed(2) }}</td>
            <td class="text-right whitespace-nowrap">
              <button (click)="editar(l)" class="min-h-[44px] px-2 text-primary" aria-label="Editar">Editar</button>
              <button (click)="remover(l)" class="min-h-[44px] px-2 text-danger" aria-label="Remover">Remover</button>
            </td>
          </tr>
        } @empty {
          <tr><td colspan="4" class="py-4 text-center text-muted">Nenhuma leitura registrada.</td></tr>
        }
      </tbody>
    </table>`,
})
export class Leituras {
  private dash = inject(DashboardService);
  private leituraService = inject(LeituraService);
  private sel = inject(ResidenciaSelecionadaService);
  private router = inject(Router);

  historico = signal<HistoricoItem[]>([]);

  constructor() { this.carregar(); }
  rotulo(mes: number, ano: number) { return `${MESES[mes]} ${ano}`; }

  editar(l: HistoricoItem): void {
    this.router.navigate(['/leituras', l.id, 'editar'], {
      state: { mes: l.mes, ano: l.ano, consumoKwh: l.consumoKwh, valor: l.custoEstimado },
    });
  }
  remover(l: HistoricoItem): void {
    const r = this.sel.atual();
    if (!r || !confirm('Remover esta leitura?')) return;
    this.leituraService.remover(r.id, l.id).subscribe(() => this.carregar());
  }
  private async carregar(): Promise<void> {
    await this.sel.carregar();
    const r = this.sel.atual();
    if (!r) return;
    this.dash.obter(r.id).subscribe(d => this.historico.set(d.historico ?? []));
  }
}
