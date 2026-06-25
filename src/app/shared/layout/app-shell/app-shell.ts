import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../../../core/auth/auth.service';
import { ResidenciaSelecionadaService } from '../../../core/api/residencia-selecionada.service';
import { AlertaService } from '../../../core/api/alerta.service';
import { Residencia } from '../../../core/models/api.models';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIcon],
  template: `
    <header class="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-surface px-4 gap-3">
      <span class="font-medium shrink-0">EcoWatt</span>
      <select
        aria-label="Residência ativa"
        class="min-h-[44px] flex-1 rounded-field border border-border bg-surface px-2 text-[13px] text-content outline-none focus:border-primary"
        [value]="atual()?.id ?? ''"
        (change)="onSelChange($event)">
        @for (r of lista(); track r.id) {
          <option [value]="r.id">{{ r.apelido }}</option>
        } @empty {
          <option value="" disabled>Nenhuma residência</option>
        }
      </select>
      <a routerLink="/alertas" class="relative flex min-h-[44px] items-center px-2 text-muted" aria-label="Alertas">
        <ng-icon name="lucideBell" size="20"></ng-icon>
        Alertas @if (naoLidos() > 0) { <span class="ml-1 rounded-full bg-primary px-1.5 text-[11px] text-on-primary">{{ naoLidos() }}</span> }
      </a>
      <button (click)="sair()" class="min-h-[44px] shrink-0 flex items-center gap-1 text-[13px] text-muted">
        <ng-icon name="lucideLogOut" size="16"></ng-icon>
        Sair
      </button>
    </header>
    <main class="mx-auto max-w-[448px] px-4 pb-24 pt-4"><router-outlet /></main>
    <nav class="fixed inset-x-0 bottom-0 mx-auto flex max-w-[448px] justify-around border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
      <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact:true}" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-muted">
        <ng-icon name="lucideHouse" size="20"></ng-icon>
        Início
      </a>
      <a routerLink="/historico" routerLinkActive="text-primary" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-muted">
        <ng-icon name="lucideChartBar" size="20"></ng-icon>
        Histórico
      </a>
      <a routerLink="/residencias" routerLinkActive="text-primary" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-muted">
        <ng-icon name="lucideBuilding" size="20"></ng-icon>
        Residências
      </a>
      <a routerLink="/dicas" routerLinkActive="text-primary" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-muted">
        <ng-icon name="lucideLightbulb" size="20"></ng-icon>
        Dicas
      </a>
    </nav>`,
})
export class AppShell implements OnInit {
  private auth = inject(AuthService);
  private sel = inject(ResidenciaSelecionadaService);
  private alertaService = inject(AlertaService);

  lista = this.sel.lista;
  atual = this.sel.atual;
  naoLidos = signal(0);

  ngOnInit(): void {
    this.sel.carregar();
    this.alertaService.listar().subscribe((alertas) =>
      this.naoLidos.set(alertas.filter((a) => !a.lido).length)
    );
  }

  onSelChange(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    const r = this.lista().find((x: Residencia) => x.id === id);
    if (r) this.sel.selecionar(r);
  }

  sair(): void { this.auth.logout(); location.href = '/login'; }
}
