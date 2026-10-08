import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { EstadoParcela } from '@prisma/client';

/**
 * @description DTO para el cambio de estado de una parcela.
 */
export class ActualizarEstadoParcelaDto {
  @ApiProperty({ description: 'Nuevo estado operativo', enum: EstadoParcela })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @IsEnum(EstadoParcela, { message: 'El estado provisto no es válido' })
  readonly estado!: EstadoParcela;
}
