function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** Valor "AAAA-MM" do mês corrente (formato do <input type="month">). */
export function mesAnoAtual(referencia: Date = new Date()): string {
  return `${referencia.getFullYear()}-${pad2(referencia.getMonth() + 1)}`;
}

/** Monta o valor "AAAA-MM" a partir de mês (1-12) e ano. */
export function mesAnoParaInput(mes: number, ano: number): string {
  return `${ano}-${pad2(mes)}`;
}

/** Deriva { mes, ano } de um valor "AAAA-MM"; null se inválido ou vazio. */
export function mesAnoDeInput(valor: string): { mes: number; ano: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(valor ?? '');
  if (!m) return null;
  const ano = Number(m[1]);
  const mes = Number(m[2]);
  if (mes < 1 || mes > 12) return null;
  return { mes, ano };
}
