import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

/**
 * @description DTO para filtros y paginación en el listado de usuarios.
 */
export class FiltroUsuariosDto {
  @ApiPropertyOptional({ description: 'Término de búsqueda por nombre, apellido o correo' })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser una cadena' })
  busqueda?: string;

  @ApiPropertyOptional({ description: 'Filtrar por rol de usuario' })
  @IsOptional()
  @IsString({ message: 'El rol debe ser una cadena' })
  rol?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado activo/inactivo' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano' })
  activo?: boolean;

  @ApiPropertyOptional({ example: 1, default: 1, description: 'Número de página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página mínima es 1' })
  pagina: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10, description: 'Cantidad de elementos por página' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite mínimo es 1' })
  limite: number = 10;
}
