import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUUID,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CrearSectorParcelaDto {
  @ApiPropertyOptional({
    description: 'Código del sector (autogenerado si se omite, ej. P-001-S01)',
    example: 'P-001-S01',
  })
  @IsOptional()
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El código no puede superar los 50 caracteres' })
  readonly codigo?: string;

  @ApiProperty({
    description: 'Nombre o denominación del sector de cultivo',
    example: 'Sector A - Palto Hass',
  })
  @IsNotEmpty({ message: 'El nombre del sector es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres' })
  readonly nombre!: string;

  @ApiProperty({
    description: 'Identificador UUID del cultivo a instalar',
    example: '018f9c10-8b9a-7a2e-8e39-16a3f9e9d123',
  })
  @IsNotEmpty({ message: 'El cultivo es obligatorio' })
  @IsUUID('all', { message: 'El identificador del cultivo debe ser un UUID válido' })
  readonly cultivoId!: string;

  @ApiPropertyOptional({
    description: 'Variedad específica del cultivo',
    example: 'Hass',
  })
  @IsOptional()
  @IsString({ message: 'La variedad debe ser una cadena de texto' })
  @MaxLength(100, { message: 'La variedad no puede superar los 100 caracteres' })
  readonly variedad?: string;

  @ApiProperty({
    description: 'Superficie calculada en hectáreas delimitada en el mapa satelital',
    example: 4.5,
  })
  @IsNotEmpty({ message: 'El área en hectáreas es obligatoria' })
  @IsNumber({}, { message: 'El área debe ser un valor numérico' })
  @IsPositive({ message: 'El área debe ser mayor a 0 hectáreas' })
  readonly areaHectareas!: number;

  @ApiPropertyOptional({
    description: 'Color distintivo hexadecimal para el sector en el mapa',
    example: '#15803D',
  })
  @IsOptional()
  @IsString({ message: 'El color debe ser una cadena de texto' })
  @MaxLength(7, { message: 'El código de color no puede superar los 7 caracteres' })
  readonly colorHex?: string;

  @ApiProperty({
    description: 'Delimitación espacial perimetral (Array de vértices con latitud y longitud)',
  })
  @IsNotEmpty({ message: 'La delimitación perimetral del sector es obligatoria' })
  readonly delimitacionGeoJson!: unknown;

  @ApiPropertyOptional({ description: 'Latitud del centroide', example: -13.0768 })
  @IsOptional()
  @IsNumber({}, { message: 'La latitud debe ser un número decimal' })
  readonly latitudCentro?: number;

  @ApiPropertyOptional({ description: 'Longitud del centroide', example: -76.3854 })
  @IsOptional()
  @IsNumber({}, { message: 'La longitud debe ser un número decimal' })
  readonly longitudCentro?: number;

  @ApiPropertyOptional({ description: 'Fecha de siembra o inicio de cultivo (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de siembra debe tener formato de fecha válido' })
  readonly fechaSiembra?: string;

  @ApiPropertyOptional({ description: 'Fecha estimada de cosecha (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de cosecha estimada debe tener formato de fecha válido' })
  readonly fechaCosechaEstimada?: string;
}
