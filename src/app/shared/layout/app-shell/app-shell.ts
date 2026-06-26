import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../../../core/auth/auth.service';
import { ResidenciaSelecionadaService } from '../../../core/api/residencia-selecionada.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIcon],
  template: `
    <header class="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-surface px-4">
      <span class="font-medium">EcoWatt</span>
      <div class="flex items-center gap-1">
        <a routerLink="/residencia" class="flex min-h-[44px] items-center gap-1 px-2 text-[13px] text-muted" aria-label="Minha residência">
          <ng-icon name="lucideBuilding" size="20"></ng-icon>
          {{ atual()?.apelido ?? 'Residência' }}
        </a>
        <button (click)="sair()" class="flex min-h-[44px] items-center gap-1 px-2 text-[13px] text-muted" aria-label="Sair">
          <ng-icon name="lucideLogOut" size="16"></ng-icon>
          Sair
        </button>
      </div>
    </header>
    <main class="mx-auto max-w-[448px] px-4 pb-24 pt-4">
      <div [class.animate-in]="rotaAnim()" [class.fade-in]="rotaAnim()" class="duration-200">
        <router-outlet (activate)="onActivate()" />
      </div>
    </main>
    <nav class="fixed inset-x-0 bottom-0 mx-auto flex max-w-[448px] justify-around border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
      <a routerLink="/" routerLinkActive="text-primary nav-active" [routerLinkActiveOptions]="{exact:true}" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-muted transition-colors">
        <ng-icon name="lucideHouse" size="20"></ng-icon>
        Início
        <span class="nav-dot mt-0.5 h-1 w-1 rounded-full bg-primary"></span>
      </a>
      <a routerLink="/leituras" routerLinkActive="text-primary nav-active" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-muted transition-colors">
        <ng-icon name="lucideChartBar" size="20"></ng-icon>
        Leituras
        <span class="nav-dot mt-0.5 h-1 w-1 rounded-full bg-primary"></span>
      </a>
      <a routerLink="/dicas" routerLinkActive="text-primary nav-active" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-muted transition-colors">
        <ng-icon name="lucideLightbulb" size="20"></ng-icon>
        Dicas
        <span class="nav-dot mt-0.5 h-1 w-1 rounded-full bg-primary"></span>
      </a>
    </nav>`,
})
export class AppShell {
  private auth = inject(AuthService);
  private sel = inject(ResidenciaSelecionadaService);

  atual = this.sel.atual;
  rotaAnim = signal(true);

  constructor() { this.sel.carregar(); }

  onActivate(): void {
    this.rotaAnim.set(false);
    requestAnimationFrame(() => this.rotaAnim.set(true));
  }

  sair(): void { this.auth.logout(); location.href = '/login'; }
}
