/** Converte o texto digitado (com ou sem máscara) no valor numérico cru, tratando os dígitos como centavos. */
export function digitosParaValor(texto: string): number | null {
  const digitos = (texto ?? '').replace(/\D/g, '');
  if (digitos === '') return null;
  return Number(digitos) / 100;
}

/** Formata um valor numérico como moeda BRL para exibição (ex.: 1234.5 -> "R$ 1.234,50"). */
export function formatarMoedaBR(valor: number): string {
  const formatado = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
  return `R$ ${formatado}`;
}
