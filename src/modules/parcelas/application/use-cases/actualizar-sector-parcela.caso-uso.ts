import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';
import {
  PARCELA_REPOSITORIO_PORT,
  type IParcelaRepositorio,
} from '../../domain/ports/parcela-repositorio.port.js';
import {
  SECTOR_PARCELA_REPOSITORIO_PORT,
  type ISectorParcelaRepositorio,
} from '../../domain/ports/sector-parcela-repositorio.port.js';
import {
  SectorNoEncontradoError,
  SectorSuperaAreaDisponibleError,
} from '../../domain/errors/parcela.errors.js';
import { ActualizarSectorParcelaDto } from '../../presentation/dtos/actualizar-sector-parcela.dto.js';
import { SectorParcelaItemDto } from '../dtos/sector-parcela-item.dto.js';
import { SectorParcela } from '../../domain/entities/sector-parcela.entity.js';

@Injectable()
export class ActualizarSectorParcelaCasoUso {
  constructor(
    @Inject(PARCELA_REPOSITORIO_PORT)
    private readonly parcelaRepositorio: IParcelaRepositorio,
    @Inject(SECTOR_PARCELA_REPOSITORIO_PORT)
    private readonly sectorRepositorio: ISectorParcelaRepositorio,
    private readonly prisma: PrismaService,
  ) {}

  async ejecutar(
    parcelaId: string,
    sectorId: string,
    dto: ActualizarSectorParcelaDto,
  ): Promise<SectorParcelaItemDto> {
    const sectorExistente = await this.sectorRepositorio.buscarPorId(sectorId);
    if (!sectorExistente || sectorExistente.parcelaId !== parcelaId) {
      throw new SectorNoEncontradoError(sectorId);
    }

    let cultivoId = sectorExistente.cultivoId;
    let cultivoNombre = sectorExistente.cultivoNombre;
    let cultivoColorHex = sectorExistente.cultivoColorHex;

    if (dto.cultivoId && dto.cultivoId !== sectorExistente.cultivoId) {
      const cultivo = await this.prisma.cultivo.findUnique({
        where: { id: dto.cultivoId },
        select: { id: true, nombre: true, colorHex: true },
      });
      if (!cultivo) {
        throw new BadRequestException(`El cultivo con ID ${dto.cultivoId} no existe en el catálogo.`);
      }
      cultivoId = cultivo.id;
      cultivoNombre = cultivo.nombre;
      cultivoColorHex = cultivo.colorHex;
    }

    let areaHectareas = sectorExistente.areaHectareas;
    if (typeof dto.areaHectareas === 'number') {
      const parcela = await this.parcelaRepositorio.buscarPorId(parcelaId);
      if (parcela) {
        const areaOtrosSectores = await this.sectorRepositorio.sumarAreaAsignada(parcelaId, sectorId);
        const areaDisponible = Math.max(0, Number((Number(parcela.areaHectareas) - areaOtrosSectores).toFixed(4)));

        if (dto.areaHectareas > areaDisponible + 0.05) {
          throw new SectorSuperaAreaDisponibleError(dto.areaHectareas, areaDisponible);
        }
      }
      areaHectareas = dto.areaHectareas;
    }

    const fechaSiembra =
      typeof dto.fechaSiembra !== 'undefined'
        ? dto.fechaSiembra
          ? new Date(dto.fechaSiembra)
          : null
        : sectorExistente.fechaSiembra;

    const fechaCosechaEstimada =
      typeof dto.fechaCosechaEstimada !== 'undefined'
        ? dto.fechaCosechaEstimada
          ? new Date(dto.fechaCosechaEstimada)
          : null
        : sectorExistente.fechaCosechaEstimada;

    const sectorModificado = new SectorParcela({
      id: sectorExistente.id,
      codigo: sectorExistente.codigo,
      nombre: dto.nombre?.trim() || sectorExistente.nombre,
      areaHectareas,
      colorHex: dto.colorHex?.trim() || sectorExistente.colorHex || cultivoColorHex,
      parcelaId: sectorExistente.parcelaId,
      parcelaCodigo: sectorExistente.parcelaCodigo,
      parcelaNombre: sectorExistente.parcelaNombre,
      cultivoId,
      cultivoNombre,
      cultivoColorHex,
      variedad: typeof dto.variedad !== 'undefined' ? dto.variedad?.trim() || null : sectorExistente.variedad,
      delimitacionGeoJson:
        typeof dto.delimitacionGeoJson !== 'undefined'
          ? dto.delimitacionGeoJson
          : sectorExistente.delimitacionGeoJson,
      latitudCentro:
        typeof dto.latitudCentro !== 'undefined' ? dto.latitudCentro : sectorExistente.latitudCentro,
      longitudCentro:
        typeof dto.longitudCentro !== 'undefined' ? dto.longitudCentro : sectorExistente.longitudCentro,
      fechaSiembra,
      fechaCosechaEstimada,
      estado: dto.estado || sectorExistente.estado,
      createdAt: sectorExistente.createdAt,
      updatedAt: new Date(),
    });

    const guardado = await this.sectorRepositorio.actualizar(sectorModificado);
    if (!guardado) {
      throw new SectorNoEncontradoError(sectorId);
    }

    return {
      id: guardado.id,
      codigo: guardado.codigo,
      nombre: guardado.nombre,
      areaHectareas: guardado.areaHectareas,
      colorHex: guardado.colorHex,
      parcelaId: guardado.parcelaId,
      parcelaCodigo: guardado.parcelaCodigo,
      parcelaNombre: guardado.parcelaNombre,
      cultivoId: guardado.cultivoId,
      cultivoNombre: guardado.cultivoNombre,
      cultivoColorHex: guardado.cultivoColorHex,
      variedad: guardado.variedad,
      delimitacionGeoJson: guardado.delimitacionGeoJson,
      latitudCentro: guardado.latitudCentro,
      longitudCentro: guardado.longitudCentro,
      fechaSiembra: guardado.fechaSiembra,
      fechaCosechaEstimada: guardado.fechaCosechaEstimada,
      estado: guardado.estado,
      createdAt: guardado.createdAt,
      updatedAt: guardado.updatedAt,
    };
  }
}
