import { Component, inject, signal } from '@angular/core';
import { ResidenciaService } from '../../core/api/residencia.service';
import { ResidenciaSelecionadaService } from '../../core/api/residencia-selecionada.service';
import { Residencia } from '../../core/models/api.models';
import { UiButton } from '../../shared/ui/ui-button';
import { UiTextField } from '../../shared/ui/ui-text-field';
import { UiCard } from '../../shared/ui/ui-card';

@Component({
  selector: 'app-residencias',
  imports: [UiButton, UiTextField, UiCard],
  template: `
    <h1 class="mb-6 text-h1 font-medium">Residências</h1>

    <div class="flex flex-col gap-3 mb-6">
      @for (r of lista(); track r.id) {
        <app-card>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-content">{{ r.apelido }}</p>
              <p class="text-[13px] text-muted">{{ r.bairro }}, {{ r.cidade }}</p>
            </div>
            <div class="flex gap-2">
              @if (atual()?.id !== r.id) {
                <button
                  (click)="selecionar(r)"
                  class="min-h-[44px] rounded-field border border-border px-3 text-[13px] text-content active:bg-surface">
                  Usar
                </button>
              } @else {
                <span class="min-h-[44px] flex items-center rounded-field border border-primary px-3 text-[13px] text-primary">Ativa</span>
              }
            </div>
          </div>
        </app-card>
      } @empty {
        <app-card><p class="text-muted">Nenhuma residência cadastrada ainda.</p></app-card>
      }
    </div>

    <app-card>
      <h2 class="mb-4 text-h2 font-medium">Nova residência</h2>
      <div class="flex flex-col gap-4">
        <app-text-field label="Apelido" placeholder="Ex: Casa, Apartamento…" [(value)]="apelido" />
        <app-text-field label="Bairro" placeholder="Ex: Batel" [(value)]="bairro" />
        <app-text-field label="Cidade" placeholder="Ex: Curitiba" [(value)]="cidade" />
        @if (erro()) { <p class="text-[13px] text-danger">{{ erro() }}</p> }
        <app-button (click)="criar()" [disabled]="carregando()">Cadastrar</app-button>
      </div>
    </app-card>`,
})
export class Residencias {
  private service = inject(ResidenciaService);
  private sel = inject(ResidenciaSelecionadaService);

  lista = this.sel.lista;
  atual = this.sel.atual;

  apelido = signal('');
  bairro = signal('');
  cidade = signal('');
  erro = signal<string | null>(null);
  carregando = signal(false);

  constructor() { this.sel.carregar(); }

  selecionar(r: Residencia): void { this.sel.selecionar(r); }

  criar(): void {
    const apelido = this.apelido().trim();
    const bairro = this.bairro().trim();
    const cidade = this.cidade().trim();
    if (!apelido || !bairro || !cidade) {
      this.erro.set('Preencha todos os campos.');
      return;
    }
    this.erro.set(null);
    this.carregando.set(true);
    this.service.criar({ apelido, bairro, cidade }).subscribe({
      next: (r) => {
        this.sel.lista.update(ls => [...ls, r]);
        if (!this.sel.atual()) this.sel.selecionar(r);
        this.apelido.set('');
        this.bairro.set('');
        this.cidade.set('');
        this.carregando.set(false);
      },
      error: (e) => {
        this.erro.set(e?.mensagem ?? 'Falha ao cadastrar.');
        this.carregando.set(false);
      },
    });
  }
}
