import { ApiProperty } from '@nestjs/swagger';
import { TipoActividad, EstadoActividad } from '@prisma/client';
import { ActividadAgricola } from '../../domain/entities/actividad-agricola.entity.js';

/**
 * @description DTO de lectura para la lista de actividades agrícolas.
 */
export class ActividadItemDto {
  @ApiProperty({ description: 'Identificador único UUID' })
  readonly id: string;

  @ApiProperty({ description: 'Código de actividad (ej. ACT-001)' })
  readonly codigo: string;

  @ApiProperty({ description: 'Título descriptivo de la labor' })
  readonly titulo: string;

  @ApiProperty({ description: 'Tipo de labor agrícola', enum: TipoActividad })
  readonly tipo: TipoActividad;

  @ApiProperty({ description: 'Identificador de la parcela' })
  readonly parcelaId: string;

  @ApiProperty({ description: 'Nombre de la parcela', required: false })
  readonly parcelaNombre?: string;

  @ApiProperty({ description: 'Cultivo de la parcela', required: false })
  readonly cultivoNombre?: string;

  @ApiProperty({ description: 'ID del responsable o supervisor', required: false })
  readonly usuarioResponsableId?: string | null;

  @ApiProperty({ description: 'Nombre completo del responsable', required: false })
  readonly usuarioResponsableNombre?: string | null;

  @ApiProperty({ description: 'Fecha programada de inicio' })
  readonly fechaInicio: Date;

  @ApiProperty({ description: 'Fecha programada de fin', required: false })
  readonly fechaFin?: Date | null;

  @ApiProperty({ description: 'Estado del ciclo de la actividad', enum: EstadoActividad })
  readonly estado: EstadoActividad;

  @ApiProperty({ description: 'Cantidad de trabajadores asignados a la cuadrilla' })
  readonly cantidadTrabajadores: number;

  @ApiProperty({ description: 'Cantidad de insumos o recursos planificados' })
  readonly cantidadRecursos: number;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  readonly createdAt: Date;

  constructor(datos: ActividadItemDto) {
    this.id = datos.id;
    this.codigo = datos.codigo;
    this.titulo = datos.titulo;
    this.tipo = datos.tipo;
    this.parcelaId = datos.parcelaId;
    this.parcelaNombre = datos.parcelaNombre;
    this.cultivoNombre = datos.cultivoNombre;
    this.usuarioResponsableId = datos.usuarioResponsableId;
    this.usuarioResponsableNombre = datos.usuarioResponsableNombre;
    this.fechaInicio = datos.fechaInicio;
    this.fechaFin = datos.fechaFin;
    this.estado = datos.estado;
    this.cantidadTrabajadores = datos.cantidadTrabajadores;
    this.cantidadRecursos = datos.cantidadRecursos;
    this.createdAt = datos.createdAt;
  }

  static desdeEntidad(actividad: ActividadAgricola): ActividadItemDto {
    return new ActividadItemDto({
      id: actividad.id,
      codigo: actividad.codigo,
      titulo: actividad.titulo,
      tipo: actividad.tipo,
      parcelaId: actividad.parcelaId,
      parcelaNombre: actividad.parcelaNombre,
      cultivoNombre: actividad.cultivoNombre,
      usuarioResponsableId: actividad.usuarioResponsableId,
      usuarioResponsableNombre: actividad.usuarioResponsableNombre,
      fechaInicio: actividad.fechaInicio,
      fechaFin: actividad.fechaFin,
      estado: actividad.estado,
      cantidadTrabajadores: actividad.cantidadTrabajadores,
      cantidadRecursos: actividad.recursos.length,
      createdAt: actividad.createdAt,
    });
  }
}
