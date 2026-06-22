import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  let router: Router;
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: { navigate: vi.fn(), createUrlTree: vi.fn(() => 'urltree') } }] });
    router = TestBed.inject(Router);
  });

  it('bloqueia e redireciona sem token', () => {
    const r = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(r).toBe('urltree');
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('permite com token', () => {
    localStorage.setItem('ecowatt_token', 'x');
    const r = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(r).toBe(true);
  });
});
