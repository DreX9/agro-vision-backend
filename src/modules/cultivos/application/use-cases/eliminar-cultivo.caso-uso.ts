import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type ICultivoRepositorio,
  CULTIVO_REPOSITORIO_PORT,
} from '../../domain/ports/cultivo-repositorio.port.js';
import {
  CultivoError,
  CultivoNoEncontradoError,
  CultivoEnUsoError,
} from '../../domain/errors/cultivo.errors.js';

/**
 * @description Caso de uso para eliminar (soft delete) un cultivo si no tiene parcelas asociadas.
 */
@Injectable()
export class EliminarCultivoCasoUso {
  private readonly logger = new Logger(EliminarCultivoCasoUso.name);

  constructor(
    @Inject(CULTIVO_REPOSITORIO_PORT)
    private readonly cultivoRepositorio: ICultivoRepositorio,
  ) {}

  /**
   * @description Elimina un cultivo validando que no esté asociado a parcelas existentes.
   */
  async ejecutar(id: string): Promise<Result<void, CultivoError>> {
    this.logger.log(`Eliminando cultivo con ID: ${id}`);

    const cultivo = await this.cultivoRepositorio.buscarPorId(id);
    if (!cultivo) {
      return Result.fail(new CultivoNoEncontradoError(id));
    }

    const enUso = await this.cultivoRepositorio.tieneParcelasAsociadas(id);
    if (enUso) {
      return Result.fail(new CultivoEnUsoError(id));
    }

    await this.cultivoRepositorio.eliminar(id);
    return Result.ok(undefined);
  }
}
