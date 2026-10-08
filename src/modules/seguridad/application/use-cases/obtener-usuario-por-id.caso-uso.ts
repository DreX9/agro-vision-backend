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
 * @description Caso de uso para obtener los datos detallados de un usuario por su identificador UUID.
 */
@Injectable()
export class ObtenerUsuarioPorIdCasoUso {
  private readonly logger = new Logger(ObtenerUsuarioPorIdCasoUso.name);

  constructor(
    @Inject(USUARIO_REPOSITORIO_PORT)
    private readonly usuarioRepositorio: IUsuarioRepositorio,
  ) {}

  /**
   * @description Busca un usuario por ID y retorna su DTO de lectura.
   */
  async ejecutar(id: string): Promise<Result<UsuarioItemDto, AutenticacionError>> {
    this.logger.log(`Buscando usuario por ID: ${id}`);

    const usuario = await this.usuarioRepositorio.buscarPorId(id);
    if (!usuario) {
      this.logger.warn(`Usuario no encontrado: ${id}`);
      return Result.fail(new UsuarioNoEncontradoError(id));
    }

    return Result.ok(UsuarioItemDto.desdeEntidad(usuario));
  }
}
