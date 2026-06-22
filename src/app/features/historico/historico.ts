import { Component, computed, inject, signal } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from '../../core/api/dashboard.service';
import { ResidenciaSelecionadaService } from '../../core/api/residencia-selecionada.service';
import { HistoricoItem } from '../../core/models/api.models';
import { UiCard } from '../../shared/ui/ui-card';

const MESES = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

@Component({
  selector: 'app-historico',
  imports: [BaseChartDirective, UiCard],
  providers: [provideCharts(withDefaultRegisterables())],
  template: `
    <h1 class="mb-4 text-h1 font-medium">Histórico</h1>
    <app-card>
      <canvas baseChart type="bar" [data]="data()" [options]="options" aria-label="Gráfico de consumo mensal"></canvas>
    </app-card>
    <table class="mt-4 w-full text-[13px]">
      <thead>
        <tr class="text-muted"><th class="py-2 text-left">Mês</th><th class="text-right">Consumo</th></tr>
      </thead>
      <tbody>
        @for (l of historico(); track l.mes + '-' + l.ano) {
          <tr class="border-t border-border">
            <td class="py-2">{{ rotulo(l.mes, l.ano) }}</td>
            <td class="text-right">{{ l.consumoKwh }} kWh</td>
          </tr>
        } @empty {
          <tr><td colspan="2" class="py-4 text-center text-muted">Sem dados de histórico.</td></tr>
        }
      </tbody>
    </table>`,
})
export class Historico {
  private dash = inject(DashboardService);
  private sel = inject(ResidenciaSelecionadaService);

  historico = signal<HistoricoItem[]>([]);

  options: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  data = computed<ChartConfiguration<'bar'>['data']>(() => ({
    labels: this.historico().map(l => MESES[l.mes]),
    datasets: [{ data: this.historico().map(l => l.consumoKwh), backgroundColor: '#E6B33E' }],
  }));

  constructor() { this.carregar(); }

  rotulo(mes: number, ano: number) { return `${MESES[mes]} ${ano}`; }

  private async carregar(): Promise<void> {
    await this.sel.carregar();
    const r = this.sel.atual();
    if (!r) return;
    const hoje = new Date();
    const mes = hoje.getMonth() + 1;
    const ano = hoje.getFullYear();
    this.dash.obter(r.id, mes, ano).subscribe(d => {
      this.historico.set(d.historico ?? []);
    });
  }
}
