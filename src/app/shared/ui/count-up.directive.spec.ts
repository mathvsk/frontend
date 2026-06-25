import { describe, it, expect } from 'vitest';
import { valorAnimado } from './count-up.directive';

describe('valorAnimado', () => {
  it('progresso 0 retorna o valor inicial', () => {
    expect(valorAnimado(0, 100, 0)).toBe(0);
  });
  it('progresso 1 retorna o valor final', () => {
    expect(valorAnimado(0, 100, 1)).toBe(100);
  });
  it('respeita o valor inicial não-zero', () => {
    expect(valorAnimado(50, 150, 0)).toBe(50);
    expect(valorAnimado(50, 150, 1)).toBe(150);
  });
  it('faz clamp de progresso fora de [0,1]', () => {
    expect(valorAnimado(0, 100, -0.5)).toBe(0);
    expect(valorAnimado(0, 100, 2)).toBe(100);
  });
  it('fica entre início e fim no ponto médio', () => {
    const v = valorAnimado(0, 100, 0.5);
    expect(v).toBeGreaterThan(0);
    expect(v).toBeLessThan(100);
  });
  it('é monotônico crescente ao longo do progresso', () => {
    const pts = [0, 0.2, 0.4, 0.6, 0.8, 1].map((p) => valorAnimado(0, 100, p));
    for (let i = 1; i < pts.length; i++) {
      expect(pts[i]).toBeGreaterThanOrEqual(pts[i - 1]);
    }
  });
});
