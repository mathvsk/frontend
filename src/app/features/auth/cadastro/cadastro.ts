import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UiButton } from '../../../shared/ui/ui-button';
import { UiTextField } from '../../../shared/ui/ui-text-field';

@Component({
  selector: 'app-cadastro',
  imports: [UiButton, UiTextField],
  template: `
    <main class="mx-auto flex min-h-dvh max-w-[448px] flex-col justify-center gap-5 px-4">
      <h1 class="text-h1 font-medium">Criar conta</h1>
      <app-text-field label="Nome completo" [value]="nome()" (valueChange)="nome.set($event)" />
      <app-text-field label="E-mail" type="email" [value]="email()" (valueChange)="email.set($event)" />
      <app-text-field label="Senha" type="password" [value]="senha()" (valueChange)="senha.set($event)" />
      <app-text-field label="Confirmar senha" type="password" [value]="confirmar()" (valueChange)="confirmar.set($event)" [erro]="erro()" />
      <app-button type="button" [disabled]="carregando()" (click)="criar()">Continuar</app-button>
      <app-button variant="ghost" (click)="irLogin()">Já tenho conta</app-button>
    </main>`,
})
export class Cadastro {
  private auth = inject(AuthService);
  private router = inject(Router);
  nome = signal(''); email = signal(''); senha = signal(''); confirmar = signal('');
  erro = signal<string | null>(null); carregando = signal(false);

  async criar(): Promise<void> {
    this.erro.set(null);
    if (this.senha() !== this.confirmar()) { this.erro.set('As senhas não coincidem.'); return; }
    this.carregando.set(true);
    try {
      await this.auth.register(this.nome(), this.email(), this.senha());
      await this.auth.login(this.email(), this.senha());
      this.router.navigate(['/']);
    } catch (e: any) {
      this.erro.set(e?.mensagem ?? 'Falha ao criar conta.');
    } finally {
      this.carregando.set(false);
    }
  }
  irLogin(): void { this.router.navigate(['/login']); }
}
