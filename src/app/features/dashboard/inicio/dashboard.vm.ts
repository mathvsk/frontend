import { Dashboard } from '../../../core/models/api.models';
import { projetarConsumo, calcularFolga } from '../../../core/utils/consumo.utils';

export interface DashboardVm {
  consumoMesKwh: number;
  projecao: number;
  percentualConsumido: number;
  folga: number;
  noControle: boolean;
  mediaRegionalKwh: number;
  diferencaMedia: number;
}

export function montarDashboardVm(
  d: Dashboard,
  limiteKwh: number,
  mediaRegionalKwh: number,
  diaAtual: number,
  diasNoMes: number
): DashboardVm {
  const projecao = projetarConsumo(d.consumoMesKwh, diaAtual, diasNoMes);
  const folga = calcularFolga(limiteKwh, projecao);
  return {
    consumoMesKwh: d.consumoMesKwh,
    projecao,
    percentualConsumido: limiteKwh > 0 ? d.consumoMesKwh / limiteKwh : 0,
    folga,
    noControle: folga >= 0,
    mediaRegionalKwh,
    diferencaMedia: Math.round(mediaRegionalKwh - projecao),
  };
}
