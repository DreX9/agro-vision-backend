import { Injectable } from '@nestjs/common';
import { EstadoParcela, Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service.js';
import { Parcela } from '../../domain/entities/parcela.entity.js';
import {
  type IParcelaRepositorio,
  type FiltrosListarParcelas,
} from '../../domain/ports/parcela-repositorio.port.js';
import { ParcelaCodigoYaExisteError } from '../../domain/errors/parcela.errors.js';

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
      colorHex: r.colorHex ?? r.cultivo?.colorHex ?? '#15803D',
      cultivoId: r.cultivoId,
      cultivoNombre: r.cultivo?.nombre,
      cultivoColorHex: r.colorHex ?? r.cultivo?.colorHex ?? '#15803D',
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
      colorHex: parcela.colorHex ?? '#15803D',
      variedad: parcela.variedad ?? null,
      ubicacion: parcela.ubicacion ?? null,
      departamento: parcela.departamento ?? null,
      provincia: parcela.provincia ?? null,
      distrito: parcela.distrito ?? null,
      estado: parcela.estado,
      delimitacionGeoJson: (parcela.delimitacionGeoJson as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      latitudCentro: parcela.latitudCentro ?? null,
      longitudCentro: parcela.longitudCentro ?? null,
    };

    if (parcela.cultivoId) {
      const cultivoExiste = await this.prisma.cultivo.findUnique({
        where: { id: parcela.cultivoId },
        select: { id: true },
      });
      if (cultivoExiste) {
        data.cultivo = { connect: { id: parcela.cultivoId } };
      }
    }

    if (parcela.usuarioResponsableId) {
      const usuarioExiste = await this.prisma.usuario.findUnique({
        where: { id: parcela.usuarioResponsableId },
        select: { id: true },
      });
      if (usuarioExiste) {
        data.usuarioResponsable = { connect: { id: parcela.usuarioResponsableId } };
      }
    }

    try {
      const registro = await this.prisma.parcela.create({
        data,
        include: {
          cultivo: { select: { nombre: true, colorHex: true } },
          usuarioResponsable: { select: { nombres: true, apellidos: true } },
        },
      });

      return this.mapearAEntidad(registro);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ParcelaCodigoYaExisteError(parcela.codigo);
      }
      throw error;
    }
  }

  async actualizar(parcela: Parcela): Promise<Parcela | null> {
    const data: Prisma.ParcelaUpdateInput = {
      nombre: parcela.nombre,
      areaHectareas: parcela.areaHectareas,
      colorHex: parcela.colorHex ?? undefined,
      variedad: parcela.variedad ?? null,
      ubicacion: parcela.ubicacion ?? null,
      departamento: parcela.departamento ?? null,
      provincia: parcela.provincia ?? null,
      distrito: parcela.distrito ?? null,
      estado: parcela.estado,
      delimitacionGeoJson: (parcela.delimitacionGeoJson as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      latitudCentro: parcela.latitudCentro ?? null,
      longitudCentro: parcela.longitudCentro ?? null,
      version: { increment: 1 },
    };

    if (parcela.cultivoId) {
      const cultivoExiste = await this.prisma.cultivo.findUnique({
        where: { id: parcela.cultivoId },
        select: { id: true },
      });
      if (cultivoExiste) {
        data.cultivo = { connect: { id: parcela.cultivoId } };
      } else {
        data.cultivo = { disconnect: true };
      }
    } else if (parcela.cultivoId === null) {
      data.cultivo = { disconnect: true };
    }

    if (parcela.usuarioResponsableId) {
      const usuarioExiste = await this.prisma.usuario.findUnique({
        where: { id: parcela.usuarioResponsableId },
        select: { id: true },
      });
      if (usuarioExiste) {
        data.usuarioResponsable = { connect: { id: parcela.usuarioResponsableId } };
      } else {
        data.usuarioResponsable = { disconnect: true };
      }
    } else {
      data.usuarioResponsable = { disconnect: true };
    }

    try {
      const registro = await this.prisma.parcela.update({
        where: { id: parcela.id },
        data,
        include: {
          cultivo: { select: { nombre: true, colorHex: true } },
          usuarioResponsable: { select: { nombres: true, apellidos: true } },
        },
      });

      return this.mapearAEntidad(registro);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ParcelaCodigoYaExisteError(parcela.codigo);
      }
      throw error;
    }
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
    const registro = await this.prisma.parcela.findUnique({
      where: { id },
      select: { codigo: true },
    });
    if (!registro) return false;

    const sufijo = `__del_${Date.now()}`;
    const codigoLiberado = `${registro.codigo.slice(0, 50 - sufijo.length)}${sufijo}`;

    await this.prisma.parcela.update({
      where: { id },
      data: {
        codigo: codigoLiberado,
        deletedAt: new Date(),
        version: { increment: 1 },
      },
    });
    return true;
  }

  async contarTotal(): Promise<number> {
    return this.prisma.parcela.count({
      where: { deletedAt: null },
    });
  }
}
