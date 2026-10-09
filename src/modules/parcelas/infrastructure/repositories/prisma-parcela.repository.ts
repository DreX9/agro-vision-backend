import { Injectable } from '@nestjs/common';
import { EstadoParcela, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service.js';
import { Parcela } from '../../domain/entities/parcela.entity.js';
import {
  type IParcelaRepositorio,
  type FiltrosListarParcelas,
} from '../../domain/ports/parcela-repositorio.port.js';

type PrismaParcelaConRelaciones = Prisma.ParcelaGetPayload<{
  include: {
    cultivo: { select: { nombre: true; colorHex: true } };
    usuarioResponsable: { select: { nombres: true; apellidos: true } };
  };
}>;

/**
 * @description Repositorio Prisma para la entidad Parcela en PostgreSQL con esquema parcelas.
 */
@Injectable()
export class PrismaParcelaRepository implements IParcelaRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  private mapearAEntidad(r: PrismaParcelaConRelaciones): Parcela {
    const responsableNombre = r.usuarioResponsable
      ? `${r.usuarioResponsable.nombres} ${r.usuarioResponsable.apellidos}`.trim()
      : null;

    return new Parcela({
      id: r.id,
      codigo: r.codigo,
      nombre: r.nombre,
      areaHectareas: Number(r.areaHectareas),
      cultivoId: r.cultivoId,
      cultivoNombre: r.cultivo?.nombre,
      cultivoColorHex: r.cultivo?.colorHex ?? null,
      variedad: r.variedad,
      usuarioResponsableId: r.usuarioResponsableId,
      usuarioResponsableNombre: responsableNombre,
      ubicacion: r.ubicacion,
      departamento: r.departamento,
      provincia: r.provincia,
      distrito: r.distrito,
      estado: r.estado,
      delimitacionGeoJson: r.delimitacionGeoJson ?? undefined,
      latitudCentro: r.latitudCentro !== null ? Number(r.latitudCentro) : null,
      longitudCentro: r.longitudCentro !== null ? Number(r.longitudCentro) : null,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async listar(filtros?: FiltrosListarParcelas): Promise<{ parcelas: Parcela[]; total: number }> {
    const where: Prisma.ParcelaWhereInput = {
      deletedAt: null,
    };

    if (filtros?.busqueda) {
      const termino = filtros.busqueda.trim();
      where.OR = [
        { nombre: { contains: termino, mode: 'insensitive' } },
        { codigo: { contains: termino, mode: 'insensitive' } },
        { ubicacion: { contains: termino, mode: 'insensitive' } },
        { departamento: { contains: termino, mode: 'insensitive' } },
        { provincia: { contains: termino, mode: 'insensitive' } },
        { distrito: { contains: termino, mode: 'insensitive' } },
      ];
    }

    if (filtros?.cultivoId) {
      where.cultivoId = filtros.cultivoId;
    }

    if (filtros?.estado) {
      where.estado = filtros.estado as EstadoParcela;
    }

    if (filtros?.usuarioResponsableId) {
      where.usuarioResponsableId = filtros.usuarioResponsableId;
    }

    const pagina = filtros?.pagina && filtros.pagina > 0 ? filtros.pagina : 1;
    const limite = filtros?.limite && filtros.limite > 0 ? filtros.limite : 10;
    const skip = (pagina - 1) * limite;

    const [registros, total] = await Promise.all([
      this.prisma.parcela.findMany({
        where,
        skip,
        take: limite,
        orderBy: { createdAt: 'desc' },
        include: {
          cultivo: { select: { nombre: true, colorHex: true } },
          usuarioResponsable: { select: { nombres: true, apellidos: true } },
        },
      }),
      this.prisma.parcela.count({ where }),
    ]);

    return {
      parcelas: registros.map((r) => this.mapearAEntidad(r)),
      total,
    };
  }

  async buscarPorId(id: string): Promise<Parcela | null> {
    const registro = await this.prisma.parcela.findUnique({
      where: { id, deletedAt: null },
      include: {
        cultivo: { select: { nombre: true, colorHex: true } },
        usuarioResponsable: { select: { nombres: true, apellidos: true } },
      },
    });
    return registro ? this.mapearAEntidad(registro) : null;
  }

  async buscarPorCodigo(codigo: string): Promise<Parcela | null> {
    const registro = await this.prisma.parcela.findFirst({
      where: {
        codigo: { equals: codigo, mode: 'insensitive' },
        deletedAt: null,
      },
      include: {
        cultivo: { select: { nombre: true, colorHex: true } },
        usuarioResponsable: { select: { nombres: true, apellidos: true } },
      },
    });
    return registro ? this.mapearAEntidad(registro) : null;
  }

  async crear(parcela: Parcela): Promise<Parcela> {
    const data: Prisma.ParcelaCreateInput = {
      codigo: parcela.codigo,
      nombre: parcela.nombre,
      areaHectareas: parcela.areaHectareas,
      variedad: parcela.variedad ?? null,
      ubicacion: parcela.ubicacion ?? null,
      departamento: parcela.departamento ?? null,
      provincia: parcela.provincia ?? null,
      distrito: parcela.distrito ?? null,
      estado: parcela.estado,
      delimitacionGeoJson: (parcela.delimitacionGeoJson as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      latitudCentro: parcela.latitudCentro ?? null,
      longitudCentro: parcela.longitudCentro ?? null,
      cultivo: { connect: { id: parcela.cultivoId } },
    };

    if (parcela.usuarioResponsableId) {
      data.usuarioResponsable = { connect: { id: parcela.usuarioResponsableId } };
    }

    const registro = await this.prisma.parcela.create({
      data,
      include: {
        cultivo: { select: { nombre: true, colorHex: true } },
        usuarioResponsable: { select: { nombres: true, apellidos: true } },
      },
    });

    return this.mapearAEntidad(registro);
  }

  async actualizar(parcela: Parcela): Promise<Parcela | null> {
    const data: Prisma.ParcelaUpdateInput = {
      nombre: parcela.nombre,
      areaHectareas: parcela.areaHectareas,
      variedad: parcela.variedad ?? null,
      ubicacion: parcela.ubicacion ?? null,
      departamento: parcela.departamento ?? null,
      provincia: parcela.provincia ?? null,
      distrito: parcela.distrito ?? null,
      estado: parcela.estado,
      delimitacionGeoJson: (parcela.delimitacionGeoJson as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      latitudCentro: parcela.latitudCentro ?? null,
      longitudCentro: parcela.longitudCentro ?? null,
      cultivo: { connect: { id: parcela.cultivoId } },
      version: { increment: 1 },
    };

    if (parcela.usuarioResponsableId) {
      data.usuarioResponsable = { connect: { id: parcela.usuarioResponsableId } };
    } else {
      data.usuarioResponsable = { disconnect: true };
    }

    const registro = await this.prisma.parcela.update({
      where: { id: parcela.id },
      data,
      include: {
        cultivo: { select: { nombre: true, colorHex: true } },
        usuarioResponsable: { select: { nombres: true, apellidos: true } },
      },
    });

    return this.mapearAEntidad(registro);
  }

  async actualizarEstado(id: string, estado: string): Promise<Parcela | null> {
    const registro = await this.prisma.parcela.update({
      where: { id },
      data: {
        estado: estado as EstadoParcela,
        version: { increment: 1 },
      },
      include: {
        cultivo: { select: { nombre: true, colorHex: true } },
        usuarioResponsable: { select: { nombres: true, apellidos: true } },
      },
    });

    return this.mapearAEntidad(registro);
  }

  async eliminar(id: string): Promise<boolean> {
    await this.prisma.parcela.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        version: { increment: 1 },
      },
    });
    return true;
  }

  async contarTotal(): Promise<number> {
    return this.prisma.parcela.count();
  }
}
