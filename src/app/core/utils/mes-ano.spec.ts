import { describe, it, expect } from 'vitest';
import { mesAnoAtual, mesAnoParaInput, mesAnoDeInput } from './mes-ano';

describe('mesAnoParaInput', () => {
  it('monta AAAA-MM com mês de dois dígitos', () => {
    expect(mesAnoParaInput(5, 2026)).toBe('2026-05');
    expect(mesAnoParaInput(12, 2025)).toBe('2025-12');
  });
});

describe('mesAnoDeInput', () => {
  it('deriva mês e ano de AAAA-MM', () => {
    expect(mesAnoDeInput('2026-05')).toEqual({ mes: 5, ano: 2026 });
  });
  it('rejeita vazio e formato inválido', () => {
    expect(mesAnoDeInput('')).toBeNull();
    expect(mesAnoDeInput('2026/05')).toBeNull();
    expect(mesAnoDeInput('2026-13')).toBeNull();
  });
});

describe('mesAnoAtual', () => {
  it('formata o mês de referência informado como AAAA-MM', () => {
    expect(mesAnoAtual(new Date(2026, 0, 15))).toBe('2026-01');
    expect(mesAnoAtual(new Date(2026, 11, 1))).toBe('2026-12');
  });
});
