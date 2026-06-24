import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from '../../core/api/dashboard.service';
import { LeituraService } from '../../core/api/leitura.service';
import { ResidenciaSelecionadaService } from '../../core/api/residencia-selecionada.service';
import { HistoricoItem } from '../../core/models/api.models';
import { statusMes } from '../../core/utils/consumo.utils';
import { UiCard } from '../../shared/ui/ui-card';

const MESES = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

@Component({
  selector: 'app-historico',
  imports: [BaseChartDirective, UiCard],
  providers: [provideCharts(withDefaultRegisterables())],
  template: `
    <h1 class="mb-4 text-h1 font-medium">Histórico</h1>
    <div class="mb-3 flex gap-2">
      <button (click)="metric.set('kwh')" class="min-h-[44px] rounded-field px-3 text-[13px]" [class]="metric()==='kwh' ? 'bg-primary text-on-primary' : 'border border-border text-muted'">kWh</button>
      <button (click)="metric.set('valor')" class="min-h-[44px] rounded-field px-3 text-[13px]" [class]="metric()==='valor' ? 'bg-primary text-on-primary' : 'border border-border text-muted'">R$</button>
    </div>
    <app-card>
      <canvas baseChart type="bar" [data]="data()" [options]="options" aria-label="Gráfico do histórico"></canvas>
    </app-card>
    <table class="mt-4 w-full text-[13px]">
      <thead><tr class="text-muted">
        <th class="py-2 text-left">Mês</th><th class="text-right">Consumo</th><th class="text-right">Meta</th><th class="text-right">Valor</th><th class="text-center">Status</th><th></th>
      </tr></thead>
      <tbody>
        @for (l of historico(); track l.id) {
          <tr class="border-t border-border">
            <td class="py-2">{{ rotulo(l.mes, l.ano) }}</td>
            <td class="text-right">{{ l.consumoKwh }}</td>
            <td class="text-right">{{ l.limiteKwh ?? '—' }}</td>
            <td class="text-right">R$ {{ l.custoEstimado.toFixed(2) }}</td>
            <td class="text-center" [class.text-danger]="status(l)==='acima'" [class.text-ok]="status(l)==='ok'">{{ status(l) }}</td>
            <td class="text-right whitespace-nowrap">
              <button (click)="editar(l)" class="min-h-[44px] px-2 text-primary" aria-label="Editar">Editar</button>
              <button (click)="remover(l)" class="min-h-[44px] px-2 text-danger" aria-label="Remover">Remover</button>
            </td>
          </tr>
        } @empty {
          <tr><td colspan="6" class="py-4 text-center text-muted">Sem dados de histórico.</td></tr>
        }
      </tbody>
    </table>`,
})
export class Historico {
  private dash = inject(DashboardService);
  private leituraService = inject(LeituraService);
  private sel = inject(ResidenciaSelecionadaService);
  private router = inject(Router);

  historico = signal<HistoricoItem[]>([]);
  metric = signal<'kwh' | 'valor'>('kwh');
  options: ChartConfiguration<'bar'>['options'] = { responsive: true, plugins: { legend: { display: false } } };

  data = computed<ChartConfiguration<'bar'>['data']>(() => ({
    labels: this.historico().map(l => MESES[l.mes]),
    datasets: [{
      data: this.historico().map(l => this.metric() === 'kwh' ? l.consumoKwh : l.custoEstimado),
      backgroundColor: '#E6B33E',
    }],
  }));

  constructor() { this.carregar(); }

  rotulo(mes: number, ano: number) { return `${MESES[mes]} ${ano}`; }
  status(l: HistoricoItem) { return l.limiteKwh != null ? statusMes(l.consumoKwh, l.limiteKwh, false) : '—'; }

  editar(l: HistoricoItem): void {
    this.router.navigate(['/leituras', l.id, 'editar'], {
      state: { mes: l.mes, ano: l.ano, consumoKwh: l.consumoKwh, valor: l.custoEstimado },
    });
  }

  remover(l: HistoricoItem): void {
    const r = this.sel.atual();
    if (!r || !confirm('Remover este lançamento?')) return;
    this.leituraService.remover(r.id, l.id).subscribe(() => this.carregar());
  }

  private async carregar(): Promise<void> {
    await this.sel.carregar();
    const r = this.sel.atual();
    if (!r) return;
    const hoje = new Date();
    this.dash.obter(r.id, hoje.getMonth() + 1, hoje.getFullYear())
      .subscribe(d => this.historico.set(d.historico ?? []));
  }
}
