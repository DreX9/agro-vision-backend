import { Injectable } from '@nestjs/common';
import { CategoriaInsumo, type Insumo as PrismaInsumo } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service.js';
import { Insumo } from '../../domain/entities/insumo.entity.js';
import { IInsumoRepositorio } from '../../domain/ports/insumo-repositorio.port.js';

/**
 * @description Repositorio Prisma para la entidad Insumo en PostgreSQL esquema actividades.
 */
@Injectable()
export class PrismaInsumoRepository implements IInsumoRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  private mapearAEntidad(r: PrismaInsumo): Insumo {
    return new Insumo({
      id: r.id,
      codigo: r.codigo,
      nombre: r.nombre,
      categoria: r.categoria,
      unidadMedida: r.unidadMedida,
      descripcion: r.descripcion,
      activo: r.activo,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async listarActivos(categoria?: string): Promise<Insumo[]> {
    const where: { activo: boolean; deletedAt: null; categoria?: CategoriaInsumo } = {
      activo: true,
      deletedAt: null,
    };
    if (categoria) {
      where.categoria = categoria as CategoriaInsumo;
    }

    const registros = await this.prisma.insumo.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });
    return registros.map((r) => this.mapearAEntidad(r));
  }

  async buscarPorId(id: string): Promise<Insumo | null> {
    const registro = await this.prisma.insumo.findUnique({
      where: { id, deletedAt: null },
    });
    return registro ? this.mapearAEntidad(registro) : null;
  }

  async buscarPorCodigo(codigo: string): Promise<Insumo | null> {
    const registro = await this.prisma.insumo.findUnique({
      where: { codigo, deletedAt: null },
    });
    return registro ? this.mapearAEntidad(registro) : null;
  }

  async crear(insumo: Insumo): Promise<Insumo> {
    const registro = await this.prisma.insumo.create({
      data: {
        codigo: insumo.codigo,
        nombre: insumo.nombre,
        categoria: insumo.categoria,
        unidadMedida: insumo.unidadMedida,
        descripcion: insumo.descripcion ?? null,
        activo: insumo.activo,
      },
    });
    return this.mapearAEntidad(registro);
  }
}
