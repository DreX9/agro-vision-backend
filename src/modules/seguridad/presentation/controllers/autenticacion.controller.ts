import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IniciarSesionDto } from '../dtos/iniciar-sesion.dto.js';
import { IniciarSesionCasoUso } from '../../application/use-cases/iniciar-sesion.caso-uso.js';
import { IniciarSesionCommand } from '../../application/commands/iniciar-sesion.command.js';
import { UsuarioSesionDto } from '../../application/dtos/usuario-sesion.dto.js';
import {
  CredencialesInvalidasError,
  UsuarioInactivoError,
} from '../../domain/errors/autenticacion.errors.js';

/**
 * @description Controlador REST para la gestión de autenticación y sesiones.
 */
@ApiTags('Autenticación')
@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly iniciarSesionCasoUso: IniciarSesionCasoUso) {}

  /**
   * @description Endpoint para iniciar sesión con correo y contraseña.
   * @param dto Credenciales de acceso del usuario.
   * @returns Datos del usuario y tokens de acceso JWT.
   */
  @Post('iniciar-sesion')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión con credenciales de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Sesión iniciada con éxito',
    type: UsuarioSesionDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas (correo o contraseña incorrectos)',
  })
  @ApiResponse({
    status: 403,
    description: 'Cuenta inactiva o suspendida',
  })
  async iniciarSesion(@Body() dto: IniciarSesionDto): Promise<UsuarioSesionDto> {
    const comando = new IniciarSesionCommand(dto.correo, dto.password);
    const resultado = await this.iniciarSesionCasoUso.ejecutar(comando);

    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof CredencialesInvalidasError) {
        throw new UnauthorizedException(error.message);
      }
      if (error instanceof UsuarioInactivoError) {
        throw new ForbiddenException(error.message);
      }
      throw new UnauthorizedException('Error de autenticación.');
    }

    return resultado.value;
  }
}
