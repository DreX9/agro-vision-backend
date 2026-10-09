import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type ICultivoRepositorio,
  CULTIVO_REPOSITORIO_PORT,
} from '../../domain/ports/cultivo-repositorio.port.js';
import { CultivoItemDto } from '../dtos/cultivo-item.dto.js';
import { CultivoError, CultivoNoEncontradoError } from '../../domain/errors/cultivo.errors.js';

/**
 * @description Caso de uso para obtener un cultivo por su identificador único.
 */
@Injectable()
export class ObtenerCultivoPorIdCasoUso {
  private readonly logger = new Logger(ObtenerCultivoPorIdCasoUso.name);

  constructor(
    @Inject(CULTIVO_REPOSITORIO_PORT)
    private readonly cultivoRepositorio: ICultivoRepositorio,
  ) {}

  /**
   * @description Consulta y retorna un cultivo específico por ID.
   */
  async ejecutar(id: string): Promise<Result<CultivoItemDto, CultivoError>> {
    this.logger.log(`Consultando detalles del cultivo con ID: ${id}`);
    const cultivo = await this.cultivoRepositorio.buscarPorId(id);

    if (!cultivo) {
      return Result.fail(new CultivoNoEncontradoError(id));
    }

    return Result.ok(CultivoItemDto.desdeEntidad(cultivo));
  }
}
