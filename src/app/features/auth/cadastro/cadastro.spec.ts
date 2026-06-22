import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { Cadastro } from './cadastro';

describe('Cadastro', () => {
  const auth = { register: vi.fn().mockResolvedValue(undefined), login: vi.fn().mockResolvedValue(undefined) };
  const router = { navigate: vi.fn() };
  beforeEach(() => { vi.clearAllMocks();
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: auth }, { provide: Router, useValue: router }] });
  });

  it('valida senhas diferentes', async () => {
    const cmp = TestBed.createComponent(Cadastro).componentInstance;
    cmp.nome.set('Ana'); cmp.email.set('a@b.com'); cmp.senha.set('123456'); cmp.confirmar.set('999999');
    await cmp.criar();
    expect(cmp.erro()).toBe('As senhas não coincidem.');
    expect(auth.register).not.toHaveBeenCalled();
  });

  it('registra, autentica e navega', async () => {
    const cmp = TestBed.createComponent(Cadastro).componentInstance;
    cmp.nome.set('Ana'); cmp.email.set('a@b.com'); cmp.senha.set('Senha@123'); cmp.confirmar.set('Senha@123');
    await cmp.criar();
    expect(auth.register).toHaveBeenCalledWith('Ana', 'a@b.com', 'Senha@123');
    expect(auth.login).toHaveBeenCalledWith('a@b.com', 'Senha@123');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
