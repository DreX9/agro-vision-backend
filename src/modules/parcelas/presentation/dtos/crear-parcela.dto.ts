import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
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
 * @description DTO para el registro de una nueva parcela agrícola.
 */
export class CrearParcelaDto {
  @ApiPropertyOptional({
    description: 'Código de la parcela (si se omite, se autogenera ej. P-001)',
    example: 'P-001',
  })
  @IsOptional()
  @IsString({ message: 'El código de la parcela debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El código no puede superar los 50 caracteres' })
  readonly codigo?: string;

  @ApiProperty({
    description: 'Nombre descriptivo de la parcela',
    example: 'Lote Norte - San Isidro',
  })
  @IsNotEmpty({ message: 'El nombre de la parcela es obligatorio' })
  @IsString({ message: 'El nombre de la parcela debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El nombre no puede superar los 150 caracteres' })
  readonly nombre!: string;

  @ApiProperty({
    description: 'Área calculada o asignada en hectáreas (ha)',
    example: 4.5,
  })
  @IsNotEmpty({ message: 'El área en hectáreas es obligatoria' })
  @IsNumber({}, { message: 'El área debe ser un valor numérico' })
  @IsPositive({ message: 'El área debe ser un número positivo mayor a 0' })
  readonly areaHectareas!: number;

  @ApiProperty({
    description: 'Identificador UUID del cultivo',
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

  @ApiPropertyOptional({
    description: 'Identificador UUID del responsable o capataz',
    example: '018f9c10-8b9a-7a2e-8e39-16a3f9e9d456',
  })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador del responsable debe ser un UUID válido' })
  readonly usuarioResponsableId?: string;

  @ApiPropertyOptional({
    description: 'Ubicación o referencia del predio',
    example: 'Fundo La Campiña Km 12',
  })
  @IsOptional()
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La ubicación no puede superar los 255 caracteres' })
  readonly ubicacion?: string;

  @ApiPropertyOptional({ description: 'Departamento', example: 'Lima' })
  @IsOptional()
  @IsString({ message: 'El departamento debe ser una cadena de texto' })
  readonly departamento?: string;

  @ApiPropertyOptional({ description: 'Provincia', example: 'Cañete' })
  @IsOptional()
  @IsString({ message: 'La provincia debe ser una cadena de texto' })
  readonly provincia?: string;

  @ApiPropertyOptional({ description: 'Distrito', example: 'San Vicente' })
  @IsOptional()
  @IsString({ message: 'El distrito debe ser una cadena de texto' })
  readonly distrito?: string;

  @ApiPropertyOptional({
    description: 'Estado operativo del lote',
    enum: EstadoParcela,
    default: EstadoParcela.ACTIVA,
  })
  @IsOptional()
  @IsEnum(EstadoParcela, { message: 'El estado provisto no es válido' })
  readonly estado?: EstadoParcela;

  @ApiPropertyOptional({
    description: 'Polígono en GeoJSON o array de vértices delimitados',
  })
  @IsOptional()
  readonly delimitacionGeoJson?: unknown;

  @ApiPropertyOptional({ description: 'Latitud del centroide', example: -13.0768 })
  @IsOptional()
  @IsNumber({}, { message: 'La latitud debe ser un valor numérico' })
  readonly latitudCentro?: number;

  @ApiPropertyOptional({ description: 'Longitud del centroide', example: -76.3854 })
  @IsOptional()
  @IsNumber({}, { message: 'La longitud debe ser un valor numérico' })
  readonly longitudCentro?: number;
}
