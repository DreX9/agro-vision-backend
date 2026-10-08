import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { TipoActividad, EstadoActividad } from '@prisma/client';

/**
 * @description Parámetros de consulta y filtrado para el listado paginado de actividades.
 */
export class FiltroActividadesDto {
  @ApiPropertyOptional({ description: 'Término de búsqueda por título, código o descripción' })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  readonly busqueda?: string;

  @ApiPropertyOptional({ description: 'Filtrar por parcela' })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador de la parcela debe ser un UUID válido' })
  readonly parcelaId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por tipo de labor', enum: TipoActividad })
  @IsOptional()
  @IsEnum(TipoActividad, { message: 'El tipo seleccionado no es válido' })
  readonly tipo?: TipoActividad;

  @ApiPropertyOptional({ description: 'Filtrar por estado', enum: EstadoActividad })
  @IsOptional()
  @IsEnum(EstadoActividad, { message: 'El estado seleccionado no es válido' })
  readonly estado?: EstadoActividad;

  @ApiPropertyOptional({ description: 'Filtrar por responsable' })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador del responsable debe ser un UUID válido' })
  readonly usuarioResponsableId?: string;

  @ApiPropertyOptional({ description: 'Fecha desde (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha desde debe tener formato válido' })
  readonly fechaDesde?: string;

  @ApiPropertyOptional({ description: 'Fecha hasta (ISO 8601)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha hasta debe tener formato válido' })
  readonly fechaHasta?: string;

  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página mínima es 1' })
  readonly pagina: number = 1;

  @ApiPropertyOptional({ description: 'Límite de registros por página (10, 20 o 30)', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite mínimo es 1' })
  @Max(100, { message: 'El límite máximo permitido es 100' })
  readonly limite: number = 10;
}
