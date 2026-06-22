import { describe, it, expect } from 'vitest';
import { montarDashboardVm } from './dashboard.vm';

describe('montarDashboardVm', () => {
  it('compõe consumo, projeção, %, folga e comparativo', () => {
    const vm = montarDashboardVm({ consumoMesKwh: 214, custoMesEstimado: 200, historico: [] }, 320, 342, 22, 30);
    expect(vm.consumoMesKwh).toBe(214);
    expect(Math.round(vm.projecao)).toBe(292);
    expect(vm.percentualConsumido).toBeCloseTo(0.669, 2);
    expect(Math.round(vm.folga)).toBe(28);
    expect(vm.noControle).toBe(true);
    expect(vm.diferencaMedia).toBe(50);
  });
});
