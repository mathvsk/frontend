import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, retry, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, Perfil } from '../models/api.models';
import { decodeJwt } from './jwt';

const TOKEN_KEY = 'ecowatt_token';
interface UsuarioAtual { id: number; email: string; perfil: Perfil; }

// Render free tier derruba o backend após inatividade; essas respostas indicam
// que ele ainda está "acordando", não um erro real — vale tentar de novo.
// 429 aqui não é rate limit do backend: é o próprio edge do Render recusando
// pings de wake-up repetidos enquanto o serviço hiberna
// (header X-Render-Routing: hibernate-rate-limited).
// Poucas tentativas bem espaçadas: martelar o edge com pings frequentes
// alimenta o próprio hibernate-rate-limited (a janela de bloqueio parece
// reiniciar a cada tentativa), então o espaçamento é o que dá chance do
// Render terminar de religar o container.
const STATUS_COLD_START = [0, 429, 502, 503, 504];
const TENTATIVAS_COLD_START = 3;

function retryColdStart<T>(onTentativa?: (tentativa: number) => void) {
  return retry<T>({
    count: TENTATIVAS_COLD_START,
    delay: (erro: { status?: number }, tentativa) => {
      if (!STATUS_COLD_START.includes(erro?.status ?? -1)) throw erro;
      onTentativa?.(tentativa);
      return timer(tentativa * 20000);
    },
  });
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  readonly usuarioAtual = signal<UsuarioAtual | null>(this.fromStorage());
  readonly isAdmin = computed(() => this.usuarioAtual()?.perfil === 'Administrador');

  get token(): string | null { return localStorage.getItem(TOKEN_KEY); }

  async login(email: string, senha: string, onTentativa?: (tentativa: number) => void): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.base}/auth/login`, { email, senha })
        .pipe(retryColdStart<LoginResponse>(onTentativa)));
    localStorage.setItem(TOKEN_KEY, res.token);
    this.usuarioAtual.set(this.fromStorage());
  }

  async register(nome: string, email: string, senha: string, onTentativa?: (tentativa: number) => void): Promise<void> {
    await firstValueFrom(
      this.http.post(`${this.base}/auth/register`, { nome, email, senha })
        .pipe(retryColdStart(onTentativa)));
  }

  aplicarToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.usuarioAtual.set(this.fromStorage());
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.usuarioAtual.set(null);
  }

  private fromStorage(): UsuarioAtual | null {
    const t = localStorage.getItem(TOKEN_KEY);
    const c = t ? decodeJwt(t) : null;
    if (!c) return null;
    return { id: Number(c.sub), email: c.email, perfil: (c.role as Perfil) ?? 'Usuario' };
  }
}
