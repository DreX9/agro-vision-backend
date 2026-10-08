import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../domain/entities/usuario.entity.js';

/**
 * @description DTO de respuesta para la ficha individual y elementos de tabla de usuarios.
 */
export class UsuarioItemDto {
  @ApiProperty({ example: '018f4a12-88f2-7000-8000-000000000001', description: 'ID único UUIDv7' })
  id: string;

  @ApiProperty({ example: 'Juan', description: 'Nombres del usuario' })
  nombres: string;

  @ApiProperty({ example: 'Pérez Gómez', description: 'Apellidos del usuario' })
  apellidos: string;

  @ApiProperty({ example: 'Juan Pérez Gómez', description: 'Nombre completo' })
  nombreCompleto: string;

  @ApiProperty({ example: 'juan.perez@agrovision.pe', description: 'Correo electrónico institucional' })
  correo: string;

  @ApiProperty({ example: '+51 912345678', required: false, description: 'Teléfono' })
  telefono?: string | null;

  @ApiProperty({ example: 'ADMINISTRADOR', description: 'Rol asignado' })
  rol: string;

  @ApiProperty({ example: 'MASCULINO', required: false, enum: ['MASCULINO', 'FEMENINO', 'OTRO'] })
  sexo?: string | null;

  @ApiProperty({ example: '1990-05-15', required: false, description: 'Fecha de nacimiento' })
  fechaNacimiento?: string | null;

  @ApiProperty({ example: 'Av. Los Agrónomos 123', required: false, description: 'Dirección' })
  direccion?: string | null;

  @ApiProperty({ example: 'Ica', required: false, description: 'Departamento' })
  departamento?: string | null;

  @ApiProperty({ example: 'Ica', required: false, description: 'Provincia' })
  provincia?: string | null;

  @ApiProperty({ example: true, description: 'Estado de la cuenta' })
  activo: boolean;

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  static desdeEntidad(usuario: Usuario): UsuarioItemDto {
    const dto = new UsuarioItemDto();
    dto.id = usuario.id;
    dto.nombres = usuario.nombres;
    dto.apellidos = usuario.apellidos;
    dto.nombreCompleto = usuario.nombreCompleto;
    dto.correo = usuario.correo;
    dto.telefono = usuario.telefono;
    dto.rol = usuario.rol;
    dto.sexo = usuario.sexo;
    dto.fechaNacimiento = usuario.fechaNacimiento
      ? usuario.fechaNacimiento.toISOString().split('T')[0]
      : null;
    dto.direccion = usuario.direccion;
    dto.departamento = usuario.departamento;
    dto.provincia = usuario.provincia;
    dto.activo = usuario.activo;
    dto.createdAt = usuario.createdAt;
    return dto;
  }
}
