import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DicaService } from '../../core/api/dica.service';
import { AuthService } from '../../core/auth/auth.service';
import { Dica } from '../../core/models/api.models';
import { UiCard } from '../../shared/ui/ui-card';

@Component({
  selector: 'app-dicas',
  imports: [UiCard, RouterLink],
  template: `
    <div class="mb-4 flex items-center justify-between">
      <h1 class="text-h1 font-medium">Dicas</h1>
      @if (auth.isAdmin()) { <a routerLink="/dicas/gerenciar" class="min-h-[44px] text-[13px] text-primary">Gerenciar</a> }
    </div>
    @for (d of dicas(); track d.id) {
      <app-card class="mb-3">
        <p class="text-[12px] text-primary">{{ d.categoria }}</p>
        <p class="text-[16px] font-medium">{{ d.titulo }}</p>
        <p class="mt-1 text-[14px] text-muted">{{ d.conteudo }}</p>
      </app-card>
    } @empty { <app-card><p class="text-muted">Nenhuma dica.</p></app-card> }`,
})
export class Dicas {
  private service = inject(DicaService);
  auth = inject(AuthService);
  dicas = signal<Dica[]>([]);
  constructor() { this.service.listar().subscribe((d) => this.dicas.set(d)); }
}
