import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { DashboardService } from '../../../core/api/dashboard.service';
import { ResidenciaSelecionadaService } from '../../../core/api/residencia-selecionada.service';
import { HistoricoItem } from '../../../core/models/api.models';
import { UiCard } from '../../../shared/ui/ui-card';
import { UiButton } from '../../../shared/ui/ui-button';
import { CountUpDirective } from '../../../shared/ui/count-up.directive';
import { montarDashboardVm, DashboardVm } from './dashboard.vm';

const MESES = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

@Component({
  selector: 'app-inicio',
  imports: [UiCard, UiButton, RouterLink, CountUpDirective, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  template: `
    @if (vm(); as v) {
      <app-card>
        <p class="text-[13px] text-muted">Previsão {{ v.previsaoLabel || 'do próximo mês' }}</p>
        <p class="text-hero font-semibold leading-none"><span [appCountUp]="round(v.previsaoKwh)"></span> <span class="text-[18px] text-muted">kWh</span></p>
        <p class="mt-1 text-h2 font-medium text-primary">R$ {{ v.previsaoValor.toFixed(2) }}</p>
        @if (v.temConsumoAtual) {
          <p class="mt-2 text-[13px] text-muted">Consumo atual ({{ v.consumoAtualLabel }}): {{ round(v.consumoAtualKwh) }} kWh · R$ {{ v.consumoAtualValor.toFixed(2) }}</p>
        }
      </app-card>

      <a routerLink="/leituras/registrar" class="mt-4 block"><app-button>Registrar leitura</app-button></a>

      @if (v.temHistorico) {
        <div class="mt-4 mb-3 flex gap-2">
          <button (click)="metric.set('kwh')" class="min-h-[44px] rounded-field px-3 text-[13px]" [class]="metric()==='kwh' ? 'bg-primary text-on-primary' : 'border border-border text-muted'">kWh</button>
          <button (click)="metric.set('valor')" class="min-h-[44px] rounded-field px-3 text-[13px]" [class]="metric()==='valor' ? 'bg-primary text-on-primary' : 'border border-border text-muted'">R$</button>
        </div>
        <app-card>
          <canvas baseChart type="bar" [data]="data()" [options]="options" aria-label="Gráfico do histórico"></canvas>
        </app-card>
      }
    } @else if (semResidencia()) {
      <app-card>
        <p class="mb-3">Cadastre sua residência para começar.</p>
        <a routerLink="/residencia"><app-button>Cadastrar residência</app-button></a>
      </app-card>
    }`,
})
export class Inicio {
  private dash = inject(DashboardService);
  private sel = inject(ResidenciaSelecionadaService);

  vm = signal<DashboardVm | null>(null);
  historico = signal<HistoricoItem[]>([]);
  metric = signal<'kwh' | 'valor'>('kwh');
  semResidencia = signal(false);
  options: ChartConfiguration<'bar'>['options'] = { responsive: true, plugins: { legend: { display: false } } };

  data = computed<ChartConfiguration<'bar'>['data']>(() => ({
    labels: this.historico().map(l => MESES[l.mes]),
    datasets: [{ data: this.historico().map(l => this.metric() === 'kwh' ? l.consumoKwh : l.custoEstimado), backgroundColor: '#E6B33E' }],
  }));

  constructor() { this.carregar(); }
  round(n: number) { return Math.round(n); }

  private async carregar(): Promise<void> {
    await this.sel.carregar();
    const r = this.sel.atual();
    if (!r) { this.semResidencia.set(true); return; }
    this.dash.obter(r.id).subscribe(d => {
      this.historico.set(d.historico ?? []);
      this.vm.set(montarDashboardVm(d));
    });
  }
}
