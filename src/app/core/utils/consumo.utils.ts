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

export function mesAnterior(mes: number, ano: number): { mes: number; ano: number } {
  return mes === 1 ? { mes: 12, ano: ano - 1 } : { mes: mes - 1, ano };
}

export function buscarHistorico<T extends { mes: number; ano: number }>(
  historico: T[],
  mes: number,
  ano: number,
): T | undefined {
  return historico.find((h) => h.mes === mes && h.ano === ano);
}
