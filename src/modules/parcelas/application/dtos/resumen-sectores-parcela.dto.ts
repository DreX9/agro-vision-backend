import { ApiProperty } from '@nestjs/swagger';
import { SectorParcelaItemDto } from './sector-parcela-item.dto.js';

/**
 * @description Resumen agronómico de asignación de cultivos y distribución de superficie de una parcela.
 */
export class ResumenSectoresParcelaDto {
  @ApiProperty({ description: 'Identificador de la parcela matriz' })
  parcelaId!: string;

  @ApiProperty({ description: 'Código identificador de la parcela', example: 'P-001' })
  parcelaCodigo!: string;

  @ApiProperty({ description: 'Nombre descriptivo de la parcela', example: 'Lote Principal San Isidro' })
  parcelaNombre!: string;

  @ApiProperty({ description: 'Área total de la parcela matriz en hectáreas', example: 15.5 })
  areaTotalHectareas!: number;

  @ApiProperty({ description: 'Superficie total ya asignada a sectores de cultivo', example: 10.2 })
  areaAsignadaHectareas!: number;

  @ApiProperty({ description: 'Superficie libre aún disponible para cultivar', example: 5.3 })
  areaDisponibleHectareas!: number;

  @ApiProperty({ description: 'Porcentaje de ocupación del lote (0 - 100%)', example: 65.81 })
  porcentajeOcupado!: number;

  @ApiProperty({ description: 'Delimitación perimetral exterior de la parcela matriz' })
  delimitacionParcelaGeoJson?: unknown;

  @ApiProperty({ description: 'Latitud centro de la parcela' })
  latitudCentro?: number | null;

  @ApiProperty({ description: 'Longitud centro de la parcela' })
  longitudCentro?: number | null;

  @ApiProperty({
    description: 'Lista de sectores y áreas de cultivo delimitadas',
    type: [SectorParcelaItemDto],
  })
  sectores!: SectorParcelaItemDto[];
}
