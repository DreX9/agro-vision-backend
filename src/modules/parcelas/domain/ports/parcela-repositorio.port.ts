import { Parcela } from '../entities/parcela.entity.js';

export interface FiltrosListarParcelas {
  busqueda?: string;
  cultivoId?: string;
  estado?: string;
  usuarioResponsableId?: string;
  pagina?: number;
  limite?: number;
}

export const PARCELA_REPOSITORIO_PORT = Symbol('PARCELA_REPOSITORIO_PORT');

/**
 * @description Puerto del repositorio de persistencia de Parcelas.
 */
export interface IParcelaRepositorio {
  listar(filtros?: FiltrosListarParcelas): Promise<{ parcelas: Parcela[]; total: number }>;
  buscarPorId(id: string): Promise<Parcela | null>;
  buscarPorCodigo(codigo: string): Promise<Parcela | null>;
  crear(parcela: Parcela): Promise<Parcela>;
  actualizar(parcela: Parcela): Promise<Parcela | null>;
  actualizarEstado(id: string, estado: string): Promise<Parcela | null>;
  eliminar(id: string): Promise<boolean>;
  contarTotal(): Promise<number>;
}
