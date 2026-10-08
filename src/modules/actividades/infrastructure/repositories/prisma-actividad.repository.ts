import { Injectable } from '@nestjs/common';
import { EstadoActividad, TipoActividad, type Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service.js';
import { ActividadAgricola } from '../../domain/entities/actividad-agricola.entity.js';
import {
  type IActividadRepositorio,
  type FiltrosListarActividades,
  type TrabajadorEntrada,
  type RecursoEntrada,
} from '../../domain/ports/actividad-repositorio.port.js';

type PrismaActividadConRelaciones = Prisma.ActividadAgricolaGetPayload<{
  include: {
    parcela: { select: { nombre: true; cultivo: { select: { nombre: true } } } };
    usuarioResponsable: { select: { nombres: true; apellidos: true } };
    trabajadores: {
      include: { usuario: { select: { nombres: true; apellidos: true; telefono: true } } };
    };
    recursos: {
      include: { insumo: { select: { nombre: true; categoria: true } } };
    };
  };
}>;

const INCLUSION_COMPLETA = {
  parcela: { select: { nombre: true, cultivo: { select: { nombre: true } } } },
  usuarioResponsable: { select: { nombres: true, apellidos: true } },
  trabajadores: {
    include: { usuario: { select: { nombres: true, apellidos: true, telefono: true } } },
  },
  recursos: {
    include: { insumo: { select: { nombre: true, categoria: true } } },
  },
} as const;

/**
 * @description Repositorio Prisma para Actividades Agrícolas en PostgreSQL esquema actividades.
 */
@Injectable()
export class PrismaActividadRepository implements IActividadRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  private mapearAEntidad(r: PrismaActividadConRelaciones): ActividadAgricola {
    const responsableNombre = r.usuarioResponsable
      ? `${r.usuarioResponsable.nombres} ${r.usuarioResponsable.apellidos}`.trim()
      : null;

    return new ActividadAgricola({
      id: r.id,
      codigo: r.codigo,
      titulo: r.titulo,
      tipo: r.tipo,
      descripcion: r.descripcion,
      observaciones: r.observaciones,
      parcelaId: r.parcelaId,
      parcelaNombre: r.parcela?.nombre,
      cultivoNombre: r.parcela?.cultivo?.nombre,
      usuarioResponsableId: r.usuarioResponsableId,
      usuarioResponsableNombre: responsableNombre,
      fechaInicio: r.fechaInicio,
      fechaFin: r.fechaFin,
      estado: r.estado,
      trabajadores: r.trabajadores.map((t) => ({
        id: t.id,
        usuarioId: t.usuarioId,
        nombres: t.usuario.nombres,
        apellidos: t.usuario.apellidos,
        rolEnActividad: t.rolEnActividad,
        telefono: t.usuario.telefono,
      })),
      recursos: r.recursos.map((rec) => ({
        id: rec.id,
        insumoId: rec.insumoId,
        nombreInsumo: rec.insumo.nombre,
        categoriaInsumo: rec.insumo.categoria,
        cantidadEstimada: Number(rec.cantidadEstimada),
        unidadMedida: rec.unidadMedida,
        notas: rec.notas,
      })),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async listar(
    filtros?: FiltrosListarActividades,
  ): Promise<{ actividades: ActividadAgricola[]; total: number }> {
    const where: Prisma.ActividadAgricolaWhereInput = { deletedAt: null };

    if (filtros?.busqueda) {
      const termino = filtros.busqueda.trim();
      where.OR = [
        { titulo: { contains: termino, mode: 'insensitive' } },
        { codigo: { contains: termino, mode: 'insensitive' } },
        { descripcion: { contains: termino, mode: 'insensitive' } },
      ];
    }
    if (filtros?.parcelaId) where.parcelaId = filtros.parcelaId;
    if (filtros?.tipo) where.tipo = filtros.tipo as TipoActividad;
    if (filtros?.estado) where.estado = filtros.estado as EstadoActividad;
    if (filtros?.usuarioResponsableId) where.usuarioResponsableId = filtros.usuarioResponsableId;

    const pagina = filtros?.pagina && filtros.pagina > 0 ? filtros.pagina : 1;
    const limite = filtros?.limite && filtros.limite > 0 ? filtros.limite : 10;
    const skip = (pagina - 1) * limite;

    const [registros, total] = await Promise.all([
      this.prisma.actividadAgricola.findMany({
        where,
        skip,
        take: limite,
        orderBy: { fechaInicio: 'desc' },
        include: INCLUSION_COMPLETA,
      }),
      this.prisma.actividadAgricola.count({ where }),
    ]);

    return {
      actividades: registros.map((r) => this.mapearAEntidad(r)),
      total,
    };
  }

  async buscarPorId(id: string): Promise<ActividadAgricola | null> {
    const registro = await this.prisma.actividadAgricola.findUnique({
      where: { id, deletedAt: null },
      include: INCLUSION_COMPLETA,
    });
    return registro ? this.mapearAEntidad(registro) : null;
  }

  async buscarPorCodigo(codigo: string): Promise<ActividadAgricola | null> {
    const registro = await this.prisma.actividadAgricola.findFirst({
      where: { codigo: { equals: codigo, mode: 'insensitive' }, deletedAt: null },
      include: INCLUSION_COMPLETA,
    });
    return registro ? this.mapearAEntidad(registro) : null;
  }

  async crear(
    actividad: ActividadAgricola,
    trabajadores: TrabajadorEntrada[],
    recursos: RecursoEntrada[],
  ): Promise<ActividadAgricola> {
    const registro = await this.prisma.actividadAgricola.create({
      data: {
        codigo: actividad.codigo,
        titulo: actividad.titulo,
        tipo: actividad.tipo,
        descripcion: actividad.descripcion ?? null,
        observaciones: actividad.observaciones ?? null,
        fechaInicio: actividad.fechaInicio,
        fechaFin: actividad.fechaFin ?? null,
        estado: actividad.estado,
        parcela: { connect: { id: actividad.parcelaId } },
        ...(actividad.usuarioResponsableId
          ? { usuarioResponsable: { connect: { id: actividad.usuarioResponsableId } } }
          : {}),
        trabajadores: {
          create: trabajadores.map((t) => ({
            usuarioId: t.usuarioId,
            rolEnActividad: t.rolEnActividad ?? null,
          })),
        },
        recursos: {
          create: recursos.map((r) => ({
            insumoId: r.insumoId,
            cantidadEstimada: r.cantidadEstimada,
            unidadMedida: r.unidadMedida,
            notas: r.notas ?? null,
          })),
        },
      },
      include: INCLUSION_COMPLETA,
    });

    return this.mapearAEntidad(registro);
  }

  async actualizar(
    actividad: ActividadAgricola,
    trabajadores?: TrabajadorEntrada[],
    recursos?: RecursoEntrada[],
  ): Promise<ActividadAgricola | null> {
    return this.prisma.$transaction(async (tx) => {
      if (trabajadores !== undefined) {
        await tx.actividadTrabajador.deleteMany({ where: { actividadId: actividad.id } });
        await tx.actividadTrabajador.createMany({
          data: trabajadores.map((t) => ({
            actividadId: actividad.id,
            usuarioId: t.usuarioId,
            rolEnActividad: t.rolEnActividad ?? null,
          })),
        });
      }

      if (recursos !== undefined) {
        await tx.actividadRecurso.deleteMany({ where: { actividadId: actividad.id } });
        await tx.actividadRecurso.createMany({
          data: recursos.map((r) => ({
            actividadId: actividad.id,
            insumoId: r.insumoId,
            cantidadEstimada: r.cantidadEstimada,
            unidadMedida: r.unidadMedida,
            notas: r.notas ?? null,
          })),
        });
      }

      const registro = await tx.actividadAgricola.update({
        where: { id: actividad.id },
        data: {
          titulo: actividad.titulo,
          tipo: actividad.tipo,
          descripcion: actividad.descripcion ?? null,
          observaciones: actividad.observaciones ?? null,
          fechaInicio: actividad.fechaInicio,
          fechaFin: actividad.fechaFin ?? null,
          estado: actividad.estado,
          parcela: { connect: { id: actividad.parcelaId } },
          ...(actividad.usuarioResponsableId
            ? { usuarioResponsable: { connect: { id: actividad.usuarioResponsableId } } }
            : { usuarioResponsable: { disconnect: true } }),
          version: { increment: 1 },
        },
        include: INCLUSION_COMPLETA,
      });

      return this.mapearAEntidad(registro);
    });
  }

  async actualizarEstado(id: string, estado: string): Promise<ActividadAgricola | null> {
    const registro = await this.prisma.actividadAgricola.update({
      where: { id },
      data: {
        estado: estado as EstadoActividad,
        version: { increment: 1 },
      },
      include: INCLUSION_COMPLETA,
    });

    return this.mapearAEntidad(registro);
  }

  async eliminar(id: string): Promise<boolean> {
    await this.prisma.actividadAgricola.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        version: { increment: 1 },
      },
    });
    return true;
  }

  async contarTotal(): Promise<number> {
    return this.prisma.actividadAgricola.count();
  }
}
