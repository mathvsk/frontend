import { describe, it, expect } from 'vitest';
import { calcularFolga, statusMes, mediaHistorico } from './consumo.utils';

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
});
