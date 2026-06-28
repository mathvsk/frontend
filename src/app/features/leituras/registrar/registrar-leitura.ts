import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeituraService } from '../../../core/api/leitura.service';
import { ResidenciaSelecionadaService } from '../../../core/api/residencia-selecionada.service';
import { Leitura, RegistrarLeitura } from '../../../core/models/api.models';
import { UiButton } from '../../../shared/ui/ui-button';
import { UiTextField } from '../../../shared/ui/ui-text-field';
import { UiCurrencyField } from '../../../shared/ui/ui-currency-field';
import { UiMonthField } from '../../../shared/ui/ui-month-field';
import { UiCard } from '../../../shared/ui/ui-card';
import { mesAnoAtual, mesAnoParaInput, mesAnoDeInput } from '../../../core/utils/mes-ano';

@Component({
  selector: 'app-registrar-leitura',
  imports: [UiButton, UiTextField, UiCurrencyField, UiMonthField, UiCard],
  template: `
    <h1 class="mb-6 text-h1 font-medium">{{ id() ? 'Editar gasto' : 'Adicionar gasto' }}</h1>
    <div class="flex flex-col gap-4">
      <app-month-field label="Mês de referência" [(value)]="mesAno" />
      <app-text-field label="Consumo (kWh)" type="number" placeholder="Ex.: 350"
        [value]="consumo() === null ? '' : String(consumo())" (valueChange)="consumo.set($event === '' ? null : +$event)" />
      <app-currency-field label="Valor da fatura" placeholder="R$ 0,00" [(value)]="valor" />
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
  mesAno = signal<string>(mesAnoAtual());
  consumo = signal<number | null>(null);
  valor = signal<number | null>(null);
  resultado = signal<Leitura | null>(null);
  erro = signal<string | null>(null);
  carregando = signal(false);

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(+idParam);
      const st = (typeof history !== 'undefined' ? history.state : null) ?? {};
      if (st.mes && st.ano) this.mesAno.set(mesAnoParaInput(st.mes, st.ano));
      if (st.consumoKwh != null) this.consumo.set(st.consumoKwh);
      if (st.valor != null) this.valor.set(st.valor);
    }
  }

  salvar(): void {
    const r = this.sel.atual();
    if (!r) { this.erro.set('Selecione uma residência.'); return; }
    const ref = mesAnoDeInput(this.mesAno());
    if (!ref) { this.erro.set('Selecione o mês de referência.'); return; }
    if (this.consumo() === null) { this.erro.set('Informe o consumo.'); return; }
    this.erro.set(null); this.carregando.set(true);
    const dto: RegistrarLeitura = {
      mesReferencia: ref.mes, anoReferencia: ref.ano, origem: 'Fatura',
      consumoKwh: this.consumo(), valorFatura: this.valor(),
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
