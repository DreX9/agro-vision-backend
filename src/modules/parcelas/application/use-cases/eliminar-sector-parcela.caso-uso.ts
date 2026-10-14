import { Injectable, Inject } from '@nestjs/common';
import {
  SECTOR_PARCELA_REPOSITORIO_PORT,
  type ISectorParcelaRepositorio,
} from '../../domain/ports/sector-parcela-repositorio.port.js';
import { SectorNoEncontradoError } from '../../domain/errors/parcela.errors.js';

@Injectable()
export class EliminarSectorParcelaCasoUso {
  constructor(
    @Inject(SECTOR_PARCELA_REPOSITORIO_PORT)
    private readonly sectorRepositorio: ISectorParcelaRepositorio,
  ) {}

  async ejecutar(parcelaId: string, sectorId: string): Promise<boolean> {
    const sector = await this.sectorRepositorio.buscarPorId(sectorId);
    if (!sector || sector.parcelaId !== parcelaId) {
      throw new SectorNoEncontradoError(sectorId);
    }

    return this.sectorRepositorio.eliminar(sectorId);
  }
}
