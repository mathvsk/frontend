import { HistoricoItem } from '../models/api.models';

export interface Variacao {
  deltaKwh: number;
  deltaValor: number;
}

/**
 * Calcula a variação de consumo e valor de cada leitura em relação à leitura do mês anterior
 * (ordem cronológica). A leitura mais antiga não tem anterior e fica de fora do mapa.
 */
export function calcularVariacoes(historico: HistoricoItem[]): Map<number, Variacao> {
  const ordenado = [...historico].sort((a, b) => a.ano - b.ano || a.mes - b.mes);
  const variacoes = new Map<number, Variacao>();
  for (let i = 1; i < ordenado.length; i++) {
    const atual = ordenado[i];
    const anterior = ordenado[i - 1];
    variacoes.set(atual.id, {
      deltaKwh: atual.consumoKwh - anterior.consumoKwh,
      deltaValor: atual.custoEstimado - anterior.custoEstimado,
    });
  }
  return variacoes;
}
