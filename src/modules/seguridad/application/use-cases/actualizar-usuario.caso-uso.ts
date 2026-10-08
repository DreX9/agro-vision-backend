import { Inject, Injectable, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IUsuarioRepositorio,
  USUARIO_REPOSITORIO_PORT,
} from '../../domain/ports/usuario-repositorio.port.js';
import {
  type IHashingServicio,
  HASHING_SERVICIO_PORT,
} from '../../domain/ports/hashing-servicio.port.js';
import { Usuario } from '../../domain/entities/usuario.entity.js';
import { ActualizarUsuarioCommand } from '../commands/actualizar-usuario.command.js';
import { UsuarioItemDto } from '../dtos/usuario-item.dto.js';
import {
  CorreoYaRegistradoError,
  UsuarioNoEncontradoError,
  AutenticacionError,
} from '../../domain/errors/autenticacion.errors.js';

/**
 * @description Caso de uso para actualizar la información de un usuario existente.
 */
@Injectable()
export class ActualizarUsuarioCasoUso {
  private readonly logger = new Logger(ActualizarUsuarioCasoUso.name);

  constructor(
    @Inject(USUARIO_REPOSITORIO_PORT)
    private readonly usuarioRepositorio: IUsuarioRepositorio,
    @Inject(HASHING_SERVICIO_PORT)
    private readonly hashingServicio: IHashingServicio,
  ) {}

  /**
   * @description Ejecuta la actualización de datos del usuario, validando correo y encriptando contraseña opcional.
   */
  async ejecutar(
    comando: ActualizarUsuarioCommand,
  ): Promise<Result<UsuarioItemDto, AutenticacionError>> {
    this.logger.log(`Actualizando datos para usuario ID: ${comando.id}`);

    const usuarioExistente = await this.usuarioRepositorio.buscarPorId(comando.id);
    if (!usuarioExistente) {
      return Result.fail(new UsuarioNoEncontradoError(comando.id));
    }

    const correoNormalizado = comando.correo.trim().toLowerCase();
    if (correoNormalizado !== usuarioExistente.correo) {
      const correoOcupado = await this.usuarioRepositorio.buscarPorCorreo(correoNormalizado);
      if (correoOcupado && correoOcupado.id !== comando.id) {
        return Result.fail(new CorreoYaRegistradoError(correoNormalizado));
      }
    }

    let passwordHash = usuarioExistente.passwordHash;
    if (comando.password && comando.password.trim() !== '') {
      passwordHash = await this.hashingServicio.encriptar(comando.password.trim());
    }

    const usuarioActualizado = new Usuario({
      id: usuarioExistente.id,
      nombres: comando.nombres.trim(),
      apellidos: comando.apellidos.trim(),
      correo: correoNormalizado,
      telefono: comando.telefono?.trim() || null,
      passwordHash,
      rol: comando.rol,
      sexo: comando.sexo || null,
      fechaNacimiento: comando.fechaNacimiento || null,
      direccion: comando.direccion?.trim() || null,
      departamento: comando.departamento?.trim() || null,
      provincia: comando.provincia?.trim() || null,
      activo: usuarioExistente.activo,
      createdAt: usuarioExistente.createdAt,
      updatedAt: new Date(),
    });

    const guardado = await this.usuarioRepositorio.actualizar(usuarioActualizado);
    if (!guardado) {
      return Result.fail(new UsuarioNoEncontradoError(comando.id));
    }

    return Result.ok(UsuarioItemDto.desdeEntidad(guardado));
  }
}
