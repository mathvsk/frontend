import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeituraService } from '../../../core/api/leitura.service';
import { ResidenciaSelecionadaService } from '../../../core/api/residencia-selecionada.service';
import { Leitura, RegistrarLeitura } from '../../../core/models/api.models';
import { UiButton } from '../../../shared/ui/ui-button';
import { UiTextField } from '../../../shared/ui/ui-text-field';
import { UiCard } from '../../../shared/ui/ui-card';

@Component({
  selector: 'app-registrar-leitura',
  imports: [UiButton, UiTextField, UiCard],
  template: `
    <h1 class="mb-6 text-h1 font-medium">{{ id() ? 'Editar gasto' : 'Adicionar gasto' }}</h1>
    <div class="flex flex-col gap-4">
      <app-text-field label="Mês" type="number" [value]="String(mes())" (valueChange)="mes.set(+$event)" />
      <app-text-field label="Ano" type="number" [value]="String(ano())" (valueChange)="ano.set(+$event)" />
      <app-text-field label="Consumo (kWh)" type="number" [value]="String(consumoKwh())" (valueChange)="consumoKwh.set(+$event)" />
      <app-text-field label="Valor da fatura (R$)" type="number" [value]="String(valor())" (valueChange)="valor.set(+$event)" />
      @if (erro()) { <p class="text-[13px] text-danger">{{ erro() }}</p> }
      <app-button (click)="salvar()" [disabled]="carregando()">{{ id() ? 'Salvar alterações' : 'Salvar' }}</app-button>
      @if (resultado(); as r) {
        <app-card><p class="text-[13px] text-muted">Gasto</p><p class="text-h2 font-medium">{{ r.consumoKwh }} kWh · R$ {{ r.custoEstimado.toFixed(2) }}</p></app-card>
      }
    </div>`,
})
export class RegistrarLeituraPage {
  private service = inject(LeituraService);
  private sel = inject(ResidenciaSelecionadaService);
  private route = inject(ActivatedRoute);
  protected String = String;

  id = signal<number | null>(null);
  mes = signal(new Date().getMonth() + 1);
  ano = signal(new Date().getFullYear());
  consumoKwh = signal(0);
  valor = signal(0);
  resultado = signal<Leitura | null>(null);
  erro = signal<string | null>(null);
  carregando = signal(false);

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(+idParam);
      const st = (typeof history !== 'undefined' ? history.state : null) ?? {};
      if (st.mes) this.mes.set(st.mes);
      if (st.ano) this.ano.set(st.ano);
      if (st.consumoKwh != null) this.consumoKwh.set(st.consumoKwh);
      if (st.valor != null) this.valor.set(st.valor);
    }
  }

  salvar(): void {
    const r = this.sel.atual();
    if (!r) { this.erro.set('Selecione uma residência.'); return; }
    this.erro.set(null); this.carregando.set(true);
    const dto: RegistrarLeitura = {
      mesReferencia: this.mes(), anoReferencia: this.ano(), origem: 'Fatura',
      consumoKwh: this.consumoKwh(), valorFatura: this.valor(),
    };
    const obs = this.id()
      ? this.service.atualizar(r.id, this.id()!, dto)
      : this.service.registrar(r.id, dto);
    obs.subscribe({
      next: (res) => { this.resultado.set(res); this.carregando.set(false); },
      error: (e) => { this.erro.set(e?.mensagem ?? 'Falha ao salvar.'); this.carregando.set(false); },
    });
  }
}
