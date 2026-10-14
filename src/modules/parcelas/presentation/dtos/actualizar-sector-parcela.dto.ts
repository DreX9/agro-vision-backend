import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsOptional,
  IsUUID,
  MaxLength,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { EstadoParcela } from '@prisma/client';

export class ActualizarSectorParcelaDto {
  @ApiPropertyOptional({
    description: 'Nombre o denominación del sector de cultivo',
    example: 'Sector A - Palto Hass',
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres' })
  readonly nombre?: string;

  @ApiPropertyOptional({
    description: 'Identificador UUID del cultivo a instalar',
    example: '018f9c10-8b9a-7a2e-8e39-16a3f9e9d123',
  })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador del cultivo debe ser un UUID válido' })
  readonly cultivoId?: string;

  @ApiPropertyOptional({
    description: 'Variedad específica del cultivo',
    example: 'Hass',
  })
  @IsOptional()
  @IsString({ message: 'La variedad debe ser una cadena de texto' })
  @MaxLength(100, { message: 'La variedad no puede superar los 100 caracteres' })
  readonly variedad?: string;

  @ApiPropertyOptional({
    description: 'Superficie calculada en hectáreas delimitada en el mapa satelital',
    example: 4.5,
  })
  @IsOptional()
  @IsNumber({}, { message: 'El área debe ser un valor numérico' })
  @IsPositive({ message: 'El área debe ser mayor a 0 hectáreas' })
  readonly areaHectareas?: number;

  @ApiPropertyOptional({
    description: 'Color distintivo hexadecimal para el sector en el mapa',
    example: '#15803D',
  })
  @IsOptional()
  @IsString({ message: 'El color debe ser una cadena de texto' })
  @MaxLength(7, { message: 'El código de color no puede superar los 7 caracteres' })
  readonly colorHex?: string;

  @ApiPropertyOptional({
    description: 'Delimitación espacial perimetral (Array de vértices con latitud y longitud)',
  })
  @IsOptional()
  readonly delimitacionGeoJson?: unknown;

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

  @ApiPropertyOptional({ description: 'Estado agronómico del sector', enum: EstadoParcela })
  @IsOptional()
  @IsEnum(EstadoParcela, { message: 'Estado agronómico no válido' })
  readonly estado?: EstadoParcela;
}
