import { describe, it, expect } from 'vitest';
import { montarDashboardVm } from './dashboard.vm';

describe('montarDashboardVm', () => {
  it('usa o real quando há leitura do mês atual', () => {
    const vm = montarDashboardVm(
      { consumoMesKwh: 214, custoMesEstimado: 200, historico: [
        { id: 1, mes: 5, ano: 2026, consumoKwh: 214, custoEstimado: 200 },
      ] }, 320, 342, 5, 2026);
    expect(vm.ehReal).toBe(true);
    expect(vm.previstoKwh).toBe(214);
    expect(vm.previstoValor).toBe(200);
    expect(vm.temMeta).toBe(true);
    expect(vm.folga).toBe(106);
  });

  it('prevê pela média do histórico quando não há mês atual', () => {
    const vm = montarDashboardVm(
      { consumoMesKwh: 0, custoMesEstimado: 0, historico: [
        { id: 1, mes: 3, ano: 2026, consumoKwh: 200, custoEstimado: 180 },
        { id: 2, mes: 4, ano: 2026, consumoKwh: 300, custoEstimado: 260 },
      ] }, 0, 0, 5, 2026);
    expect(vm.ehReal).toBe(false);
    expect(vm.previstoKwh).toBe(250);
    expect(vm.previstoValor).toBe(220);
    expect(vm.temMeta).toBe(false);
  });

  it('expõe o mês passado e o delta quando há histórico do mês anterior', () => {
    const vm = montarDashboardVm(
      { consumoMesKwh: 214, custoMesEstimado: 200, historico: [
        { id: 1, mes: 4, ano: 2026, consumoKwh: 200, custoEstimado: 180 },
        { id: 2, mes: 5, ano: 2026, consumoKwh: 214, custoEstimado: 200 },
      ] }, 320, 342, 5, 2026);
    expect(vm.temMesPassado).toBe(true);
    expect(vm.mesPassadoKwh).toBe(200);
    expect(vm.mesPassadoValor).toBe(180);
    expect(vm.deltaMesPassadoPct).toBeCloseTo(7, 5); // (214-200)/200*100
  });

  it('sem mês anterior, temMesPassado é falso', () => {
    const vm = montarDashboardVm(
      { consumoMesKwh: 214, custoMesEstimado: 200, historico: [
        { id: 1, mes: 5, ano: 2026, consumoKwh: 214, custoEstimado: 200 },
      ] }, 320, 342, 5, 2026);
    expect(vm.temMesPassado).toBe(false);
    expect(vm.mesPassadoKwh).toBe(0);
    expect(vm.deltaMesPassadoPct).toBe(0);
  });

  it('acha o mês passado na virada de ano (jan -> dez do ano anterior)', () => {
    const vm = montarDashboardVm(
      { consumoMesKwh: 0, custoMesEstimado: 0, historico: [
        { id: 1, mes: 12, ano: 2025, consumoKwh: 300, custoEstimado: 260 },
      ] }, 0, 0, 1, 2026);
    expect(vm.temMesPassado).toBe(true);
    expect(vm.mesPassadoKwh).toBe(300);
  });
});
