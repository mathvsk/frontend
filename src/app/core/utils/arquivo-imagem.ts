const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];
const TAMANHO_MAX_BYTES = 2 * 1024 * 1024;

/** Valida uma imagem de avatar antes do upload. Retorna a mensagem de erro, ou null se válida. */
export function validarImagem(file: File): string | null {
  if (!TIPOS_PERMITIDOS.includes(file.type)) return 'Use uma imagem JPEG, PNG ou WebP.';
  if (file.size > TAMANHO_MAX_BYTES) return 'A imagem deve ter no máximo 2 MB.';
  return null;
}
