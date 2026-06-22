import { Component, inject, signal } from '@angular/core';
import { DicaService } from '../../core/api/dica.service';
import { Dica } from '../../core/models/api.models';
import { UiButton } from '../../shared/ui/ui-button';
import { UiTextField } from '../../shared/ui/ui-text-field';
import { UiCard } from '../../shared/ui/ui-card';

@Component({
  selector: 'app-dica-form',
  imports: [UiButton, UiTextField, UiCard],
  template: `
    <h1 class="mb-4 text-h1 font-medium">Gerenciar dicas</h1>
    <div class="mb-6 flex flex-col gap-3">
      <app-text-field label="Categoria" [value]="categoria()" (valueChange)="categoria.set($event)" />
      <app-text-field label="Título" [value]="titulo()" (valueChange)="titulo.set($event)" />
      <app-text-field label="Conteúdo" [value]="conteudo()" (valueChange)="conteudo.set($event)" />
      <app-button (click)="criar()">Adicionar dica</app-button>
    </div>
    @for (d of dicas(); track d.id) {
      <app-card class="mb-2"><div class="flex items-center justify-between"><span>{{ d.titulo }}</span>
        <button (click)="remover(d)" class="min-h-[44px] text-[13px] text-danger">Remover</button></div></app-card>
    }`,
})
export class DicaForm {
  private service = inject(DicaService);
  categoria = signal(''); titulo = signal(''); conteudo = signal('');
  dicas = signal<Dica[]>([]);
  constructor() { this.recarregar(); }
  private recarregar() { this.service.listar().subscribe((d) => this.dicas.set(d)); }
  criar(): void {
    this.service.criar({ categoria: this.categoria(), titulo: this.titulo(), conteudo: this.conteudo() })
      .subscribe(() => { this.titulo.set(''); this.conteudo.set(''); this.recarregar(); });
  }
  remover(d: Dica): void { this.service.remover(d.id).subscribe(() => this.recarregar()); }
}
