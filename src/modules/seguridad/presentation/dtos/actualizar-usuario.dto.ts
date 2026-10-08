import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RolUsuario, SexoUsuario } from '@prisma/client';

/**
 * @description DTO de entrada para actualizar los datos de un usuario.
 */
export class ActualizarUsuarioDto {
  @ApiProperty({ description: 'Nombres del usuario', example: 'Carlos' })
  @IsString({ message: 'Los nombres deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los nombres son requeridos' })
  nombres!: string;

  @ApiProperty({ description: 'Apellidos del usuario', example: 'Mendoza' })
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  @IsNotEmpty({ message: 'Los apellidos son requeridos' })
  apellidos!: string;

  @ApiProperty({ description: 'Correo electrónico', example: 'carlos@santaelena.pe' })
  @IsEmail({}, { message: 'El correo electrónico no tiene un formato válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  correo!: string;

  @ApiPropertyOptional({
    description: 'Nueva contraseña (dejar en blanco para mantener la actual)',
    example: 'NuevaClave2026*',
  })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres' })
  password?: string;

  @ApiProperty({ enum: RolUsuario, description: 'Rol asignado', example: RolUsuario.AGRONOMO })
  @IsEnum(RolUsuario, { message: 'El rol seleccionado no es válido' })
  @IsNotEmpty({ message: 'El rol es requerido' })
  rol!: RolUsuario;

  @ApiPropertyOptional({ description: 'Teléfono de contacto', example: '+51 987654321' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser texto' })
  telefono?: string;

  @ApiPropertyOptional({ enum: SexoUsuario, description: 'Sexo del usuario', example: SexoUsuario.MASCULINO })
  @IsOptional()
  @IsEnum(SexoUsuario, { message: 'El sexo seleccionado no es válido' })
  sexo?: SexoUsuario;

  @ApiPropertyOptional({ description: 'Fecha de nacimiento en ISO 8601', example: '1990-05-15' })
  @IsOptional()
  @IsString({ message: 'La fecha de nacimiento debe ser una cadena válida' })
  fechaNacimiento?: string;

  @ApiPropertyOptional({ description: 'Dirección física', example: 'Av. Agrícola 450' })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser texto' })
  direccion?: string;

  @ApiPropertyOptional({ description: 'Departamento', example: 'Ica' })
  @IsOptional()
  @IsString({ message: 'El departamento debe ser texto' })
  departamento?: string;

  @ApiPropertyOptional({ description: 'Provincia', example: 'Ica' })
  @IsOptional()
  @IsString({ message: 'La provincia debe ser texto' })
  provincia?: string;
}
