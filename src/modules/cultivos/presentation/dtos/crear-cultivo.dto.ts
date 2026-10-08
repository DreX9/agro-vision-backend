import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

/**
 * @description DTO para la creación de un nuevo cultivo en el catálogo.
 */
export class CrearCultivoDto {
  @ApiProperty({ description: 'Nombre del cultivo', example: 'Palta' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre del cultivo es requerido' })
  nombre!: string;

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
}
