import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { EstadoParcela } from '@prisma/client';
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
  ParcelaNoEncontradaError,
  SectorSuperaAreaDisponibleError,
} from '../../domain/errors/parcela.errors.js';
import { CrearSectorParcelaDto } from '../../presentation/dtos/crear-sector-parcela.dto.js';
import { SectorParcelaItemDto } from '../dtos/sector-parcela-item.dto.js';
import { SectorParcela } from '../../domain/entities/sector-parcela.entity.js';

@Injectable()
export class RegistrarSectorParcelaCasoUso {
  constructor(
    @Inject(PARCELA_REPOSITORIO_PORT)
    private readonly parcelaRepositorio: IParcelaRepositorio,
    @Inject(SECTOR_PARCELA_REPOSITORIO_PORT)
    private readonly sectorRepositorio: ISectorParcelaRepositorio,
    private readonly prisma: PrismaService,
  ) {}

  async ejecutar(parcelaId: string, dto: CrearSectorParcelaDto): Promise<SectorParcelaItemDto> {
    const parcela = await this.parcelaRepositorio.buscarPorId(parcelaId);
    if (!parcela) {
      throw new ParcelaNoEncontradaError(parcelaId);
    }

    const cultivo = await this.prisma.cultivo.findUnique({
      where: { id: dto.cultivoId },
      select: { id: true, nombre: true, colorHex: true },
    });
    if (!cultivo) {
      throw new BadRequestException(`El cultivo con ID ${dto.cultivoId} no existe en el catálogo.`);
    }

    const areaTotal = Number(parcela.areaHectareas);
    const areaYaAsignada = await this.sectorRepositorio.sumarAreaAsignada(parcelaId);
    const areaDisponible = Math.max(0, Number((areaTotal - areaYaAsignada).toFixed(4)));

    // Margen de tolerancia de 0.05 ha por redondeo perimetral en mapas satelitales
    if (dto.areaHectareas > areaDisponible + 0.05) {
      throw new SectorSuperaAreaDisponibleError(dto.areaHectareas, areaDisponible);
    }

    const codigo =
      dto.codigo?.trim() ||
      (await this.sectorRepositorio.obtenerSiguienteCorrelativo(parcela.id, parcela.codigo));

    const color = dto.colorHex?.trim() || cultivo.colorHex || '#15803D';

    const fechaSiembra = dto.fechaSiembra ? new Date(dto.fechaSiembra) : null;
    const fechaCosechaEstimada = dto.fechaCosechaEstimada
      ? new Date(dto.fechaCosechaEstimada)
      : null;

    const nuevoSector = new SectorParcela({
      id: randomUUID(),
      codigo,
      nombre: dto.nombre.trim(),
      areaHectareas: dto.areaHectareas,
      colorHex: color,
      parcelaId: parcela.id,
      parcelaCodigo: parcela.codigo,
      parcelaNombre: parcela.nombre,
      cultivoId: cultivo.id,
      cultivoNombre: cultivo.nombre,
      cultivoColorHex: cultivo.colorHex,
      variedad: dto.variedad?.trim() || null,
      delimitacionGeoJson: dto.delimitacionGeoJson,
      latitudCentro: dto.latitudCentro ?? null,
      longitudCentro: dto.longitudCentro ?? null,
      fechaSiembra,
      fechaCosechaEstimada,
      estado: EstadoParcela.ACTIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const guardado = await this.sectorRepositorio.crear(nuevoSector);

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
