import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import { IniciarSesionCommand } from '../commands/iniciar-sesion.command.js';
import { UsuarioSesionDto } from '../dtos/usuario-sesion.dto.js';
import {
  AutenticacionError,
  CredencialesInvalidasError,
  UsuarioInactivoError,
} from '../../domain/errors/autenticacion.errors.js';
import {
  type IUsuarioRepositorio,
  USUARIO_REPOSITORIO_PORT,
} from '../../domain/ports/usuario-repositorio.port.js';
import {
  type IHashingServicio,
  HASHING_SERVICIO_PORT,
} from '../../domain/ports/hashing-servicio.port.js';
import {
  type ITokenServicio,
  TOKEN_SERVICIO_PORT,
} from '../../domain/ports/token-servicio.port.js';

/**
 * @description Caso de uso para validar credenciales y emitir tokens de autenticación de usuario.
 */
@Injectable()
export class IniciarSesionCasoUso {
  private readonly logger = new Logger(IniciarSesionCasoUso.name);

  constructor(
    @Inject(USUARIO_REPOSITORIO_PORT)
    private readonly usuarioRepositorio: IUsuarioRepositorio,
    @Inject(HASHING_SERVICIO_PORT)
    private readonly hashingServicio: IHashingServicio,
    @Inject(TOKEN_SERVICIO_PORT)
    private readonly tokenServicio: ITokenServicio,
  ) {}

  /**
   * @description Valida las credenciales de correo y contraseña para iniciar sesión.
   * @param comando Datos de acceso del usuario.
   * @returns Resultado con DTO de sesión o error tipado de dominio.
   */
  async ejecutar(
    comando: IniciarSesionCommand,
  ): Promise<Result<UsuarioSesionDto, AutenticacionError>> {
    const correoNormalizado = comando.correo.trim().toLowerCase();
    this.logger.log(`Intento de inicio de sesión para: ${correoNormalizado}`);

    const usuario = await this.usuarioRepositorio.buscarPorCorreo(correoNormalizado);
    if (!usuario) {
      this.logger.warn(`Usuario no encontrado: ${correoNormalizado}`);
      return Result.fail(new CredencialesInvalidasError());
    }

    if (!usuario.activo) {
      this.logger.warn(`Usuario inactivo: ${correoNormalizado}`);
      return Result.fail(new UsuarioInactivoError(correoNormalizado));
    }

    const passwordValido = await this.hashingServicio.comparar(
      comando.password,
      usuario.passwordHash,
    );

    if (!passwordValido) {
      this.logger.warn(`Contraseña incorrecta para: ${correoNormalizado}`);
      return Result.fail(new CredencialesInvalidasError());
    }

    const tokens = await this.tokenServicio.generarTokens({
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    this.logger.log(`Inicio de sesión exitoso para: ${usuario.correo} (${usuario.rol})`);
    return Result.ok(UsuarioSesionDto.crear(usuario, tokens));
  }
}
