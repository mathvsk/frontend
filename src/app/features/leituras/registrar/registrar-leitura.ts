import { Component, inject, signal } from '@angular/core';
import { LeituraService } from '../../../core/api/leitura.service';
import { ResidenciaSelecionadaService } from '../../../core/api/residencia-selecionada.service';
import { Leitura, OrigemLeitura } from '../../../core/models/api.models';
import { UiButton } from '../../../shared/ui/ui-button';
import { UiTextField } from '../../../shared/ui/ui-text-field';
import { UiCard } from '../../../shared/ui/ui-card';

@Component({
  selector: 'app-registrar-leitura',
  imports: [UiButton, UiTextField, UiCard],
  template: `
    <h1 class="mb-6 text-h1 font-medium">Registrar leitura</h1>
    <div class="mb-4 flex gap-2">
      <app-button [variant]="origem()==='Manual' ? 'primary':'ghost'" (click)="origem.set('Manual')">Medidor</app-button>
      <app-button [variant]="origem()==='Fatura' ? 'primary':'ghost'" (click)="origem.set('Fatura')">Fatura</app-button>
    </div>
    <div class="flex flex-col gap-4">
      <app-text-field label="Mês" type="number" [value]="String(mes())" (valueChange)="mes.set(+$event)" />
      <app-text-field label="Ano" type="number" [value]="String(ano())" (valueChange)="ano.set(+$event)" />
      @if (origem()==='Manual') {
        <app-text-field label="Leitura do medidor (kWh)" type="number" [value]="String(valorMedidor())" (valueChange)="valorMedidor.set(+$event)" />
      } @else {
        <app-text-field label="Consumo da fatura (kWh)" type="number" [value]="String(consumoKwh())" (valueChange)="consumoKwh.set(+$event)" />
      }
      @if (erro()) { <p class="text-[13px] text-danger">{{ erro() }}</p> }
      <app-button (click)="salvar()" [disabled]="carregando()">Salvar</app-button>
      @if (resultado(); as r) {
        <app-card>
          <p class="text-[13px] text-muted">Consumo</p>
          <p class="text-h2 font-medium">{{ r.consumoKwh }} kWh · R$ {{ r.custoEstimado.toFixed(2) }}</p>
        </app-card>
      }
    </div>`,
})
export class RegistrarLeituraPage {
  private service = inject(LeituraService);
  private sel = inject(ResidenciaSelecionadaService);
  protected String = String;

  origem = signal<OrigemLeitura>('Manual');
  mes = signal(new Date().getMonth() + 1);
  ano = signal(new Date().getFullYear());
  valorMedidor = signal(0);
  consumoKwh = signal(0);
  resultado = signal<Leitura | null>(null);
  erro = signal<string | null>(null);
  carregando = signal(false);

  salvar(): void {
    const r = this.sel.atual();
    if (!r) { this.erro.set('Selecione uma residência.'); return; }
    this.erro.set(null);
    this.carregando.set(true);
    this.service.registrar(r.id, {
      mesReferencia: this.mes(),
      anoReferencia: this.ano(),
      origem: this.origem(),
      valorMedidor: this.origem() === 'Manual' ? this.valorMedidor() : null,
      consumoKwh: this.origem() === 'Fatura' ? this.consumoKwh() : null,
    }).subscribe({
      next: (res) => { this.resultado.set(res); this.carregando.set(false); },
      error: (e) => { this.erro.set(e?.mensagem ?? 'Falha ao salvar.'); this.carregando.set(false); },
    });
  }
}
