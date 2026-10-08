import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoParcela } from '@prisma/client';

/**
 * @description Parámetros de consulta y filtrado para el listado paginado de parcelas.
 */
export class FiltroParcelasDto {
  @ApiPropertyOptional({ description: 'Término de búsqueda por nombre, código o ubicación' })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena de texto' })
  readonly busqueda?: string;

  @ApiPropertyOptional({ description: 'Filtrar por cultivo asignado' })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador del cultivo debe ser un UUID válido' })
  readonly cultivoId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado operativo', enum: EstadoParcela })
  @IsOptional()
  @IsEnum(EstadoParcela, { message: 'El estado seleccionado no es válido' })
  readonly estado?: EstadoParcela;

  @ApiPropertyOptional({ description: 'Filtrar por usuario responsable' })
  @IsOptional()
  @IsUUID('all', { message: 'El identificador del responsable debe ser un UUID válido' })
  readonly usuarioResponsableId?: string;

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
