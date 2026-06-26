import { describe, it, expect } from 'vitest';
import { montarDashboardVm } from './dashboard.vm';
import { Dashboard } from '../../../core/models/api.models';

const base: Dashboard = {
  previsaoProximoMesKwh: 382.33, previsaoProximoMesValor: 368.1,
  previsaoMes: 7, previsaoAno: 2026,
  temConsumoAtual: true, consumoAtualKwh: 411, consumoAtualValor: 404.31,
  consumoAtualMes: 6, consumoAtualAno: 2026,
  historico: [{ id: 1, mes: 6, ano: 2026, consumoKwh: 411, custoEstimado: 404.31 }],
};

describe('montarDashboardVm', () => {
  it('mapeia previsão e rótulo do próximo mês', () => {
    const vm = montarDashboardVm(base);
    expect(vm.previsaoKwh).toBe(382.33);
    expect(vm.previsaoValor).toBe(368.1);
    expect(vm.previsaoLabel).toBe('Jul/2026');
  });
  it('mapeia consumo atual e rótulo', () => {
    const vm = montarDashboardVm(base);
    expect(vm.temConsumoAtual).toBe(true);
    expect(vm.consumoAtualKwh).toBe(411);
    expect(vm.consumoAtualLabel).toBe('Jun/2026');
    expect(vm.temHistorico).toBe(true);
  });
  it('estado vazio sem leituras', () => {
    const vm = montarDashboardVm({
      previsaoProximoMesKwh: 0, previsaoProximoMesValor: 0, previsaoMes: 0, previsaoAno: 0,
      temConsumoAtual: false, consumoAtualKwh: 0, consumoAtualValor: 0, consumoAtualMes: 0, consumoAtualAno: 0,
      historico: [],
    });
    expect(vm.previsaoLabel).toBe('');
    expect(vm.temConsumoAtual).toBe(false);
    expect(vm.temHistorico).toBe(false);
  });
});
