export function projetarConsumo(consumoAcumulado: number, diaAtual: number, diasNoMes: number): number {
  if (diaAtual <= 0) return 0;
  return (consumoAcumulado / diaAtual) * diasNoMes;
}

export function calcularFolga(limiteKwh: number, projecao: number): number {
  return limiteKwh - projecao;
}

export type StatusMes = 'ok' | 'acima' | 'atual';
export function statusMes(consumo: number, meta: number, ehMesAtual: boolean): StatusMes {
  if (ehMesAtual) return 'atual';
  return consumo <= meta ? 'ok' : 'acima';
}
