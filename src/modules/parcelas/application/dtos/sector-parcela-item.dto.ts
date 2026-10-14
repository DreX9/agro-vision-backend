import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoParcela } from '@prisma/client';

/**
 * @description DTO de lectura para un sector o sub-área de cultivo de una parcela.
 */
export class SectorParcelaItemDto {
  @ApiProperty({ description: 'Identificador único del sector' })
  id!: string;

  @ApiProperty({ description: 'Código único dentro de la parcela', example: 'P-001-S01' })
  codigo!: string;

  @ApiProperty({ description: 'Nombre descriptivo del sector', example: 'Sector A - Palto Hass' })
  nombre!: string;

  @ApiProperty({ description: 'Superficie delimitada en hectáreas', example: 4.5 })
  areaHectareas!: number;

  @ApiPropertyOptional({ description: 'Color distintivo hexadecimal', example: '#15803D' })
  colorHex?: string | null;

  @ApiProperty({ description: 'Identificador de la parcela matriz' })
  parcelaId!: string;

  @ApiPropertyOptional({ description: 'Código de la parcela matriz', example: 'P-001' })
  parcelaCodigo?: string | null;

  @ApiPropertyOptional({ description: 'Nombre de la parcela matriz', example: 'Fundo Santa Rosa 01' })
  parcelaNombre?: string | null;

  @ApiProperty({ description: 'Identificador del cultivo asignado' })
  cultivoId!: string;

  @ApiPropertyOptional({ description: 'Nombre del cultivo', example: 'Palto' })
  cultivoNombre?: string | null;

  @ApiPropertyOptional({ description: 'Color distintivo del cultivo', example: '#15803D' })
  cultivoColorHex?: string | null;

  @ApiPropertyOptional({ description: 'Variedad instalada', example: 'Hass' })
  variedad?: string | null;

  @ApiPropertyOptional({ description: 'Delimitación espacial (GeoJSON o Array de coordenadas)' })
  delimitacionGeoJson?: unknown;

  @ApiPropertyOptional({ description: 'Latitud del centroide', example: -13.0768 })
  latitudCentro?: number | null;

  @ApiPropertyOptional({ description: 'Longitud del centroide', example: -76.3854 })
  longitudCentro?: number | null;

  @ApiPropertyOptional({ description: 'Fecha de siembra o instalación' })
  fechaSiembra?: Date | null;

  @ApiPropertyOptional({ description: 'Fecha estimada de cosecha' })
  fechaCosechaEstimada?: Date | null;

  @ApiProperty({ description: 'Estado agronómico del sector', enum: EstadoParcela })
  estado!: EstadoParcela;

  @ApiProperty({ description: 'Fecha de registro' })
  createdAt!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  updatedAt!: Date;
}
