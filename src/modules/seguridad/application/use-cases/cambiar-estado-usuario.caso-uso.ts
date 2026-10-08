import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import { UsuarioItemDto } from '../dtos/usuario-item.dto.js';
import {
  AutenticacionError,
  UsuarioNoEncontradoError,
} from '../../domain/errors/autenticacion.errors.js';
import {
  type IUsuarioRepositorio,
  USUARIO_REPOSITORIO_PORT,
} from '../../domain/ports/usuario-repositorio.port.js';

/**
 * @description Caso de uso para activar o desactivar una cuenta de usuario.
 */
@Injectable()
export class CambiarEstadoUsuarioCasoUso {
  private readonly logger = new Logger(CambiarEstadoUsuarioCasoUso.name);

  constructor(
    @Inject(USUARIO_REPOSITORIO_PORT)
    private readonly usuarioRepositorio: IUsuarioRepositorio,
  ) {}

  /**
   * @description Modifica el estado activo/inactivo del usuario.
   */
  async ejecutar(
    id: string,
    activo: boolean,
  ): Promise<Result<UsuarioItemDto, AutenticacionError>> {
    this.logger.log(`Cambiando estado de usuario ${id} a: ${activo ? 'ACTIVO' : 'INACTIVO'}`);

    const usuarioActualizado = await this.usuarioRepositorio.actualizarEstado(id, activo);
    if (!usuarioActualizado) {
      this.logger.warn(`Usuario no encontrado para cambio de estado: ${id}`);
      return Result.fail(new UsuarioNoEncontradoError(id));
    }

    return Result.ok(UsuarioItemDto.desdeEntidad(usuarioActualizado));
  }
}
