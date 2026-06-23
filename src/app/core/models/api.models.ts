export type Perfil = 'Usuario' | 'Administrador';
export type OrigemLeitura = 'Manual' | 'Fatura';
export type TipoAlerta = 'AproximacaoLimite' | 'LimiteUltrapassado';

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

export interface HistoricoItem { id: number; mes: number; ano: number; consumoKwh: number; custoEstimado: number; limiteKwh?: number | null; }
export interface Dashboard { consumoMesKwh: number; custoMesEstimado: number; historico: HistoricoItem[]; }

export interface DefinirMeta {
  mesReferencia: number; anoReferencia: number; limiteKwh: number; percentualAlerta: number;
}
export interface Meta { id: number; limiteKwh: number; mediaRegionalKwh: number; }
export interface MediaRegional { mediaKwh: number; }

export interface Alerta { id: number; tipo: TipoAlerta; mensagem: string; lido: boolean; }

export interface Dica { id: number; titulo: string; conteudo: string; categoria: string; }
export interface DicaRequest { titulo: string; conteudo: string; categoria: string; }
