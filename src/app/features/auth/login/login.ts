import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UiButton } from '../../../shared/ui/ui-button';
import { UiTextField } from '../../../shared/ui/ui-text-field';

@Component({
  selector: 'app-login',
  imports: [UiButton, UiTextField],
  template: `
    <main class="mx-auto flex min-h-dvh max-w-[448px] flex-col justify-center gap-6 px-4">
      <div class="text-center">
        <i class="text-primary" aria-hidden="true"></i>
        <h1 class="text-h1 font-medium">EcoWatt</h1>
        <p class="text-[13px] text-muted">Gestão de consumo de energia</p>
      </div>
      <app-text-field label="E-mail" type="email" [value]="email()" (valueChange)="email.set($event)" />
      <app-text-field label="Senha" type="password" [value]="senha()" (valueChange)="senha.set($event)" [erro]="erro()" />
      <app-button type="button" [disabled]="carregando()" (click)="entrar()">Entrar</app-button>
      <app-button variant="ghost" (click)="irCadastro()">Criar conta</app-button>
    </main>`,
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = signal(''); senha = signal('');
  erro = signal<string | null>(null);
  carregando = signal(false);

  async entrar(): Promise<void> {
    this.erro.set(null); this.carregando.set(true);
    try {
      await this.auth.login(this.email(), this.senha());
      this.router.navigate(['/']);
    } catch (e: any) {
      this.erro.set(e?.mensagem ?? 'Falha ao entrar.');
    } finally {
      this.carregando.set(false);
    }
  }
  irCadastro(): void { this.router.navigate(['/cadastro']); }
}
