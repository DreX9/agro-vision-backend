import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsDateString,
} from 'class-validator';
import { RolUsuario, SexoUsuario } from '@prisma/client';
import { EspecialidadAgricola } from '../../domain/entities/usuario.entity.js';

/**
 * @description DTO para la creación de un nuevo usuario en el sistema.
 */
export class CrearUsuarioDto {
  @ApiProperty({ example: 'Carlos', description: 'Nombres del usuario' })
  @IsNotEmpty({ message: 'Los nombres son requeridos' })
  @IsString({ message: 'Los nombres deben ser una cadena de texto' })
  nombres: string;

  @ApiProperty({ example: 'Mendoza Ruiz', description: 'Apellidos del usuario' })
  @IsNotEmpty({ message: 'Los apellidos son requeridos' })
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  apellidos: string;

  @ApiProperty({ example: 'carlos.mendoza@agrovision.pe', description: 'Correo electrónico' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  correo: string;

  @ApiProperty({ example: 'claveSegura123', description: 'Contraseña de acceso' })
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @MinLength(4, { message: 'La contraseña debe tener al menos 4 caracteres' })
  password: string;

  @ApiProperty({
    example: 'ADMINISTRADOR',
    enum: RolUsuario,
    description: 'Rol funcional asignado al usuario',
  })
  @IsNotEmpty({ message: 'El rol es requerido' })
  @IsEnum(RolUsuario, { message: 'El rol seleccionado no es válido' })
  rol: RolUsuario;

  @ApiProperty({
    example: 'MASCULINO',
    enum: SexoUsuario,
    required: false,
    description: 'Sexo del usuario',
  })
  @IsOptional()
  @IsEnum(SexoUsuario, { message: 'El sexo seleccionado no es válido' })
  sexo?: SexoUsuario;

  @ApiProperty({
    example: '1992-08-20',
    required: false,
    description: 'Fecha de nacimiento (formato YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha de nacimiento debe tener un formato de fecha válido' })
  fechaNacimiento?: string;

  @ApiProperty({ example: '+51 987654321', required: false, description: 'Teléfono de contacto' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono?: string;

  @ApiProperty({ example: 'Carretera Panamericana Sur Km 300', required: false, description: 'Dirección' })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser una cadena de texto' })
  direccion?: string;

  @ApiProperty({ example: 'Ica', required: false, description: 'Departamento' })
  @IsOptional()
  @IsString({ message: 'El departamento debe ser una cadena de texto' })
  departamento?: string;

  @ApiProperty({ example: 'Ica', required: false, description: 'Provincia' })
  @IsOptional()
  @IsString({ message: 'La provincia debe ser una cadena de texto' })
  provincia?: string;

  @ApiProperty({ example: 'EMP-001', required: false, description: 'Código único de empleado / fotocheck' })
  @IsOptional()
  @IsString({ message: 'El código de empleado debe ser una cadena de texto' })
  codigoEmpleado?: string;

  @ApiProperty({ example: '72345678', required: false, description: 'Número de documento de identidad (DNI/CE)' })
  @IsOptional()
  @IsString({ message: 'El número de documento debe ser una cadena de texto' })
  numeroDocumento?: string;

  @ApiProperty({
    example: 'PODADOR',
    enum: EspecialidadAgricola,
    required: false,
    description: 'Especialidad agrícola en campo',
  })
  @IsOptional()
  @IsEnum(EspecialidadAgricola, { message: 'La especialidad seleccionada no es válida' })
  especialidad?: EspecialidadAgricola;

  @ApiProperty({ example: 'Cuadrilla 1 - Poda', required: false, description: 'Nombre o código de la cuadrilla asignada' })
  @IsOptional()
  @IsString({ message: 'La cuadrilla debe ser una cadena de texto' })
  cuadrilla?: string;
}
