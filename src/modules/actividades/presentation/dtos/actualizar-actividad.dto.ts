import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsUUID,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoActividad, EstadoActividad } from '@prisma/client';
import { AsignarTrabajadorDto, AsignarRecursoDto } from './crear-actividad.dto.js';

/**
 * @description DTO para la actualización de una actividad agrícola existente.
 */
export class ActualizarActividadDto {
  @ApiPropertyOptional({ description: 'Título de la actividad' })
  @IsOptional()
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El título no puede superar los 150 caracteres' })
  readonly titulo?: string;

  @ApiPropertyOptional({ description: 'Tipo de labor agrícola', enum: TipoActividad })
  @IsOptional()
  @IsEnum(TipoActividad, { message: 'El tipo de labor no es válido' })
  readonly tipo?: TipoActividad;

  @ApiPropertyOptional({ description: 'Identificador UUID de la parcela' })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador de la parcela debe ser un UUID válido' })
  readonly parcelaId?: string;

  @ApiPropertyOptional({ description: 'Identificador UUID del sector o área de cultivo (opcional)' })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador del sector debe ser un UUID válido' })
  readonly sectorId?: string;

  @ApiPropertyOptional({ description: 'Fecha programada de inicio (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe tener formato válido' })
  readonly fechaInicio?: string;

  @ApiPropertyOptional({ description: 'Fecha programada de fin (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe tener formato válido' })
  readonly fechaFin?: string;

  @ApiPropertyOptional({ description: 'Identificador UUID del responsable' })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador del responsable debe ser un UUID válido' })
  readonly usuarioResponsableId?: string;

  @ApiPropertyOptional({ description: 'Descripción de la labor' })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  readonly descripcion?: string;

  @ApiPropertyOptional({ description: 'Observaciones' })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser texto' })
  readonly observaciones?: string;

  @ApiPropertyOptional({ description: 'Blanco biológico o fitosanitario', example: 'Oídium' })
  @IsOptional()
  @IsString({ message: 'El blanco biológico debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El blanco biológico no puede superar los 150 caracteres' })
  readonly blancoBiologico?: string;

  @ApiPropertyOptional({ description: 'Método o sistema de aplicación', example: 'Foliar / Mochila' })
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

  @ApiPropertyOptional({ description: 'Estado actual', enum: EstadoActividad })
  @IsOptional()
  @IsEnum(EstadoActividad, { message: 'El estado seleccionado no es válido' })
  readonly estado?: EstadoActividad;

  @ApiPropertyOptional({ description: 'Trabajadores asignados', type: [AsignarTrabajadorDto] })
  @IsOptional()
  @IsArray({ message: 'Los trabajadores deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => AsignarTrabajadorDto)
  readonly trabajadores?: AsignarTrabajadorDto[];

  @ApiPropertyOptional({ description: 'Recursos planificados', type: [AsignarRecursoDto] })
  @IsOptional()
  @IsArray({ message: 'Los recursos deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => AsignarRecursoDto)
  readonly recursos?: AsignarRecursoDto[];
}
