import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Cultivo } from '../../domain/entities/cultivo.entity.js';

/**
 * @description DTO de respuesta para un cultivo agrícola.
 */
export class CultivoItemDto {
  @ApiProperty({ description: 'ID del cultivo', example: '018f3a2c-1234-7abc-9def-0123456789ab' })
  id!: string;

  @ApiProperty({ description: 'Nombre común', example: 'Palta' })
  nombre!: string;

  @ApiPropertyOptional({ description: 'Nombre científico', example: 'Persea americana' })
  nombreCientifico?: string | null;

  @ApiProperty({ description: 'Variedades sugeridas', example: ['Hass', 'Fuerte'] })
  variedadesDefault!: string[];

  @ApiPropertyOptional({ description: 'Color hex distintivo', example: '#546B41' })
  colorHex?: string | null;

  @ApiProperty({ description: 'Estado activo', example: true })
  activo!: boolean;

  static desdeEntidad(cultivo: Cultivo): CultivoItemDto {
    const dto = new CultivoItemDto();
    dto.id = cultivo.id;
    dto.nombre = cultivo.nombre;
    dto.nombreCientifico = cultivo.nombreCientifico;
    dto.variedadesDefault = cultivo.variedadesDefault;
    dto.colorHex = cultivo.colorHex;
    dto.activo = cultivo.activo;
    return dto;
  }
}
