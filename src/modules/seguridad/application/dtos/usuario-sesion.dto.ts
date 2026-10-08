import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../../domain/entities/usuario.entity.js';

/**
 * @description DTO de respuesta con la información del usuario autenticado y tokens de sesión.
 */
export class UsuarioSesionDto {
  @ApiProperty({ example: '018f4a12-88f2-7000-8000-000000000001', description: 'Identificador único del usuario (UUIDv7)' })
  id: string;

  @ApiProperty({ example: 'Administrador', description: 'Nombres del usuario' })
  nombres: string;

  @ApiProperty({ example: 'Santa Elena', description: 'Apellidos del usuario' })
  apellidos: string;

  @ApiProperty({ example: 'admin@santaelena.pe', description: 'Correo electrónico institucional' })
  correo: string;

  @ApiProperty({ example: 'ADMINISTRADOR', description: 'Rol asignado en el sistema' })
  rol: string;

  @ApiProperty({ example: '+51 987654321', required: false, description: 'Número de teléfono de contacto' })
  telefono?: string | null;

  @ApiProperty({ example: 'Fundo Santa Elena Km 45', required: false, description: 'Dirección física' })
  direccion?: string | null;

  @ApiProperty({ example: 'Ica', required: false, description: 'Departamento de residencia o labor' })
  departamento?: string | null;

  @ApiProperty({ example: 'Ica', required: false, description: 'Provincia de residencia o labor' })
  provincia?: string | null;

  @ApiProperty({ description: 'Token de acceso JWT de corta duración' })
  accessToken: string;

  @ApiProperty({ description: 'Token de refresco seguro' })
  refreshToken: string;

  @ApiProperty({ example: 900, description: 'Tiempo de vida del token en segundos' })
  expiraEn: number;

  static crear(
    usuario: Usuario,
    tokens: { accessToken: string; refreshToken: string; expiraEn: number },
  ): UsuarioSesionDto {
    const dto = new UsuarioSesionDto();
    dto.id = usuario.id;
    dto.nombres = usuario.nombres;
    dto.apellidos = usuario.apellidos;
    dto.correo = usuario.correo;
    dto.rol = usuario.rol;
    dto.telefono = usuario.telefono;
    dto.direccion = usuario.direccion;
    dto.departamento = usuario.departamento;
    dto.provincia = usuario.provincia;
    dto.accessToken = tokens.accessToken;
    dto.refreshToken = tokens.refreshToken;
    dto.expiraEn = tokens.expiraEn;
    return dto;
  }
}
