import { Component, computed, inject, signal } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { UsuarioService } from '../../core/api/usuario.service';
import { AuthService } from '../../core/auth/auth.service';
import { UiCard } from '../../shared/ui/ui-card';
import { UiButton } from '../../shared/ui/ui-button';
import { UiTextField } from '../../shared/ui/ui-text-field';
import { validarImagem } from '../../core/utils/arquivo-imagem';

@Component({
  selector: 'app-perfil',
  imports: [NgIcon, UiCard, UiButton, UiTextField],
  template: `
    <h1 class="mb-6 text-h1 font-medium">Perfil</h1>

    <div class="mb-6 flex flex-col items-center gap-2">
      <button type="button" (click)="fileInput.click()" [disabled]="enviandoFoto()" aria-label="Alterar foto"
        class="relative h-24 w-24 rounded-full border border-border bg-surface transition active:scale-95 disabled:opacity-60">
        @if (fotoUrl()) {
          <img [src]="fotoUrl()" alt="Foto de perfil" class="h-full w-full rounded-full object-cover" />
        } @else {
          <span class="flex h-full w-full items-center justify-center text-muted"><ng-icon name="lucideUser" size="44" /></span>
        }
        <span class="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-bg bg-primary text-on-primary">
          <ng-icon name="lucideCamera" size="16" />
        </span>
      </button>
      <button type="button" (click)="fileInput.click()" class="text-[13px] font-medium text-primary">Alterar foto</button>
      <input #fileInput type="file" accept="image/*" class="hidden" (change)="onArquivo($event)" />
      @if (erroFoto()) { <p class="text-[12px] text-danger">{{ erroFoto() }}</p> }
    </div>

    <app-card>
      <div class="flex flex-col gap-4">
        <app-text-field label="Nome" [value]="nome()" (valueChange)="nome.set($event)" />
        <app-text-field label="E-mail" type="email" [value]="email()" (valueChange)="email.set($event)" />
        @if (emailMudou()) {
          <app-text-field label="Senha atual" type="password" [value]="senhaConfirmacao()" (valueChange)="senhaConfirmacao.set($event)" />
        } @else {
          <p class="flex items-center gap-1.5 rounded-field bg-primary/10 px-2.5 py-2 text-[12px] text-primary">
            <ng-icon name="lucideLock" size="14" /> Trocar o e-mail pede a senha atual
          </p>
        }
        @if (erroDados()) { <p class="text-[13px] text-danger">{{ erroDados() }}</p> }
        @if (salvoDados()) { <p class="text-[13px] text-ok">Dados atualizados.</p> }
        <app-button (click)="salvarDados()" [disabled]="salvandoDados()">Salvar alterações</app-button>
      </div>
    </app-card>

    <p class="mb-2 mt-6 text-[13px] text-muted">Alterar senha</p>
    <app-card>
      <div class="flex flex-col gap-4">
        <app-text-field label="Senha atual" type="password" [value]="senhaAtual()" (valueChange)="senhaAtual.set($event)" />
        <app-text-field label="Nova senha" type="password" [value]="novaSenha()" (valueChange)="novaSenha.set($event)" />
        <app-text-field label="Confirmar nova senha" type="password" [value]="confirmarNova()" (valueChange)="confirmarNova.set($event)" />
        @if (erroSenha()) { <p class="text-[13px] text-danger">{{ erroSenha() }}</p> }
        @if (okSenha()) { <p class="text-[13px] text-ok">Senha alterada.</p> }
        <app-button variant="ghost" (click)="alterarSenha()" [disabled]="salvandoSenha()">Atualizar senha</app-button>
      </div>
    </app-card>

    <button type="button" (click)="sair()"
      class="mt-6 flex min-h-[44px] w-full items-center justify-center gap-2 text-[14px] font-medium text-danger">
      <ng-icon name="lucideLogOut" size="16" /> Sair da conta
    </button>`,
})
export class Perfil {
  private usuarioService = inject(UsuarioService);
  private auth = inject(AuthService);

  nome = signal('');
  email = signal('');
  private emailOriginal = signal('');
  senhaConfirmacao = signal('');
  fotoUrl = signal<string | null>(null);

  erroDados = signal<string | null>(null);
  salvoDados = signal(false);
  salvandoDados = signal(false);

  senhaAtual = signal('');
  novaSenha = signal('');
  confirmarNova = signal('');
  erroSenha = signal<string | null>(null);
  okSenha = signal(false);
  salvandoSenha = signal(false);

  enviandoFoto = signal(false);
  erroFoto = signal<string | null>(null);

  emailMudou = computed(() =>
    this.email().trim().toLowerCase() !== this.emailOriginal().trim().toLowerCase());

  constructor() { this.carregar(); }

  private carregar(): void {
    this.usuarioService.me().subscribe({
      next: (u) => {
        this.nome.set(u.nome);
        this.email.set(u.email);
        this.emailOriginal.set(u.email);
        this.fotoUrl.set(u.fotoUrl);
      },
      error: (e) => this.erroDados.set(e?.mensagem ?? 'Falha ao carregar o perfil.'),
    });
  }

  onArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;

    const erro = validarImagem(file);
    if (erro) { this.erroFoto.set(erro); return; }

    this.erroFoto.set(null);
    this.enviandoFoto.set(true);
    this.usuarioService.enviarFoto(file).subscribe({
      next: (r) => { this.fotoUrl.set(r.fotoUrl); this.enviandoFoto.set(false); },
      error: (e) => { this.erroFoto.set(e?.mensagem ?? 'Falha ao enviar a foto.'); this.enviandoFoto.set(false); },
    });
  }

  salvarDados(): void {
    const nome = this.nome().trim();
    const email = this.email().trim();
    if (!nome || !email) { this.erroDados.set('Preencha nome e e-mail.'); return; }
    if (this.emailMudou() && !this.senhaConfirmacao()) {
      this.erroDados.set('Informe a senha atual para trocar o e-mail.');
      return;
    }

    this.erroDados.set(null);
    this.salvoDados.set(false);
    this.salvandoDados.set(true);
    const senhaAtual = this.emailMudou() ? this.senhaConfirmacao() : null;
    this.usuarioService.atualizarDados({ nome, email, senhaAtual }).subscribe({
      next: (r) => {
        this.salvandoDados.set(false);
        this.salvoDados.set(true);
        this.emailOriginal.set(r.usuario.email);
        this.senhaConfirmacao.set('');
        if (r.token) this.auth.aplicarToken(r.token);
      },
      error: (e) => { this.salvandoDados.set(false); this.erroDados.set(e?.mensagem ?? 'Falha ao salvar.'); },
    });
  }

  alterarSenha(): void {
    if (!this.senhaAtual() || !this.novaSenha()) { this.erroSenha.set('Preencha os campos.'); return; }
    if (this.novaSenha() !== this.confirmarNova()) { this.erroSenha.set('As senhas não coincidem.'); return; }

    this.erroSenha.set(null);
    this.okSenha.set(false);
    this.salvandoSenha.set(true);
    this.usuarioService.alterarSenha({ senhaAtual: this.senhaAtual(), novaSenha: this.novaSenha() }).subscribe({
      next: () => {
        this.salvandoSenha.set(false);
        this.okSenha.set(true);
        this.senhaAtual.set('');
        this.novaSenha.set('');
        this.confirmarNova.set('');
      },
      error: (e) => { this.salvandoSenha.set(false); this.erroSenha.set(e?.mensagem ?? 'Falha ao alterar a senha.'); },
    });
  }

  sair(): void { this.auth.logout(); location.href = '/login'; }
}
