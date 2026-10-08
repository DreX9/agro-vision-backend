import { ApiProperty } from '@nestjs/swagger';
import { CategoriaInsumo } from '@prisma/client';
import { Insumo } from '../../domain/entities/insumo.entity.js';

/**
 * @description DTO de lectura para un insumo o equipo agrícola.
 */
export class InsumoItemDto {
  @ApiProperty({ description: 'Identificador único UUID' })
  readonly id: string;

  @ApiProperty({ description: 'Código del insumo (ej. INS-001)' })
  readonly codigo: string;

  @ApiProperty({ description: 'Nombre descriptivo del insumo o equipo' })
  readonly nombre: string;

  @ApiProperty({ description: 'Categoría del insumo', enum: CategoriaInsumo })
  readonly categoria: CategoriaInsumo;

  @ApiProperty({ description: 'Unidad de medida (ej. kg, Litro, Saco 50kg, Unidad)' })
  readonly unidadMedida: string;

  @ApiProperty({ description: 'Descripción adicional', required: false })
  readonly descripcion?: string | null;

  @ApiProperty({ description: 'Indica si el insumo está activo' })
  readonly activo: boolean;

  constructor(datos: InsumoItemDto) {
    this.id = datos.id;
    this.codigo = datos.codigo;
    this.nombre = datos.nombre;
    this.categoria = datos.categoria;
    this.unidadMedida = datos.unidadMedida;
    this.descripcion = datos.descripcion;
    this.activo = datos.activo;
  }

  static desdeEntidad(insumo: Insumo): InsumoItemDto {
    return new InsumoItemDto({
      id: insumo.id,
      codigo: insumo.codigo,
      nombre: insumo.nombre,
      categoria: insumo.categoria,
      unidadMedida: insumo.unidadMedida,
      descripcion: insumo.descripcion,
      activo: insumo.activo,
    });
  }
}
