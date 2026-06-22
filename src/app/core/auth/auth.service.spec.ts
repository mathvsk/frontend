import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [AuthService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  it('login guarda token e popula usuarioAtual', async () => {
    const payload = btoa(JSON.stringify({ sub: '1', email: 'a@b.com', role: 'Usuario' }));
    const p = service.login('a@b.com', 'Senha@123');
    const req = http.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: `x.${payload}.y`, expiraEm: '2026-01-01', perfil: 'Usuario' });
    await p;
    expect(localStorage.getItem('ecowatt_token')).toContain(payload);
    expect(service.usuarioAtual()?.email).toBe('a@b.com');
    expect(service.isAdmin()).toBe(false);
  });

  it('register faz POST em /auth/register', async () => {
    const p = service.register('Ana', 'a@b.com', 'Senha@123');
    const req = http.expectOne('/api/auth/register');
    expect(req.request.body).toEqual({ nome: 'Ana', email: 'a@b.com', senha: 'Senha@123' });
    req.flush({});
    await p;
  });

  it('logout limpa o estado', () => {
    localStorage.setItem('ecowatt_token', 'x');
    service.logout();
    expect(localStorage.getItem('ecowatt_token')).toBeNull();
    expect(service.usuarioAtual()).toBeNull();
  });
});
