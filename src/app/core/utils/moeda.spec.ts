import { describe, it, expect } from 'vitest';
import { digitosParaValor, formatarMoedaBR } from './moeda';

describe('digitosParaValor', () => {
  it('trata os dígitos como centavos (preenche da direita)', () => {
    expect(digitosParaValor('3')).toBe(0.03);
    expect(digitosParaValor('35')).toBe(0.35);
    expect(digitosParaValor('350')).toBe(3.5);
    expect(digitosParaValor('35012')).toBe(350.12);
  });
  it('ignora caracteres não numéricos da máscara', () => {
    expect(digitosParaValor('R$ 1.234,56')).toBe(1234.56);
  });
  it('retorna null quando não há dígitos', () => {
    expect(digitosParaValor('')).toBeNull();
    expect(digitosParaValor('R$ ')).toBeNull();
  });
});

describe('formatarMoedaBR', () => {
  it('formata em BRL com separadores pt-BR', () => {
    expect(formatarMoedaBR(350.12)).toBe('R$ 350,12');
    expect(formatarMoedaBR(1234.5)).toBe('R$ 1.234,50');
    expect(formatarMoedaBR(0)).toBe('R$ 0,00');
  });
});
