import { Component, inject, signal } from '@angular/core';
import { AlertaService } from '../../core/api/alerta.service';
import { Alerta } from '../../core/models/api.models';
import { UiCard } from '../../shared/ui/ui-card';

@Component({
  selector: 'app-alertas',
  imports: [UiCard],
  template: `
    <h1 class="mb-4 text-h1 font-medium">Alertas</h1>
    @for (a of alertas(); track a.id) {
      <app-card class="mb-3">
        <p class="text-[15px]" [class.text-danger]="a.tipo==='LimiteUltrapassado'">{{ a.mensagem }}</p>
        @if (!a.lido) { <button (click)="marcar(a)" class="mt-2 min-h-[44px] text-[13px] text-primary">Marcar como lido</button> }
      </app-card>
    } @empty { <app-card><p class="text-muted">Nenhum alerta.</p></app-card> }`,
})
export class Alertas {
  private service = inject(AlertaService);
  alertas = signal<Alerta[]>([]);
  constructor() { this.service.listar().subscribe((a) => this.alertas.set(a)); }
  marcar(a: Alerta): void { this.service.marcarLido(a.id).subscribe(() => a.lido = true); }
}
