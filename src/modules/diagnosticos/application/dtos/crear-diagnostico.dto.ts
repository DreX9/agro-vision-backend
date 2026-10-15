import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { EstadoSaludFoliar } from '@prisma/client';

export class CrearDiagnosticoDto {
  @ApiProperty({ description: 'ID de la parcela matriz donde se realizó el monitoreo', format: 'uuid' })
  @IsUUID('all', { message: 'El ID de la parcela debe ser un UUID válido' })
  parcelaId!: string;

  @ApiPropertyOptional({ description: 'ID del sector o lote específico (opcional)', format: 'uuid' })
  @IsOptional()
  @IsUUID('all', { message: 'El ID del sector debe ser un UUID válido' })
  sectorId?: string;

  @ApiPropertyOptional({ description: 'ID del usuario / operador que registró el diagnóstico' })
  @IsOptional()
  @IsUUID('all', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId?: string;

  @ApiProperty({ description: 'Latitud geográfica de la detección', example: -11.984512 })
  @IsNumber({}, { message: 'La latitud debe ser un número decimal válido' })
  latitud!: number;

  @ApiProperty({ description: 'Longitud geográfica de la detección', example: -77.054321 })
  @IsNumber({}, { message: 'La longitud debe ser un número decimal válido' })
  longitud!: number;

  @ApiProperty({
    description: 'Estado de salud foliar evaluado por la IA',
    enum: EstadoSaludFoliar,
    example: EstadoSaludFoliar.OPTIMO,
  })
  @IsEnum(EstadoSaludFoliar, { message: 'Estado general inválido' })
  estadoGeneral!: EstadoSaludFoliar;

  @ApiProperty({ description: 'Porcentaje estimado de salud del cultivo (0 a 100)', example: 92 })
  @IsNumber({}, { message: 'El porcentaje de salud debe ser un número entero' })
  @Min(0)
  @Max(100)
  saludPorcentaje!: number;

  @ApiProperty({ description: 'Cantidad total de plagas o patógenos detectados', example: 1 })
  @IsNumber({}, { message: 'El total de plagas debe ser un número' })
  totalPlagasDetectadas!: number;

  @ApiPropertyOptional({ description: 'Detecciones con bounding boxes y confianza devueltas por IA' })
  @IsOptional()
  detecciones?: unknown;

  @ApiPropertyOptional({ description: 'Recomendaciones agronómicas automáticas sugeridas' })
  @IsOptional()
  recomendaciones?: unknown;

  @ApiPropertyOptional({ description: 'Tiempo de inferencia del modelo en milisegundos', example: 145 })
  @IsOptional()
  @IsNumber()
  tiempoProcesamientoMs?: number;

  @ApiPropertyOptional({ description: 'URL o base64 de la captura procesada' })
  @IsOptional()
  @IsString()
  imagenUrl?: string;

  @ApiPropertyOptional({ description: 'Dispositivo o fuente de captura', example: 'DRON_SIMULADO' })
  @IsOptional()
  @IsString()
  origenCaptura?: string;

  @ApiPropertyOptional({ description: 'Observaciones manuales del técnico u operario' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}
