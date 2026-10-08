import { Insumo } from '../entities/insumo.entity.js';

export const INSUMO_REPOSITORIO_PORT = Symbol('INSUMO_REPOSITORIO_PORT');

/**
 * @description Puerto del repositorio de persistencia para insumos y recursos agrícolas.
 */
export interface IInsumoRepositorio {
  listarActivos(categoria?: string): Promise<Insumo[]>;
  buscarPorId(id: string): Promise<Insumo | null>;
  buscarPorCodigo(codigo: string): Promise<Insumo | null>;
  crear(insumo: Insumo): Promise<Insumo>;
}
