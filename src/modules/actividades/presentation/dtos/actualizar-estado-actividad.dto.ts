import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { EstadoActividad } from '@prisma/client';

/**
 * @description DTO para la actualización de estado de una actividad.
 */
export class ActualizarEstadoActividadDto {
  @ApiProperty({ description: 'Nuevo estado de la actividad', enum: EstadoActividad })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum(EstadoActividad, { message: 'El estado provisto no es válido' })
  readonly estado!: EstadoActividad;
}
