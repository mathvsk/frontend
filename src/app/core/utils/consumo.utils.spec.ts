import { describe, it, expect } from 'vitest';
import { calcularFolga, statusMes, mediaHistorico, mesAnterior, buscarHistorico } from './consumo.utils';

describe('consumo.utils', () => {
  it('folga = limite - previsto', () => {
    expect(calcularFolga(320, 250)).toBe(70);
  });
  it('status do mês: ok, acima, atual', () => {
    expect(statusMes(298, 320, false)).toBe('ok');
    expect(statusMes(388, 380, false)).toBe('acima');
    expect(statusMes(292, 320, true)).toBe('atual');
  });
  it('mediaHistorico: vazio retorna zero', () => {
    expect(mediaHistorico([])).toEqual({ kwh: 0, valor: 0 });
  });
  it('mediaHistorico: média de kWh e valor', () => {
    expect(mediaHistorico([
      { consumoKwh: 200, custoEstimado: 180 },
      { consumoKwh: 300, custoEstimado: 260 },
    ])).toEqual({ kwh: 250, valor: 220 });
  });

  it('mesAnterior: decrementa o mês', () => {
    expect(mesAnterior(5, 2026)).toEqual({ mes: 4, ano: 2026 });
  });
  it('mesAnterior: vira o ano em janeiro', () => {
    expect(mesAnterior(1, 2026)).toEqual({ mes: 12, ano: 2025 });
  });
  it('buscarHistorico: encontra por mês/ano', () => {
    const h = [{ mes: 4, ano: 2026, consumoKwh: 200, custoEstimado: 180 }];
    expect(buscarHistorico(h, 4, 2026)).toBe(h[0]);
  });
  it('buscarHistorico: undefined quando não há', () => {
    expect(buscarHistorico([{ mes: 4, ano: 2026, consumoKwh: 1, custoEstimado: 1 }], 3, 2026)).toBeUndefined();
  });
});
