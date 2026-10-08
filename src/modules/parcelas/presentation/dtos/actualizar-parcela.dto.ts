import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsPositive,
  IsUUID,
  IsOptional,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { EstadoParcela } from '@prisma/client';

/**
 * @description DTO para la actualización de una parcela existente.
 */
export class ActualizarParcelaDto {
  @ApiPropertyOptional({ description: 'Nombre descriptivo de la parcela' })
  @IsOptional()
  @IsString({ message: 'El nombre de la parcela debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres' })
  readonly nombre?: string;

  @ApiPropertyOptional({ description: 'Área en hectáreas' })
  @IsOptional()
  @IsNumber({}, { message: 'El área debe ser un valor numérico' })
  @IsPositive({ message: 'El área debe ser un número positivo mayor a 0' })
  readonly areaHectareas?: number;

  @ApiPropertyOptional({ description: 'Identificador UUID del cultivo' })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador del cultivo debe ser un UUID válido' })
  readonly cultivoId?: string;

  @ApiPropertyOptional({ description: 'Variedad del cultivo' })
  @IsOptional()
  @IsString({ message: 'La variedad debe ser una cadena de texto' })
  @MaxLength(100, { message: 'La variedad no puede superar los 100 caracteres' })
  readonly variedad?: string;

  @ApiPropertyOptional({ description: 'Identificador UUID del responsable o capataz' })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador del responsable debe ser un UUID válido' })
  readonly usuarioResponsableId?: string;

  @ApiPropertyOptional({ description: 'Ubicación o referencia' })
  @IsOptional()
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La ubicación no puede superar los 255 caracteres' })
  readonly ubicacion?: string;

  @ApiPropertyOptional({ description: 'Departamento' })
  @IsOptional()
  @IsString({ message: 'El departamento debe ser una cadena de texto' })
  readonly departamento?: string;

  @ApiPropertyOptional({ description: 'Provincia' })
  @IsOptional()
  @IsString({ message: 'La provincia debe ser una cadena de texto' })
  readonly provincia?: string;

  @ApiPropertyOptional({ description: 'Distrito' })
  @IsOptional()
  @IsString({ message: 'El distrito debe ser una cadena de texto' })
  readonly distrito?: string;

  @ApiPropertyOptional({ description: 'Estado operativo', enum: EstadoParcela })
  @IsOptional()
  @IsEnum(EstadoParcela, { message: 'El estado provisto no es válido' })
  readonly estado?: EstadoParcela;

  @ApiPropertyOptional({ description: 'Polígono en GeoJSON o array de vértices' })
  @IsOptional()
  readonly delimitacionGeoJson?: unknown;

  @ApiPropertyOptional({ description: 'Latitud del centroide' })
  @IsOptional()
  @IsNumber({}, { message: 'La latitud debe ser un valor numérico' })
  readonly latitudCentro?: number;

  @ApiPropertyOptional({ description: 'Longitud del centroide' })
  @IsOptional()
  @IsNumber({}, { message: 'La longitud debe ser un valor numérico' })
  readonly longitudCentro?: number;
}
