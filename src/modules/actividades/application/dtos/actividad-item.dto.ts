import { ApiProperty } from '@nestjs/swagger';
import { TipoActividad, EstadoActividad } from '@prisma/client';
import { ActividadAgricola, TrabajadorAsignadoProps } from '../../domain/entities/actividad-agricola.entity.js';

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

  @ApiProperty({ description: 'Descripción detallada de la labor', required: false })
  readonly descripcion?: string | null;

  @ApiProperty({ description: 'Identificador de la parcela' })
  readonly parcelaId: string;

  @ApiProperty({ description: 'Nombre de la parcela', required: false })
  readonly parcelaNombre?: string;

  @ApiProperty({ description: 'Identificador del sector o área de cultivo', required: false })
  readonly sectorId?: string | null;

  @ApiProperty({ description: 'Nombre del sector o área de cultivo', required: false })
  readonly sectorNombre?: string | null;

  @ApiProperty({ description: 'Código del sector o área de cultivo', required: false })
  readonly sectorCodigo?: string | null;

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

  @ApiProperty({ description: 'Trabajadores asignados a la actividad', required: false })
  readonly trabajadores?: TrabajadorAsignadoProps[];

  @ApiProperty({ description: 'Cantidad de insumos o recursos planificados' })
  readonly cantidadRecursos: number;

  @ApiProperty({ description: 'Fecha de creación del registro' })
  readonly createdAt: Date;

  constructor(datos: ActividadItemDto) {
    this.id = datos.id;
    this.codigo = datos.codigo;
    this.titulo = datos.titulo;
    this.tipo = datos.tipo;
    this.descripcion = datos.descripcion;
    this.parcelaId = datos.parcelaId;
    this.parcelaNombre = datos.parcelaNombre;
    this.sectorId = datos.sectorId;
    this.sectorNombre = datos.sectorNombre;
    this.sectorCodigo = datos.sectorCodigo;
    this.cultivoNombre = datos.cultivoNombre;
    this.usuarioResponsableId = datos.usuarioResponsableId;
    this.usuarioResponsableNombre = datos.usuarioResponsableNombre;
    this.fechaInicio = datos.fechaInicio;
    this.fechaFin = datos.fechaFin;
    this.estado = datos.estado;
    this.cantidadTrabajadores = datos.cantidadTrabajadores;
    this.trabajadores = datos.trabajadores;
    this.cantidadRecursos = datos.cantidadRecursos;
    this.createdAt = datos.createdAt;
  }

  static desdeEntidad(actividad: ActividadAgricola): ActividadItemDto {
    return new ActividadItemDto({
      id: actividad.id,
      codigo: actividad.codigo,
      titulo: actividad.titulo,
      tipo: actividad.tipo,
      descripcion: actividad.descripcion,
      parcelaId: actividad.parcelaId,
      parcelaNombre: actividad.parcelaNombre,
      sectorId: actividad.sectorId,
      sectorNombre: actividad.sectorNombre,
      sectorCodigo: actividad.sectorCodigo,
      cultivoNombre: actividad.cultivoNombre,
      usuarioResponsableId: actividad.usuarioResponsableId,
      usuarioResponsableNombre: actividad.usuarioResponsableNombre,
      fechaInicio: actividad.fechaInicio,
      fechaFin: actividad.fechaFin,
      estado: actividad.estado,
      cantidadTrabajadores: actividad.cantidadTrabajadores,
      trabajadores: actividad.trabajadores,
      cantidadRecursos: actividad.recursos.length,
      createdAt: actividad.createdAt,
    });
  }
}
