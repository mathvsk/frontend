import { Component, inject, signal } from '@angular/core';
import { MetaService } from '../../../core/api/meta.service';
import { ResidenciaSelecionadaService } from '../../../core/api/residencia-selecionada.service';
import { UiButton } from '../../../shared/ui/ui-button';
import { UiTextField } from '../../../shared/ui/ui-text-field';

@Component({
  selector: 'app-definir-meta',
  imports: [UiButton, UiTextField],
  template: `
    <h1 class="mb-4 text-h1 font-medium">Definir meta</h1>
    @if (sugestao() > 0) { <p class="mb-3 text-[13px] text-muted">Média regional sugerida: {{ sugestao() }} kWh</p> }
    <div class="flex flex-col gap-4">
      <app-text-field label="Limite (kWh)" type="number" [value]="String(limite())" (valueChange)="limite.set(+$event)" />
      <app-text-field label="Alerta em (% da meta)" type="number" [value]="String(percentual())" (valueChange)="percentual.set(+$event)" />
      @if (ok()) { <p class="text-[13px] text-ok">Meta salva.</p> }
      <app-button (click)="salvar()">Salvar meta</app-button>
    </div>`,
})
export class DefinirMeta {
  private service = inject(MetaService);
  private sel = inject(ResidenciaSelecionadaService);
  protected String = String;
  limite = signal(0); percentual = signal(80); sugestao = signal(0); ok = signal(false);

  constructor() { this.carregarSugestao(); }
  private async carregarSugestao(): Promise<void> {
    await this.sel.carregar();
    const r = this.sel.atual(); if (!r) return;
    this.service.mediaRegional(r.id).subscribe((m) => this.sugestao.set(m.mediaKwh));
  }
  salvar(): void {
    const r = this.sel.atual(); if (!r) return;
    const hoje = new Date();
    this.service.definir(r.id, {
      mesReferencia: hoje.getMonth() + 1, anoReferencia: hoje.getFullYear(),
      limiteKwh: this.limite(), percentualAlerta: this.percentual() / 100,
    }).subscribe(() => this.ok.set(true));
  }
}
