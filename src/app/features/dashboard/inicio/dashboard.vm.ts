import { Dashboard } from '../../../core/models/api.models';
import { calcularFolga, mediaHistorico, mesAnterior, buscarHistorico } from '../../../core/utils/consumo.utils';

export interface DashboardVm {
  previstoKwh: number; previstoValor: number; ehReal: boolean;
  percentualConsumido: number; folga: number; temMeta: boolean; noControle: boolean;
  mediaRegionalKwh: number; diferencaMedia: number;
  temMesPassado: boolean; mesPassadoKwh: number; mesPassadoValor: number; deltaMesPassadoPct: number;
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

  const ant = mesAnterior(mesAtual, anoAtual);
  const passado = buscarHistorico(d.historico, ant.mes, ant.ano);
  const temMesPassado = !!passado;
  const mesPassadoKwh = passado?.consumoKwh ?? 0;
  const mesPassadoValor = passado?.custoEstimado ?? 0;
  const deltaMesPassadoPct = temMesPassado && mesPassadoKwh > 0
    ? ((previstoKwh - mesPassadoKwh) / mesPassadoKwh) * 100
    : 0;

  return {
    previstoKwh, previstoValor, ehReal: temReal,
    percentualConsumido: temMeta ? previstoKwh / limiteKwh : 0,
    folga, temMeta, noControle: folga >= 0,
    mediaRegionalKwh, diferencaMedia: Math.round(mediaRegionalKwh - previstoKwh),
    temMesPassado, mesPassadoKwh, mesPassadoValor, deltaMesPassadoPct,
  };
}
