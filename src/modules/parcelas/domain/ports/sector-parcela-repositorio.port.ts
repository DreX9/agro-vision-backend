import { SectorParcela } from '../entities/sector-parcela.entity.js';

export const SECTOR_PARCELA_REPOSITORIO_PORT = Symbol('SECTOR_PARCELA_REPOSITORIO_PORT');

/**
 * @description Puerto del repositorio de persistencia para Sectores de Parcela / Áreas de Cultivo.
 */
export interface ISectorParcelaRepositorio {
  listarPorParcela(parcelaId: string): Promise<SectorParcela[]>;
  buscarPorId(id: string): Promise<SectorParcela | null>;
  crear(sector: SectorParcela): Promise<SectorParcela>;
  actualizar(sector: SectorParcela): Promise<SectorParcela | null>;
  eliminar(id: string): Promise<boolean>;
  obtenerSiguienteCorrelativo(parcelaId: string, parcelaCodigo: string): Promise<string>;
  sumarAreaAsignada(parcelaId: string, excluirSectorId?: string): Promise<number>;
}
