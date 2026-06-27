import { describe, it, expect } from 'vitest';
import { validarImagem } from './arquivo-imagem';

function arquivo(tipo: string, tamanho = 1024): File {
  const f = new File([new Uint8Array(1)], 'avatar', { type: tipo });
  Object.defineProperty(f, 'size', { value: tamanho });
  return f;
}

describe('validarImagem', () => {
  it('aceita JPEG, PNG e WebP', () => {
    expect(validarImagem(arquivo('image/jpeg'))).toBeNull();
    expect(validarImagem(arquivo('image/png'))).toBeNull();
    expect(validarImagem(arquivo('image/webp'))).toBeNull();
  });
  it('recusa tipo não suportado', () => {
    expect(validarImagem(arquivo('image/gif'))).toMatch(/JPEG/);
  });
  it('recusa arquivo acima de 2 MB', () => {
    expect(validarImagem(arquivo('image/png', 3 * 1024 * 1024))).toMatch(/2 MB/);
  });
  it('aceita exatamente no limite de 2 MB', () => {
    expect(validarImagem(arquivo('image/png', 2 * 1024 * 1024))).toBeNull();
  });
});
