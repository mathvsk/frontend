export type Perfil = 'Usuario' | 'Administrador';
export type OrigemLeitura = 'Manual' | 'Fatura';

export interface LoginResponse { token: string; expiraEm: string; perfil: Perfil; }

export interface Residencia {
  id: number; apelido: string; bairro: string; cidade: string; numeroMedidor?: string | null;
}
export interface CriarResidencia {
  apelido: string; bairro: string; cidade: string; numeroMedidor?: string | null;
}

export interface RegistrarLeitura {
  mesReferencia: number; anoReferencia: number; origem: OrigemLeitura;
  valorMedidor?: number | null; consumoKwh?: number | null; valorFatura?: number | null;
}
export interface Leitura { id: number; consumoKwh: number; custoEstimado: number; }

export interface HistoricoItem { id: number; mes: number; ano: number; consumoKwh: number; custoEstimado: number; }
export interface Dashboard {
  previsaoProximoMesKwh: number;
  previsaoProximoMesValor: number;
  previsaoMes: number;
  previsaoAno: number;
  temConsumoAtual: boolean;
  consumoAtualKwh: number;
  consumoAtualValor: number;
  consumoAtualMes: number;
  consumoAtualAno: number;
  historico: HistoricoItem[];
}

export interface Dica { id: number; titulo: string; conteudo: string; categoria: string; }
export interface DicaRequest { titulo: string; conteudo: string; categoria: string; }
