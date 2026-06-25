import { describe, it, expect } from 'vitest';
import { valorAnimado } from './count-up.directive';

describe('valorAnimado', () => {
  it('progresso 0 retorna o valor inicial', () => {
    expect(valorAnimado(0, 100, 0)).toBe(0);
  });
  it('progresso 1 retorna o valor final', () => {
    expect(valorAnimado(0, 100, 1)).toBe(100);
  });
  it('faz clamp de progresso fora de [0,1]', () => {
    expect(valorAnimado(0, 100, -0.5)).toBe(0);
    expect(valorAnimado(0, 100, 2)).toBe(100);
  });
  it('é monotônico e fica entre início e fim', () => {
    const v = valorAnimado(0, 100, 0.5);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(100);
  });
});
