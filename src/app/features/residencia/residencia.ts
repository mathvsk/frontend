import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ResidenciaService } from '../../core/api/residencia.service';
import { ResidenciaSelecionadaService } from '../../core/api/residencia-selecionada.service';
import { UiButton } from '../../shared/ui/ui-button';
import { UiTextField } from '../../shared/ui/ui-text-field';
import { UiCard } from '../../shared/ui/ui-card';

@Component({
  selector: 'app-residencia',
  imports: [UiButton, UiTextField, UiCard],
  template: `
    <h1 class="mb-6 text-h1 font-medium">{{ id() ? 'Minha residência' : 'Cadastrar residência' }}</h1>
    <app-card>
      <div class="flex flex-col gap-4">
        <app-text-field label="Apelido" placeholder="Ex: Casa, Apartamento…" [(value)]="apelido" />
        <app-text-field label="Bairro" placeholder="Ex: Batel" [(value)]="bairro" />
        <app-text-field label="Cidade" placeholder="Ex: Curitiba" [(value)]="cidade" />
        @if (erro()) { <p class="text-[13px] text-danger">{{ erro() }}</p> }
        @if (salvo()) { <p class="text-[13px] text-ok">Salvo.</p> }
        <app-button (click)="salvar()" [disabled]="carregando()">{{ id() ? 'Salvar alterações' : 'Cadastrar' }}</app-button>
      </div>
    </app-card>`,
})
export class ResidenciaPage {
  private service = inject(ResidenciaService);
  private sel = inject(ResidenciaSelecionadaService);
  private router = inject(Router);

  id = signal<number | null>(null);
  apelido = signal('');
  bairro = signal('');
  cidade = signal('');
  erro = signal<string | null>(null);
  salvo = signal(false);
  carregando = signal(false);

  constructor() { this.carregar(); }

  private async carregar(): Promise<void> {
    await this.sel.carregar();
    const r = this.sel.atual();
    if (r) {
      this.id.set(r.id);
      this.apelido.set(r.apelido);
      this.bairro.set(r.bairro);
      this.cidade.set(r.cidade);
    }
  }

  salvar(): void {
    const apelido = this.apelido().trim(), bairro = this.bairro().trim(), cidade = this.cidade().trim();
    if (!apelido || !bairro || !cidade) { this.erro.set('Preencha todos os campos.'); return; }
    this.erro.set(null); this.salvo.set(false); this.carregando.set(true);
    const dto = { apelido, bairro, cidade };
    const id = this.id();
    if (id) {
      this.service.atualizar(id, dto).subscribe({
        next: () => { this.sel.atual.set({ ...this.sel.atual()!, ...dto }); this.salvo.set(true); this.carregando.set(false); },
        error: (e) => { this.erro.set(e?.mensagem ?? 'Falha ao salvar.'); this.carregando.set(false); },
      });
    } else {
      this.service.criar(dto).subscribe({
        next: (r) => { this.sel.atual.set(r); this.carregando.set(false); this.router.navigate(['/']); },
        error: (e) => { this.erro.set(e?.mensagem ?? 'Falha ao cadastrar.'); this.carregando.set(false); },
      });
    }
  }
}
