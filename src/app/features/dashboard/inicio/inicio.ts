import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/api/dashboard.service';
import { MetaService } from '../../../core/api/meta.service';
import { ResidenciaSelecionadaService } from '../../../core/api/residencia-selecionada.service';
import { UiCard } from '../../../shared/ui/ui-card';
import { CountUpDirective } from '../../../shared/ui/count-up.directive';
import { montarDashboardVm, DashboardVm } from './dashboard.vm';

@Component({
  selector: 'app-inicio',
  imports: [UiCard, RouterLink, CountUpDirective],
  template: `
    @if (vm(); as v) {
      <app-card>
        <p class="text-[13px] text-muted">{{ v.ehReal ? 'Consumo do mês' : 'Previsto (média do histórico)' }}</p>
        <p class="text-hero font-semibold leading-none"><span [appCountUp]="round(v.previstoKwh)"></span> <span class="text-[18px] text-muted">kWh</span></p>
        <p class="mt-1 text-h2 font-medium text-primary">R$ {{ v.previstoValor.toFixed(2) }}</p>
        @if (v.temMesPassado) {
          <p class="mt-2 text-[13px] text-muted">
            Mês passado: {{ round(v.mesPassadoKwh) }} kWh · R$ {{ v.mesPassadoValor.toFixed(2) }}
            <span [class.text-danger]="v.deltaMesPassadoPct > 0" [class.text-ok]="v.deltaMesPassadoPct <= 0">
              {{ v.deltaMesPassadoPct > 0 ? '▲' : '▼' }} {{ round(Math.abs(v.deltaMesPassadoPct)) }}%
            </span>
          </p>
        }
        @if (v.temMeta) {
          <div class="mt-3 h-1.5 w-full rounded-full bg-surface">
            <div class="h-1.5 rounded-full bg-primary" [style.width.%]="pct(v)"></div>
          </div>
          <p class="mt-1 text-[12px] text-muted">{{ v.noControle ? 'no controle' : 'acima da meta' }}</p>
        }
      </app-card>
      <div class="mt-4 grid grid-cols-2 gap-3">
        <a routerLink="/metas"><app-card><p class="text-[12px] text-muted">Meta</p><p class="text-h1 font-medium">{{ limite() }}</p><p class="text-[12px] text-muted">kWh no mês</p></app-card></a>
        @if (v.temMeta) {
          <app-card><p class="text-[12px] text-muted">Folga</p><p class="text-h1 font-medium" [class.text-danger]="!v.noControle">{{ round(v.folga) }}</p><p class="text-[12px] text-muted">kWh previstos</p></app-card>
        }
      </div>
      <app-card class="mt-4">
        <p class="text-[13px] text-muted">Comparativo · Curitiba</p>
        <p class="mt-1 text-[15px]">{{ round(Math.abs(v.diferencaMedia)) }} kWh {{ v.diferencaMedia >= 0 ? 'abaixo' : 'acima' }} da média regional</p>
      </app-card>
    } @else if (semResidencia()) {
      <app-card><p>Cadastre uma residência para começar.</p></app-card>
    }`,
})
export class Inicio {
  private dash = inject(DashboardService);
  private metaService = inject(MetaService);
  private sel = inject(ResidenciaSelecionadaService);
  protected Math = Math;
  vm = signal<DashboardVm | null>(null);
  limite = signal(0);
  semResidencia = signal(false);

  constructor() { this.carregar(); }
  round(n: number) { return Math.round(n); }
  pct(v: DashboardVm) { return Math.min(100, Math.round(v.percentualConsumido * 100)); }

  private async carregar(): Promise<void> {
    await this.sel.carregar();
    const r = this.sel.atual();
    if (!r) { this.semResidencia.set(true); return; }
    const hoje = new Date();
    const mes = hoje.getMonth() + 1, ano = hoje.getFullYear();
    const d = await new Promise<any>((res) => this.dash.obter(r.id, mes, ano).subscribe(res));
    const meta = await new Promise<any>((res) =>
      this.metaService.atual(r.id, mes, ano).subscribe({ next: res, error: () => res(null) }));
    const limite = meta?.limiteKwh ?? 0;
    this.limite.set(limite);
    this.vm.set(montarDashboardVm(d, limite, meta?.mediaRegionalKwh ?? 0, mes, ano));
  }
}
