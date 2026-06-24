export function calcularFolga(limiteKwh: number, previsto: number): number {
  return limiteKwh - previsto;
}

export type StatusMes = 'ok' | 'acima' | 'atual';
export function statusMes(consumo: number, meta: number, ehMesAtual: boolean): StatusMes {
  if (ehMesAtual) return 'atual';
  return consumo <= meta ? 'ok' : 'acima';
}

export function mediaHistorico(
  historico: { consumoKwh: number; custoEstimado: number }[],
): { kwh: number; valor: number } {
  if (historico.length === 0) return { kwh: 0, valor: 0 };
  const kwh = historico.reduce((s, h) => s + h.consumoKwh, 0) / historico.length;
  const valor = historico.reduce((s, h) => s + h.custoEstimado, 0) / historico.length;
  return { kwh, valor };
}
