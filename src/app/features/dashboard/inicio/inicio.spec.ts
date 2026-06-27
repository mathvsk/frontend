import { describe, it, expect } from 'vitest';
import { formatarTooltip } from './inicio';

describe('formatarTooltip', () => {
  it('mostra kWh com a unidade e arredondado', () => {
    expect(formatarTooltip('kwh', 382.33)).toBe('382 kWh');
  });
  it('mostra valor monetário com R$ e duas casas', () => {
    expect(formatarTooltip('valor', 404.31)).toBe('R$ 404.31');
  });
  it('completa as casas decimais do valor', () => {
    expect(formatarTooltip('valor', 350)).toBe('R$ 350.00');
  });
});
