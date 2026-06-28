import { describe, it, expect } from 'vitest';
import { calcularVariacoes } from './variacao';
import { HistoricoItem } from '../models/api.models';

const item = (id: number, mes: number, ano: number, consumoKwh: number, custoEstimado: number): HistoricoItem =>
  ({ id, mes, ano, consumoKwh, custoEstimado });

describe('calcularVariacoes', () => {
  it('a leitura mais antiga não tem variação', () => {
    const v = calcularVariacoes([item(1, 4, 2026, 370, 346.76)]);
    expect(v.has(1)).toBe(false);
  });

  it('compara cada leitura com a do mês anterior (cronológico)', () => {
    const v = calcularVariacoes([
      item(1, 4, 2026, 370, 346.76),
      item(2, 5, 2026, 366, 353.91),
      item(3, 6, 2026, 411, 404.31),
    ]);
    expect(v.get(2)).toEqual({ deltaKwh: -4, deltaValor: expect.closeTo(7.15, 2) });
    expect(v.get(3)).toEqual({ deltaKwh: 45, deltaValor: expect.closeTo(50.4, 2) });
  });

  it('ordena por ano/mês antes de comparar, independente da ordem de entrada', () => {
    const v = calcularVariacoes([
      item(3, 6, 2026, 411, 404.31),
      item(1, 4, 2026, 370, 346.76),
      item(2, 5, 2026, 366, 353.91),
    ]);
    expect(v.get(2)!.deltaKwh).toBe(-4);
    expect(v.get(3)!.deltaKwh).toBe(45);
  });

  it('considera a virada de ano', () => {
    const v = calcularVariacoes([
      item(1, 12, 2025, 300, 280),
      item(2, 1, 2026, 320, 300),
    ]);
    expect(v.get(2)!.deltaKwh).toBe(20);
  });
});
