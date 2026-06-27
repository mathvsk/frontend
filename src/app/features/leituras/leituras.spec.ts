import { describe, it, expect } from 'vitest';
import { formatarRefMesAno } from './leituras';

describe('formatarRefMesAno', () => {
  it('formata mês e ano como MM/AA', () => {
    expect(formatarRefMesAno(6, 2026)).toBe('06/26');
  });
  it('preserva dois dígitos do mês', () => {
    expect(formatarRefMesAno(12, 2025)).toBe('12/25');
  });
  it('usa os dois últimos dígitos do ano', () => {
    expect(formatarRefMesAno(1, 2030)).toBe('01/30');
  });
});
