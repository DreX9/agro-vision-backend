import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsString, IsInt, IsBoolean, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class FiltrosDiagnosticosDto {
  @ApiPropertyOptional({ description: 'Filtrar por Parcela' })
  @IsOptional()
  @IsUUID()
  parcelaId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por Sector' })
  @IsOptional()
  @IsUUID()
  sectorId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado general' })
  @IsOptional()
  @IsString()
  estadoGeneral?: string;

  @ApiPropertyOptional({ description: 'Filtrar si constituye alerta fitosanitaria (true o false)' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  esAlerta?: boolean;

  @ApiPropertyOptional({ description: 'Número de página', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina?: number = 1;

  @ApiPropertyOptional({ description: 'Cantidad por página', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limite?: number = 20;
}
