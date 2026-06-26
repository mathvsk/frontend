import { Dashboard } from '../../../core/models/api.models';

const MESES = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export interface DashboardVm {
  previsaoKwh: number;
  previsaoValor: number;
  previsaoLabel: string;
  temConsumoAtual: boolean;
  consumoAtualKwh: number;
  consumoAtualValor: number;
  consumoAtualLabel: string;
  temHistorico: boolean;
}

export function montarDashboardVm(d: Dashboard): DashboardVm {
  return {
    previsaoKwh: d.previsaoProximoMesKwh,
    previsaoValor: d.previsaoProximoMesValor,
    previsaoLabel: d.previsaoMes > 0 ? `${MESES[d.previsaoMes]}/${d.previsaoAno}` : '',
    temConsumoAtual: d.temConsumoAtual,
    consumoAtualKwh: d.consumoAtualKwh,
    consumoAtualValor: d.consumoAtualValor,
    consumoAtualLabel: d.temConsumoAtual ? `${MESES[d.consumoAtualMes]}/${d.consumoAtualAno}` : '',
    temHistorico: d.historico.length > 0,
  };
}
