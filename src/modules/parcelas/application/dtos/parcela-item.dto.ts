import { ApiProperty } from '@nestjs/swagger';
import { EstadoParcela } from '@prisma/client';
import { Parcela } from '../../domain/entities/parcela.entity.js';

/**
 * @description DTO de lectura para una parcela o lote agrícola.
 */
export class ParcelaItemDto {
  @ApiProperty({ description: 'Identificador único (UUID)' })
  readonly id: string;

  @ApiProperty({ description: 'Código único de la parcela (ej. P-001)' })
  readonly codigo: string;

  @ApiProperty({ description: 'Nombre descriptivo de la parcela' })
  readonly nombre: string;

  @ApiProperty({ description: 'Área calculada o ingresada en hectáreas (ha)' })
  readonly areaHectareas: number;

  @ApiProperty({ description: 'Identificador del cultivo asignado' })
  readonly cultivoId: string;

  @ApiProperty({ description: 'Nombre del cultivo asignado', required: false })
  readonly cultivoNombre?: string;

  @ApiProperty({ description: 'Color hexadecimal del cultivo asignado', required: false })
  readonly cultivoColorHex?: string | null;

  @ApiProperty({ description: 'Variedad del cultivo', required: false })
  readonly variedad?: string | null;

  @ApiProperty({ description: 'Identificador del usuario responsable / capataz', required: false })
  readonly usuarioResponsableId?: string | null;

  @ApiProperty({ description: 'Nombre del usuario responsable', required: false })
  readonly usuarioResponsableNombre?: string | null;

  @ApiProperty({ description: 'Ubicación o referencia', required: false })
  readonly ubicacion?: string | null;

  @ApiProperty({ description: 'Departamento', required: false })
  readonly departamento?: string | null;

  @ApiProperty({ description: 'Provincia', required: false })
  readonly provincia?: string | null;

  @ApiProperty({ description: 'Distrito', required: false })
  readonly distrito?: string | null;

  @ApiProperty({ description: 'Estado actual del lote', enum: EstadoParcela })
  readonly estado: EstadoParcela;

  @ApiProperty({ description: 'Geometría GeoJSON del polígono delimitado', required: false })
  readonly delimitacionGeoJson?: unknown;

  @ApiProperty({ description: 'Latitud del centro geográfico', required: false })
  readonly latitudCentro?: number | null;

  @ApiProperty({ description: 'Longitud del centro geográfico', required: false })
  readonly longitudCentro?: number | null;

  @ApiProperty({ description: 'Fecha de creación' })
  readonly createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  readonly updatedAt: Date;

  constructor(datos: ParcelaItemDto) {
    this.id = datos.id;
    this.codigo = datos.codigo;
    this.nombre = datos.nombre;
    this.areaHectareas = datos.areaHectareas;
    this.cultivoId = datos.cultivoId;
    this.cultivoNombre = datos.cultivoNombre;
    this.cultivoColorHex = datos.cultivoColorHex;
    this.variedad = datos.variedad;
    this.usuarioResponsableId = datos.usuarioResponsableId;
    this.usuarioResponsableNombre = datos.usuarioResponsableNombre;
    this.ubicacion = datos.ubicacion;
    this.departamento = datos.departamento;
    this.provincia = datos.provincia;
    this.distrito = datos.distrito;
    this.estado = datos.estado;
    this.delimitacionGeoJson = datos.delimitacionGeoJson;
    this.latitudCentro = datos.latitudCentro;
    this.longitudCentro = datos.longitudCentro;
    this.createdAt = datos.createdAt;
    this.updatedAt = datos.updatedAt;
  }

  /**
   * @description Mapea una entidad de dominio a su representación DTO.
   */
  static desdeEntidad(parcela: Parcela): ParcelaItemDto {
    return new ParcelaItemDto({
      id: parcela.id,
      codigo: parcela.codigo,
      nombre: parcela.nombre,
      areaHectareas: parcela.areaHectareas,
      cultivoId: parcela.cultivoId,
      cultivoNombre: parcela.cultivoNombre,
      cultivoColorHex: parcela.cultivoColorHex,
      variedad: parcela.variedad,
      usuarioResponsableId: parcela.usuarioResponsableId,
      usuarioResponsableNombre: parcela.usuarioResponsableNombre,
      ubicacion: parcela.ubicacion,
      departamento: parcela.departamento,
      provincia: parcela.provincia,
      distrito: parcela.distrito,
      estado: parcela.estado,
      delimitacionGeoJson: parcela.delimitacionGeoJson,
      latitudCentro: parcela.latitudCentro,
      longitudCentro: parcela.longitudCentro,
      createdAt: parcela.createdAt,
      updatedAt: parcela.updatedAt,
    });
  }
}
