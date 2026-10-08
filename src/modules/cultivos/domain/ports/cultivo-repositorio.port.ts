import { Cultivo, type CultivoProps } from '../entities/cultivo.entity.js';

export const CULTIVO_REPOSITORIO_PORT = Symbol('CULTIVO_REPOSITORIO_PORT');

/**
 * @description Puerto del repositorio de persistencia de Cultivos.
 */
export interface ICultivoRepositorio {
  listarActivos(): Promise<Cultivo[]>;
  buscarPorId(id: string): Promise<Cultivo | null>;
  buscarPorNombre(nombre: string): Promise<Cultivo | null>;
  crear(cultivo: Cultivo): Promise<Cultivo>;
  actualizar(id: string, datos: Partial<CultivoProps>): Promise<Cultivo>;
  eliminar(id: string): Promise<void>;
  tieneParcelasAsociadas(id: string): Promise<boolean>;
}
