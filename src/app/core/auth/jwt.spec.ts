import { describe, it, expect } from 'vitest';
import { decodeJwt } from './jwt';

describe('decodeJwt', () => {
  it('extrai sub, email e role do payload', () => {
    const payload = { sub: '7', email: 'a@b.com', role: 'Administrador' };
    const token = `x.${btoa(JSON.stringify(payload))}.y`;
    const claims = decodeJwt(token);
    expect(claims?.sub).toBe('7');
    expect(claims?.email).toBe('a@b.com');
    expect(claims?.role).toBe('Administrador');
  });

  it('retorna null para token malformado', () => {
    expect(decodeJwt('invalido')).toBeNull();
  });
});
