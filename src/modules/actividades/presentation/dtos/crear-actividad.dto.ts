import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoActividad, EstadoActividad } from '@prisma/client';

export class AsignarTrabajadorDto {
  @ApiProperty({ description: 'Identificador UUID del usuario/trabajador' })
  @IsNotEmpty({ message: 'El usuario trabajador es obligatorio' })
  @IsUUID('all', { message: 'El identificador del usuario debe ser un UUID válido' })
  readonly usuarioId!: string;

  @ApiPropertyOptional({ description: 'Rol específico en la labor (ej. Fumigador, Operador)' })
  @IsOptional()
  @IsString({ message: 'El rol debe ser una cadena de texto' })
  readonly rolEnActividad?: string;
}

export class AsignarRecursoDto {
  @ApiProperty({ description: 'Identificador UUID del insumo o equipo' })
  @IsNotEmpty({ message: 'El insumo o equipo es obligatorio' })
  @IsUUID('all', { message: 'El identificador del insumo debe ser un UUID válido' })
  readonly insumoId!: string;

  @ApiProperty({ description: 'Cantidad estimada planificada', example: 5 })
  @IsNotEmpty({ message: 'La cantidad estimada es obligatoria' })
  @IsNumber({}, { message: 'La cantidad debe ser un valor numérico' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  readonly cantidadEstimada!: number;

  @ApiProperty({ description: 'Unidad de medida', example: 'Litro' })
  @IsNotEmpty({ message: 'La unidad de medida es obligatoria' })
  @IsString({ message: 'La unidad de medida debe ser texto' })
  readonly unidadMedida!: string;

  @ApiPropertyOptional({ description: 'Notas u observaciones del insumo' })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser una cadena de texto' })
  readonly notas?: string;
}

/**
 * @description DTO para el registro de una nueva actividad agrícola.
 */
export class CrearActividadDto {
  @ApiPropertyOptional({ description: 'Código (opcional, autogenerado si se omite ej. ACT-001)' })
  @IsOptional()
  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MaxLength(50, { message: 'El código no puede superar los 50 caracteres' })
  readonly codigo?: string;

  @ApiProperty({ description: 'Título de la labor agrícola', example: 'Fumigación preventiva - Lote Norte' })
  @IsNotEmpty({ message: 'El título de la actividad es obligatorio' })
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El título no puede superar los 150 caracteres' })
  readonly titulo!: string;

  @ApiProperty({ description: 'Tipo de labor agrícola', enum: TipoActividad })
  @IsNotEmpty({ message: 'El tipo de labor es obligatorio' })
  @IsEnum(TipoActividad, { message: 'El tipo de labor no es válido' })
  readonly tipo!: TipoActividad;

  @ApiProperty({ description: 'Identificador UUID de la parcela' })
  @IsNotEmpty({ message: 'La parcela es obligatoria' })
  @IsUUID('all', { message: 'El identificador de la parcela debe ser un UUID válido' })
  readonly parcelaId!: string;

  @ApiProperty({ description: 'Fecha programada de inicio (ISO 8601)' })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  @IsDateString({}, { message: 'La fecha de inicio debe tener formato de fecha válido' })
  readonly fechaInicio!: string;

  @ApiPropertyOptional({ description: 'Fecha programada de finalización (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe tener formato de fecha válido' })
  readonly fechaFin?: string;

  @ApiPropertyOptional({ description: 'Identificador UUID del responsable o supervisor' })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador del responsable debe ser un UUID válido' })
  readonly usuarioResponsableId?: string;

  @ApiPropertyOptional({ description: 'Descripción detallada de la labor' })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  readonly descripcion?: string;

  @ApiPropertyOptional({ description: 'Observaciones agronómicas' })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser texto' })
  readonly observaciones?: string;

  @ApiPropertyOptional({ description: 'Estado inicial', enum: EstadoActividad, default: EstadoActividad.PENDIENTE })
  @IsOptional()
  @IsEnum(EstadoActividad, { message: 'El estado seleccionado no es válido' })
  readonly estado?: EstadoActividad;

  @ApiPropertyOptional({ description: 'Cuadrilla de trabajadores asignados', type: [AsignarTrabajadorDto] })
  @IsOptional()
  @IsArray({ message: 'Los trabajadores deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => AsignarTrabajadorDto)
  readonly trabajadores?: AsignarTrabajadorDto[];

  @ApiPropertyOptional({ description: 'Insumos y equipos requeridos', type: [AsignarRecursoDto] })
  @IsOptional()
  @IsArray({ message: 'Los recursos deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => AsignarRecursoDto)
  readonly recursos?: AsignarRecursoDto[];
}
