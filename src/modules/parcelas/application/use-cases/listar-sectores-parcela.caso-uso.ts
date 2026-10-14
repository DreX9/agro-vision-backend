import { Injectable, Inject } from '@nestjs/common';
import {
  PARCELA_REPOSITORIO_PORT,
  type IParcelaRepositorio,
} from '../../domain/ports/parcela-repositorio.port.js';
import {
  SECTOR_PARCELA_REPOSITORIO_PORT,
  type ISectorParcelaRepositorio,
} from '../../domain/ports/sector-parcela-repositorio.port.js';
import { ParcelaNoEncontradaError } from '../../domain/errors/parcela.errors.js';
import { ResumenSectoresParcelaDto } from '../dtos/resumen-sectores-parcela.dto.js';
import { SectorParcelaItemDto } from '../dtos/sector-parcela-item.dto.js';
import { SectorParcela } from '../../domain/entities/sector-parcela.entity.js';

@Injectable()
export class ListarSectoresParcelaCasoUso {
  constructor(
    @Inject(PARCELA_REPOSITORIO_PORT)
    private readonly parcelaRepositorio: IParcelaRepositorio,
    @Inject(SECTOR_PARCELA_REPOSITORIO_PORT)
    private readonly sectorRepositorio: ISectorParcelaRepositorio,
  ) {}

  async ejecutar(parcelaId: string): Promise<ResumenSectoresParcelaDto> {
    const parcela = await this.parcelaRepositorio.buscarPorId(parcelaId);
    if (!parcela) {
      throw new ParcelaNoEncontradaError(parcelaId);
    }

    const sectores = await this.sectorRepositorio.listarPorParcela(parcelaId);

    const areaTotal = Number(parcela.areaHectareas);
    const areaAsignada = sectores.reduce((acc, s) => acc + Number(s.areaHectareas), 0);
    const areaDisponible = Math.max(0, Number((areaTotal - areaAsignada).toFixed(4)));
    const porcentaje = areaTotal > 0 ? Math.min(100, Number(((areaAsignada / areaTotal) * 100).toFixed(2))) : 0;

    return {
      parcelaId: parcela.id,
      parcelaCodigo: parcela.codigo,
      parcelaNombre: parcela.nombre,
      areaTotalHectareas: areaTotal,
      areaAsignadaHectareas: Number(areaAsignada.toFixed(4)),
      areaDisponibleHectareas: areaDisponible,
      porcentajeOcupado: porcentaje,
      delimitacionParcelaGeoJson: parcela.delimitacionGeoJson,
      latitudCentro: parcela.latitudCentro,
      longitudCentro: parcela.longitudCentro,
      sectores: sectores.map((s) => this.mapearDto(s)),
    };
  }

  private mapearDto(s: SectorParcela): SectorParcelaItemDto {
    return {
      id: s.id,
      codigo: s.codigo,
      nombre: s.nombre,
      areaHectareas: s.areaHectareas,
      colorHex: s.colorHex,
      parcelaId: s.parcelaId,
      parcelaCodigo: s.parcelaCodigo,
      parcelaNombre: s.parcelaNombre,
      cultivoId: s.cultivoId,
      cultivoNombre: s.cultivoNombre,
      cultivoColorHex: s.cultivoColorHex,
      variedad: s.variedad,
      delimitacionGeoJson: s.delimitacionGeoJson,
      latitudCentro: s.latitudCentro,
      longitudCentro: s.longitudCentro,
      fechaSiembra: s.fechaSiembra,
      fechaCosechaEstimada: s.fechaCosechaEstimada,
      estado: s.estado,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  }
}
