import { Inject, Injectable, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IUsuarioRepositorio,
  USUARIO_REPOSITORIO_PORT,
} from '../../domain/ports/usuario-repositorio.port.js';
import {
  UsuarioNoEncontradoError,
  AutenticacionError,
} from '../../domain/errors/autenticacion.errors.js';

/**
 * @description Caso de uso para dar de baja lógica a un usuario del sistema.
 */
@Injectable()
export class EliminarUsuarioCasoUso {
  private readonly logger = new Logger(EliminarUsuarioCasoUso.name);

  constructor(
    @Inject(USUARIO_REPOSITORIO_PORT)
    private readonly usuarioRepositorio: IUsuarioRepositorio,
  ) {}

  /**
   * @description Realiza el soft-delete de un usuario por su ID.
   */
  async ejecutar(id: string): Promise<Result<boolean, AutenticacionError>> {
    this.logger.log(`Baja lógica para usuario ID: ${id}`);

    const usuario = await this.usuarioRepositorio.buscarPorId(id);
    if (!usuario) {
      return Result.fail(new UsuarioNoEncontradoError(id));
    }

    const exito = await this.usuarioRepositorio.eliminar(id);
    return Result.ok(exito);
  }
}
