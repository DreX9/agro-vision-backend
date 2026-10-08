import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

/**
 * @description DTO para activar o suspender una cuenta de usuario.
 */
export class CambiarEstadoUsuarioDto {
  @ApiProperty({ example: false, description: 'Nuevo estado de activación de la cuenta' })
  @IsNotEmpty({ message: 'El estado activo es requerido' })
  @IsBoolean({ message: 'El estado activo debe ser un valor booleano (true/false)' })
  activo: boolean;
}
