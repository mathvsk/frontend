import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { DashboardService } from '../../core/api/dashboard.service';
import { LeituraService } from '../../core/api/leitura.service';
import { ResidenciaSelecionadaService } from '../../core/api/residencia-selecionada.service';
import { HistoricoItem } from '../../core/models/api.models';
import { UiConfirmDialog } from '../../shared/ui/ui-confirm-dialog';

export function formatarRefMesAno(mes: number, ano: number): string {
  return `${String(mes).padStart(2, '0')}/${String(ano).slice(-2)}`;
}

@Component({
  selector: 'app-leituras',
  imports: [NgIcon, UiConfirmDialog],
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
            <td class="whitespace-nowrap py-1.5 text-right">
              <button (click)="editar(l)" aria-label="Editar leitura"
                class="ml-1 inline-flex h-11 w-11 items-center justify-center rounded-field border border-border text-muted transition hover:bg-surface active:scale-95">
                <ng-icon name="lucidePencil" size="17"></ng-icon>
              </button>
              <button (click)="remover(l)" aria-label="Remover leitura"
                class="ml-1.5 inline-flex h-11 w-11 items-center justify-center rounded-field border border-border text-danger transition hover:bg-surface active:scale-95">
                <ng-icon name="lucideTrash2" size="17"></ng-icon>
              </button>
            </td>
          </tr>
        } @empty {
          <tr><td colspan="4" class="py-4 text-center text-muted">Nenhuma leitura registrada.</td></tr>
        }
      </tbody>
    </table>

    @if (aRemover(); as l) {
      <app-confirm-dialog
        title="Remover leitura"
        [message]="'A leitura de ' + rotulo(l.mes, l.ano) + ' será removida permanentemente. Essa ação não pode ser desfeita.'"
        confirmLabel="Remover"
        (confirm)="confirmarRemocao()"
        (cancel)="aRemover.set(null)" />
    }`,
})
export class Leituras {
  private dash = inject(DashboardService);
  private leituraService = inject(LeituraService);
  private sel = inject(ResidenciaSelecionadaService);
  private router = inject(Router);

  historico = signal<HistoricoItem[]>([]);
  aRemover = signal<HistoricoItem | null>(null);

  constructor() { this.carregar(); }
  rotulo(mes: number, ano: number) { return formatarRefMesAno(mes, ano); }

  editar(l: HistoricoItem): void {
    this.router.navigate(['/leituras', l.id, 'editar'], {
      state: { mes: l.mes, ano: l.ano, consumoKwh: l.consumoKwh, valor: l.custoEstimado },
    });
  }

  remover(l: HistoricoItem): void { this.aRemover.set(l); }

  confirmarRemocao(): void {
    const r = this.sel.atual();
    const l = this.aRemover();
    if (!r || !l) { this.aRemover.set(null); return; }
    this.leituraService.remover(r.id, l.id).subscribe(() => {
      this.aRemover.set(null);
      this.carregar();
    });
  }

  private async carregar(): Promise<void> {
    await this.sel.carregar();
    const r = this.sel.atual();
    if (!r) return;
    this.dash.obter(r.id).subscribe(d => this.historico.set(d.historico ?? []));
  }
}
