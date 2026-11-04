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
  IsInt,
  Min,
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

  @ApiPropertyOptional({ description: 'Hora de inicio específica del operario (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'La hora de inicio debe tener formato fecha válido' })
  readonly horaInicio?: string;

  @ApiPropertyOptional({ description: 'Hora de fin específica del operario (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'La hora de fin debe tener formato fecha válido' })
  readonly horaFin?: string;

  @ApiPropertyOptional({ description: 'Horas asignadas estimadas', example: 3 })
  @IsOptional()
  @IsNumber({}, { message: 'Las horas asignadas deben ser un número' })
  readonly horasAsignadas?: number;
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

  @ApiPropertyOptional({ description: 'Dosis agronómica prescrita (ej. 1.5 L/ha o 200 ml/cil)', example: '1.5 L/ha' })
  @IsOptional()
  @IsString({ message: 'La dosis debe ser una cadena de texto' })
  @MaxLength(100, { message: 'La dosis no puede superar los 100 caracteres' })
  readonly dosis?: string;

  @ApiPropertyOptional({ description: 'Cantidad real consumida tras la ejecución', example: 4.8 })
  @IsOptional()
  @IsNumber({}, { message: 'La cantidad real debe ser un número' })
  readonly cantidadReal?: number;

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

  @ApiPropertyOptional({ description: 'Identificador UUID del sector o área de cultivo (opcional)' })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador del sector debe ser un UUID válido' })
  readonly sectorId?: string;

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

  @ApiPropertyOptional({ description: 'Blanco biológico o fitosanitario (ej. Oídium, Mosca de la fruta, Nutrición)', example: 'Oídium' })
  @IsOptional()
  @IsString({ message: 'El blanco biológico debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El blanco biológico no puede superar los 150 caracteres' })
  readonly blancoBiologico?: string;

  @ApiPropertyOptional({ description: 'Método o sistema de aplicación (ej. Foliar, Riego por goteo, Drench)', example: 'Foliar / Mochila' })
  @IsOptional()
  @IsString({ message: 'El método de aplicación debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El método de aplicación no puede superar los 100 caracteres' })
  readonly metodoAplicacion?: string;

  @ApiPropertyOptional({ description: 'Período de carencia en días antes de cosecha', example: 7 })
  @IsOptional()
  @IsInt({ message: 'Los días de carencia deben ser un número entero' })
  @Min(0, { message: 'Los días de carencia no pueden ser negativos' })
  readonly diasCarencia?: number;

  @ApiPropertyOptional({ description: 'Período de reingreso seguro en horas', example: 24 })
  @IsOptional()
  @IsInt({ message: 'Las horas de reingreso deben ser un número entero' })
  @Min(0, { message: 'Las horas de reingreso no pueden ser negativas' })
  readonly horasReingreso?: number;

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
