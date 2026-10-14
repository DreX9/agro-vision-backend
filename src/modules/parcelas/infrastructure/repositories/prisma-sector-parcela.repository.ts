import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service.js';
import { SectorParcela } from '../../domain/entities/sector-parcela.entity.js';
import { ISectorParcelaRepositorio } from '../../domain/ports/sector-parcela-repositorio.port.js';

@Injectable()
export class PrismaSectorParcelaRepository implements ISectorParcelaRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  private mapearAEntidad(registro: Prisma.SectorParcelaGetPayload<{
    include: {
      cultivo: { select: { nombre: true; colorHex: true } };
      parcela: { select: { nombre: true; codigo: true } };
    };
  }>): SectorParcela {
    return new SectorParcela({
      id: registro.id,
      codigo: registro.codigo,
      nombre: registro.nombre,
      areaHectareas: Number(registro.areaHectareas),
      colorHex: registro.colorHex || registro.cultivo.colorHex || null,
      parcelaId: registro.parcelaId,
      parcelaCodigo: registro.parcela?.codigo || null,
      parcelaNombre: registro.parcela?.nombre || null,
      cultivoId: registro.cultivoId,
      cultivoNombre: registro.cultivo?.nombre || null,
      cultivoColorHex: registro.cultivo?.colorHex || null,
      variedad: registro.variedad,
      delimitacionGeoJson: registro.delimitacionGeoJson,
      latitudCentro: registro.latitudCentro ? Number(registro.latitudCentro) : null,
      longitudCentro: registro.longitudCentro ? Number(registro.longitudCentro) : null,
      fechaSiembra: registro.fechaSiembra,
      fechaCosechaEstimada: registro.fechaCosechaEstimada,
      estado: registro.estado,
      createdAt: registro.createdAt,
      updatedAt: registro.updatedAt,
    });
  }

  async listarPorParcela(parcelaId: string): Promise<SectorParcela[]> {
    const registros = await this.prisma.sectorParcela.findMany({
      where: {
        parcelaId,
        deletedAt: null,
      },
      include: {
        cultivo: { select: { nombre: true, colorHex: true } },
        parcela: { select: { nombre: true, codigo: true } },
      },
      orderBy: { codigo: 'asc' },
    });

    return registros.map((r) => this.mapearAEntidad(r));
  }

  async buscarPorId(id: string): Promise<SectorParcela | null> {
    const registro = await this.prisma.sectorParcela.findUnique({
      where: { id },
      include: {
        cultivo: { select: { nombre: true, colorHex: true } },
        parcela: { select: { nombre: true, codigo: true } },
      },
    });

    if (!registro || registro.deletedAt) {
      return null;
    }

    return this.mapearAEntidad(registro);
  }

  async crear(sector: SectorParcela): Promise<SectorParcela> {
    const data: Prisma.SectorParcelaCreateInput = {
      id: sector.id,
      codigo: sector.codigo,
      nombre: sector.nombre,
      areaHectareas: sector.areaHectareas,
      colorHex: sector.colorHex ?? undefined,
      variedad: sector.variedad ?? null,
      delimitacionGeoJson: (sector.delimitacionGeoJson as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      latitudCentro: sector.latitudCentro ?? null,
      longitudCentro: sector.longitudCentro ?? null,
      fechaSiembra: sector.fechaSiembra ?? null,
      fechaCosechaEstimada: sector.fechaCosechaEstimada ?? null,
      estado: sector.estado,
      parcela: { connect: { id: sector.parcelaId } },
      cultivo: { connect: { id: sector.cultivoId } },
    };

    const registro = await this.prisma.sectorParcela.create({
      data,
      include: {
        cultivo: { select: { nombre: true, colorHex: true } },
        parcela: { select: { nombre: true, codigo: true } },
      },
    });

    return this.mapearAEntidad(registro);
  }

  async actualizar(sector: SectorParcela): Promise<SectorParcela | null> {
    const data: Prisma.SectorParcelaUpdateInput = {
      nombre: sector.nombre,
      areaHectareas: sector.areaHectareas,
      colorHex: sector.colorHex ?? undefined,
      variedad: sector.variedad ?? null,
      delimitacionGeoJson: (sector.delimitacionGeoJson as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      latitudCentro: sector.latitudCentro ?? null,
      longitudCentro: sector.longitudCentro ?? null,
      fechaSiembra: sector.fechaSiembra ?? null,
      fechaCosechaEstimada: sector.fechaCosechaEstimada ?? null,
      estado: sector.estado,
      cultivo: { connect: { id: sector.cultivoId } },
      version: { increment: 1 },
    };

    const registro = await this.prisma.sectorParcela.update({
      where: { id: sector.id },
      data,
      include: {
        cultivo: { select: { nombre: true, colorHex: true } },
        parcela: { select: { nombre: true, codigo: true } },
      },
    });

    return this.mapearAEntidad(registro);
  }

  async eliminar(id: string): Promise<boolean> {
    const registro = await this.prisma.sectorParcela.findUnique({
      where: { id },
      select: { codigo: true },
    });
    if (!registro) return false;

    const sufijo = `__del_${Date.now()}`;
    const codigoLiberado = `${registro.codigo.slice(0, 50 - sufijo.length)}${sufijo}`;

    await this.prisma.sectorParcela.update({
      where: { id },
      data: {
        codigo: codigoLiberado,
        deletedAt: new Date(),
        version: { increment: 1 },
      },
    });

    return true;
  }

  async obtenerSiguienteCorrelativo(parcelaId: string, parcelaCodigo: string): Promise<string> {
    const sectores = await this.prisma.sectorParcela.findMany({
      where: { parcelaId },
      select: { codigo: true },
    });

    let maxNumero = 0;
    for (const s of sectores) {
      const match = s.codigo.match(/S(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNumero) {
          maxNumero = num;
        }
      }
    }

    const correlativo = String(maxNumero + 1).padStart(2, '0');
    return `${parcelaCodigo}-S${correlativo}`;
  }

  async sumarAreaAsignada(parcelaId: string, excluirSectorId?: string): Promise<number> {
    const where: Prisma.SectorParcelaWhereInput = {
      parcelaId,
      deletedAt: null,
    };
    if (excluirSectorId) {
      where.id = { not: excluirSectorId };
    }

    const resultado = await this.prisma.sectorParcela.aggregate({
      where,
      _sum: {
        areaHectareas: true,
      },
    });

    return resultado._sum.areaHectareas ? Number(resultado._sum.areaHectareas) : 0;
  }
}
