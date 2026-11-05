import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class SubActividadItemDto {
  @ApiProperty({ description: 'ID del operador asignado' })
  @IsUUID('7')
  @IsNotEmpty()
  operadorId: string;

  @ApiProperty({ description: 'Descripción de la tarea' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;
}

export class CrearSubActividadesDto {
  @ApiProperty({ type: [SubActividadItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubActividadItemDto)
  subActividades: SubActividadItemDto[];
}