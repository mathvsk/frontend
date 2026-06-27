import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, Perfil } from '../models/api.models';
import { decodeJwt } from './jwt';

const TOKEN_KEY = 'ecowatt_token';
interface UsuarioAtual { id: number; email: string; perfil: Perfil; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  readonly usuarioAtual = signal<UsuarioAtual | null>(this.fromStorage());
  readonly isAdmin = computed(() => this.usuarioAtual()?.perfil === 'Administrador');

  get token(): string | null { return localStorage.getItem(TOKEN_KEY); }

  async login(email: string, senha: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<LoginResponse>(`${this.base}/auth/login`, { email, senha }));
    localStorage.setItem(TOKEN_KEY, res.token);
    this.usuarioAtual.set(this.fromStorage());
  }

  async register(nome: string, email: string, senha: string): Promise<void> {
    await firstValueFrom(this.http.post(`${this.base}/auth/register`, { nome, email, senha }));
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
