import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service.js';
import { DiagnosticoCampo } from '../../domain/entities/diagnostico-campo.entity.js';
import {
  type IDiagnosticoCampoRepositorio,
  type FiltrosListarDiagnosticos,
} from '../../domain/ports/diagnostico-campo-repositorio.port.js';

type PrismaDiagnosticoConRelaciones = Prisma.DiagnosticoCampoGetPayload<{
  include: {
    parcela: { select: { nombre: true; codigo: true } };
    sector: {
      select: {
        nombre: true;
        codigo: true;
        variedad: true;
        cultivo: { select: { nombre: true } };
      };
    };
    usuario: { select: { nombres: true; apellidos: true } };
  };
}>;

/**
 * @description Repositorio Prisma para DiagnosticoCampo en PostgreSQL con esquema diagnosticos.
 */
@Injectable()
export class PrismaDiagnosticoCampoRepository implements IDiagnosticoCampoRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  private mapearAEntidad(r: PrismaDiagnosticoConRelaciones): DiagnosticoCampo {
    const usuarioNombre = r.usuario
      ? `${r.usuario.nombres} ${r.usuario.apellidos}`.trim()
      : null;

    return new DiagnosticoCampo({
      id: r.id,
      codigo: r.codigo,
      parcelaId: r.parcelaId,
      parcelaNombre: r.parcela?.nombre,
      parcelaCodigo: r.parcela?.codigo,
      sectorId: r.sectorId,
      sectorNombre: r.sector?.nombre,
      sectorCodigo: r.sector?.codigo,
      cultivoNombre: r.sector?.cultivo?.nombre,
      cultivoVariedad: r.sector?.variedad,
      usuarioId: r.usuarioId,
      usuarioNombre: usuarioNombre,
      latitud: Number(r.latitud),
      longitud: Number(r.longitud),
      estadoGeneral: r.estadoGeneral,
      saludPorcentaje: r.saludPorcentaje,
      totalPlagasDetectadas: r.totalPlagasDetectadas,
      esAlerta: r.esAlerta,
      detecciones: r.detecciones,
      recomendaciones: r.recomendaciones,
      tiempoProcesamientoMs: r.tiempoProcesamientoMs,
      imagenUrl: r.imagenUrl,
      origenCaptura: r.origenCaptura,
      observaciones: r.observaciones,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async listar(filtros?: FiltrosListarDiagnosticos): Promise<{ diagnosticos: DiagnosticoCampo[]; total: number }> {
    const where: Prisma.DiagnosticoCampoWhereInput = {};

    if (filtros?.parcelaId) {
      where.parcelaId = filtros.parcelaId;
    }

    if (filtros?.sectorId) {
      where.sectorId = filtros.sectorId;
    }

    if (filtros?.estadoGeneral) {
      where.estadoGeneral = filtros.estadoGeneral as any;
    }

    if (filtros?.esAlerta !== undefined) {
      where.esAlerta = filtros.esAlerta;
    }

    const pagina = filtros?.pagina && filtros.pagina > 0 ? filtros.pagina : 1;
    const limite = filtros?.limite && filtros.limite > 0 ? filtros.limite : 20;
    const skip = (pagina - 1) * limite;

    const [total, registros] = await Promise.all([
      this.prisma.diagnosticoCampo.count({ where }),
      this.prisma.diagnosticoCampo.findMany({
        where,
        skip,
        take: limite,
        orderBy: { createdAt: 'desc' },
        include: {
          parcela: { select: { nombre: true, codigo: true } },
          sector: {
            select: {
              nombre: true,
              codigo: true,
              variedad: true,
              cultivo: { select: { nombre: true } },
            },
          },
          usuario: { select: { nombres: true, apellidos: true } },
        },
      }),
    ]);

    return {
      diagnosticos: registros.map((r) => this.mapearAEntidad(r)),
      total,
    };
  }

  async buscarPorId(id: string): Promise<DiagnosticoCampo | null> {
    const r = await this.prisma.diagnosticoCampo.findUnique({
      where: { id },
      include: {
        parcela: { select: { nombre: true, codigo: true } },
        sector: {
          select: {
            nombre: true,
            codigo: true,
            variedad: true,
            cultivo: { select: { nombre: true } },
          },
        },
        usuario: { select: { nombres: true, apellidos: true } },
      },
    });

    if (!r) return null;
    return this.mapearAEntidad(r);
  }

  async crear(d: DiagnosticoCampo): Promise<DiagnosticoCampo> {
    const r = await this.prisma.diagnosticoCampo.create({
      data: {
        id: d.id,
        codigo: d.codigo,
        parcelaId: d.parcelaId,
        sectorId: d.sectorId || null,
        usuarioId: d.usuarioId || null,
        latitud: new Prisma.Decimal(d.latitud),
        longitud: new Prisma.Decimal(d.longitud),
        estadoGeneral: d.estadoGeneral,
        saludPorcentaje: d.saludPorcentaje,
        totalPlagasDetectadas: d.totalPlagasDetectadas,
        esAlerta: d.esAlerta,
        detecciones: (d.detecciones as Prisma.InputJsonValue) ?? [],
        recomendaciones: (d.recomendaciones as Prisma.InputJsonValue) ?? [],
        tiempoProcesamientoMs: d.tiempoProcesamientoMs || null,
        imagenUrl: d.imagenUrl || null,
        origenCaptura: d.origenCaptura || 'DRON_SIMULADO',
        observaciones: d.observaciones || null,
      },
      include: {
        parcela: { select: { nombre: true, codigo: true } },
        sector: {
          select: {
            nombre: true,
            codigo: true,
            variedad: true,
            cultivo: { select: { nombre: true } },
          },
        },
        usuario: { select: { nombres: true, apellidos: true } },
      },
    });

    return this.mapearAEntidad(r);
  }

  async contarTotal(): Promise<number> {
    return this.prisma.diagnosticoCampo.count();
  }
}
