import { Dashboard } from '../../../core/models/api.models';
import { calcularFolga, mediaHistorico } from '../../../core/utils/consumo.utils';

export interface DashboardVm {
  previstoKwh: number; previstoValor: number; ehReal: boolean;
  percentualConsumido: number; folga: number; temMeta: boolean; noControle: boolean;
  mediaRegionalKwh: number; diferencaMedia: number;
}

export function montarDashboardVm(
  d: Dashboard, limiteKwh: number, mediaRegionalKwh: number, mesAtual: number, anoAtual: number,
): DashboardVm {
  const temReal = d.consumoMesKwh > 0;
  const media = mediaHistorico(d.historico);
  const previstoKwh = temReal ? d.consumoMesKwh : media.kwh;
  const previstoValor = temReal ? d.custoMesEstimado : media.valor;
  const temMeta = limiteKwh > 0;
  const folga = calcularFolga(limiteKwh, previstoKwh);
  return {
    previstoKwh, previstoValor, ehReal: temReal,
    percentualConsumido: temMeta ? previstoKwh / limiteKwh : 0,
    folga, temMeta, noControle: folga >= 0,
    mediaRegionalKwh, diferencaMedia: Math.round(mediaRegionalKwh - previstoKwh),
  };
}
