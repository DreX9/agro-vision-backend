import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * @description DTO para la petición de inicio de sesión con validaciones estrictas en español.
 */
export class IniciarSesionDto {
  @ApiProperty({
    example: 'admin@santaelena.pe',
    description: 'Correo electrónico institucional registrado del usuario',
  })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido (ej. usuario@dominio.com)' })
  correo: string;

  @ApiProperty({
    example: '1234',
    description: 'Contraseña de acceso del usuario',
  })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto válida' })
  @MinLength(4, { message: 'La contraseña debe contener al menos 4 caracteres' })
  password: string;
}
