import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Login } from './login';

describe('Login', () => {
  const auth = { login: vi.fn().mockResolvedValue(undefined) };
  const router = { navigate: vi.fn() };
  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: auth }, { provide: Router, useValue: router }],
    });
  });

  it('chama auth.login e navega para a raiz no sucesso', async () => {
    const cmp = TestBed.createComponent(Login).componentInstance;
    cmp.email.set('a@b.com'); cmp.senha.set('Senha@123');
    await cmp.entrar();
    expect(auth.login).toHaveBeenCalledWith('a@b.com', 'Senha@123');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('exibe erro quando login falha', async () => {
    auth.login.mockRejectedValueOnce({ mensagem: 'Credenciais inválidas.' });
    const cmp = TestBed.createComponent(Login).componentInstance;
    cmp.email.set('a@b.com'); cmp.senha.set('errada');
    await cmp.entrar();
    expect(cmp.erro()).toBe('Credenciais inválidas.');
  });
});
