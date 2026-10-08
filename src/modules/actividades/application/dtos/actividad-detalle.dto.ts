import { ApiProperty } from '@nestjs/swagger';
import { TipoActividad, EstadoActividad } from '@prisma/client';
import { ActividadAgricola } from '../../domain/entities/actividad-agricola.entity.js';

export class TrabajadorDetalleDto {
  @ApiProperty() readonly id!: string;
  @ApiProperty() readonly usuarioId!: string;
  @ApiProperty() readonly nombres!: string;
  @ApiProperty() readonly apellidos!: string;
  @ApiProperty({ required: false }) readonly rolEnActividad?: string | null;
  @ApiProperty({ required: false }) readonly telefono?: string | null;
}

export class RecursoDetalleDto {
  @ApiProperty() readonly id!: string;
  @ApiProperty() readonly insumoId!: string;
  @ApiProperty() readonly nombreInsumo!: string;
  @ApiProperty() readonly categoriaInsumo!: string;
  @ApiProperty() readonly cantidadEstimada!: number;
  @ApiProperty() readonly unidadMedida!: string;
  @ApiProperty({ required: false }) readonly notas?: string | null;
}

/**
 * @description DTO de lectura completo para el detalle de una actividad con cuadrilla y recursos.
 */
export class ActividadDetalleDto {
  @ApiProperty() readonly id: string;
  @ApiProperty() readonly codigo: string;
  @ApiProperty() readonly titulo: string;
  @ApiProperty({ enum: TipoActividad }) readonly tipo: TipoActividad;
  @ApiProperty({ required: false }) readonly descripcion?: string | null;
  @ApiProperty({ required: false }) readonly observaciones?: string | null;
  @ApiProperty() readonly parcelaId: string;
  @ApiProperty({ required: false }) readonly parcelaNombre?: string;
  @ApiProperty({ required: false }) readonly cultivoNombre?: string;
  @ApiProperty({ required: false }) readonly usuarioResponsableId?: string | null;
  @ApiProperty({ required: false }) readonly usuarioResponsableNombre?: string | null;
  @ApiProperty() readonly fechaInicio: Date;
  @ApiProperty({ required: false }) readonly fechaFin?: Date | null;
  @ApiProperty({ enum: EstadoActividad }) readonly estado: EstadoActividad;
  @ApiProperty({ type: [TrabajadorDetalleDto] }) readonly trabajadores: TrabajadorDetalleDto[];
  @ApiProperty({ type: [RecursoDetalleDto] }) readonly recursos: RecursoDetalleDto[];
  @ApiProperty() readonly createdAt: Date;
  @ApiProperty() readonly updatedAt: Date;

  constructor(datos: ActividadDetalleDto) {
    this.id = datos.id;
    this.codigo = datos.codigo;
    this.titulo = datos.titulo;
    this.tipo = datos.tipo;
    this.descripcion = datos.descripcion;
    this.observaciones = datos.observaciones;
    this.parcelaId = datos.parcelaId;
    this.parcelaNombre = datos.parcelaNombre;
    this.cultivoNombre = datos.cultivoNombre;
    this.usuarioResponsableId = datos.usuarioResponsableId;
    this.usuarioResponsableNombre = datos.usuarioResponsableNombre;
    this.fechaInicio = datos.fechaInicio;
    this.fechaFin = datos.fechaFin;
    this.estado = datos.estado;
    this.trabajadores = datos.trabajadores;
    this.recursos = datos.recursos;
    this.createdAt = datos.createdAt;
    this.updatedAt = datos.updatedAt;
  }

  static desdeEntidad(actividad: ActividadAgricola): ActividadDetalleDto {
    return new ActividadDetalleDto({
      id: actividad.id,
      codigo: actividad.codigo,
      titulo: actividad.titulo,
      tipo: actividad.tipo,
      descripcion: actividad.descripcion,
      observaciones: actividad.observaciones,
      parcelaId: actividad.parcelaId,
      parcelaNombre: actividad.parcelaNombre,
      cultivoNombre: actividad.cultivoNombre,
      usuarioResponsableId: actividad.usuarioResponsableId,
      usuarioResponsableNombre: actividad.usuarioResponsableNombre,
      fechaInicio: actividad.fechaInicio,
      fechaFin: actividad.fechaFin,
      estado: actividad.estado,
      trabajadores: actividad.trabajadores.map((t) => ({
        id: t.id,
        usuarioId: t.usuarioId,
        nombres: t.nombres,
        apellidos: t.apellidos,
        rolEnActividad: t.rolEnActividad,
        telefono: t.telefono,
      })),
      recursos: actividad.recursos.map((r) => ({
        id: r.id,
        insumoId: r.insumoId,
        nombreInsumo: r.nombreInsumo,
        categoriaInsumo: r.categoriaInsumo,
        cantidadEstimada: r.cantidadEstimada,
        unidadMedida: r.unidadMedida,
        notas: r.notas,
      })),
      createdAt: actividad.createdAt,
      updatedAt: actividad.updatedAt,
    });
  }
}
