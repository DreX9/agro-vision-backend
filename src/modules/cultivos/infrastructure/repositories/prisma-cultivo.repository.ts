import { Injectable } from '@nestjs/common';
import { type Cultivo as PrismaCultivo } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service.js';
import { Cultivo, type CultivoProps } from '../../domain/entities/cultivo.entity.js';
import { ICultivoRepositorio } from '../../domain/ports/cultivo-repositorio.port.js';

/**
 * @description Repositorio Prisma para la entidad Cultivo en PostgreSQL.
 */
@Injectable()
export class PrismaCultivoRepository implements ICultivoRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  private mapearAEntidad(r: PrismaCultivo): Cultivo {
    return new Cultivo({
      id: r.id,
      nombre: r.nombre,
      nombreCientifico: r.nombreCientifico,
      variedadesDefault: r.variedadesDefault,
      colorHex: r.colorHex,
      activo: r.activo,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  async listarActivos(): Promise<Cultivo[]> {
    const registros = await this.prisma.cultivo.findMany({
      where: { activo: true, deletedAt: null },
      orderBy: { nombre: 'asc' },
    });
    return registros.map((r) => this.mapearAEntidad(r));
  }

  async buscarPorId(id: string): Promise<Cultivo | null> {
    const registro = await this.prisma.cultivo.findUnique({
      where: { id, deletedAt: null },
    });
    return registro ? this.mapearAEntidad(registro) : null;
  }

  async buscarPorNombre(nombre: string): Promise<Cultivo | null> {
    const registro = await this.prisma.cultivo.findFirst({
      where: {
        nombre: { equals: nombre, mode: 'insensitive' },
        deletedAt: null,
      },
    });
    return registro ? this.mapearAEntidad(registro) : null;
  }

  async crear(cultivo: Cultivo): Promise<Cultivo> {
    const registro = await this.prisma.cultivo.create({
      data: {
        nombre: cultivo.nombre,
        nombreCientifico: cultivo.nombreCientifico,
        variedadesDefault: cultivo.variedadesDefault,
        colorHex: cultivo.colorHex,
        activo: cultivo.activo,
      },
    });
    return this.mapearAEntidad(registro);
  }

  async actualizar(id: string, datos: Partial<CultivoProps>): Promise<Cultivo> {
    const registro = await this.prisma.cultivo.update({
      where: { id },
      data: {
        ...(datos.nombre !== undefined && { nombre: datos.nombre }),
        ...(datos.nombreCientifico !== undefined && { nombreCientifico: datos.nombreCientifico }),
        ...(datos.variedadesDefault !== undefined && { variedadesDefault: datos.variedadesDefault }),
        ...(datos.colorHex !== undefined && { colorHex: datos.colorHex }),
        ...(datos.activo !== undefined && { activo: datos.activo }),
      },
    });
    return this.mapearAEntidad(registro);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.cultivo.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        activo: false,
      },
    });
  }

  async tieneParcelasAsociadas(id: string): Promise<boolean> {
    const cuenta = await this.prisma.parcela.count({
      where: {
        cultivoId: id,
        deletedAt: null,
      },
    });
    return cuenta > 0;
  }
}
