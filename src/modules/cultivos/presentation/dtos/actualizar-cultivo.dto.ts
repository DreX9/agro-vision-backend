import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

/**
 * @description DTO para la actualización de un cultivo existente.
 */
export class ActualizarCultivoDto {
  @ApiPropertyOptional({ description: 'Nombre del cultivo', example: 'Palta Hass' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @ApiPropertyOptional({ description: 'Nombre científico', example: 'Persea americana' })
  @IsOptional()
  @IsString({ message: 'El nombre científico debe ser una cadena de texto' })
  nombreCientifico?: string;

  @ApiPropertyOptional({ description: 'Variedades por defecto', example: ['Hass', 'Fuerte'] })
  @IsOptional()
  @IsArray({ message: 'Las variedades deben ser un arreglo' })
  variedadesDefault?: string[];

  @ApiPropertyOptional({ description: 'Color hex distintivo', example: '#546B41' })
  @IsOptional()
  @IsString({ message: 'El color debe ser una cadena hexadecimal' })
  colorHex?: string;

  @ApiPropertyOptional({ description: 'Estado activo del cultivo', example: true })
  @IsOptional()
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;
}
