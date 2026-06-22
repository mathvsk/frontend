import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-surface px-4">
      <span class="font-medium">EcoWatt</span>
      <button (click)="sair()" class="min-h-[44px] text-[13px] text-muted">Sair</button>
    </header>
    <main class="mx-auto max-w-[448px] px-4 pb-24 pt-4"><router-outlet /></main>
    <nav class="fixed inset-x-0 bottom-0 mx-auto flex max-w-[448px] justify-around border-t border-border bg-surface pb-[env(safe-area-inset-bottom)]">
      <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{exact:true}" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-muted">Início</a>
      <a routerLink="/historico" routerLinkActive="text-primary" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-muted">Histórico</a>
      <a routerLink="/dicas" routerLinkActive="text-primary" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-muted">Dicas</a>
    </nav>`,
})
export class AppShell {
  private auth = inject(AuthService);
  sair(): void { this.auth.logout(); location.href = '/login'; }
}
