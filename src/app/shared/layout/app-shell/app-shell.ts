import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-[--color-border] bg-[--color-surface] px-4">
      <span class="font-medium">EcoWatt</span>
      <button (click)="sair()" class="min-h-[44px] text-[13px] text-[--color-muted]">Sair</button>
    </header>
    <main class="mx-auto max-w-[448px] px-4 pb-24 pt-4"><router-outlet /></main>
    <nav class="fixed inset-x-0 bottom-0 mx-auto flex max-w-[448px] justify-around border-t border-[--color-border] bg-[--color-surface] pb-[env(safe-area-inset-bottom)]">
      <a routerLink="/" routerLinkActive="text-[--color-primary]" [routerLinkActiveOptions]="{exact:true}" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-[--color-muted]">Início</a>
      <a routerLink="/historico" routerLinkActive="text-[--color-primary]" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-[--color-muted]">Histórico</a>
      <a routerLink="/dicas" routerLinkActive="text-[--color-primary]" class="flex min-h-[44px] flex-1 flex-col items-center justify-center py-2 text-[11px] text-[--color-muted]">Dicas</a>
    </nav>`,
})
export class AppShell {
  private auth = inject(AuthService);
  sair(): void { this.auth.logout(); location.href = '/login'; }
}
