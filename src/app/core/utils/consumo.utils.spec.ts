import { describe, it, expect } from 'vitest';
import { projetarConsumo, calcularFolga, statusMes } from './consumo.utils';

describe('consumo.utils', () => {
  it('projeta consumo proporcional aos dias', () => {
    expect(projetarConsumo(120, 10, 30)).toBe(360);
  });
  it('projeta zero quando diaAtual <= 0', () => {
    expect(projetarConsumo(120, 0, 30)).toBe(0);
  });
  it('folga = limite - projecao', () => {
    expect(calcularFolga(320, 292)).toBe(28);
  });
  it('status do mês: ok, acima, atual', () => {
    expect(statusMes(298, 320, false)).toBe('ok');
    expect(statusMes(388, 380, false)).toBe('acima');
    expect(statusMes(292, 320, true)).toBe('atual');
  });
});
