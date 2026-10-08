import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IParcelaRepositorio,
  PARCELA_REPOSITORIO_PORT,
} from '../../domain/ports/parcela-repositorio.port.js';
import {
  ParcelaError,
  ParcelaNoEncontradaError,
} from '../../domain/errors/parcela.errors.js';

/**
 * @description Caso de uso para eliminar lógicamente una parcela del sistema.
 */
@Injectable()
export class EliminarParcelaCasoUso {
  private readonly logger = new Logger(EliminarParcelaCasoUso.name);

  constructor(
    @Inject(PARCELA_REPOSITORIO_PORT)
    private readonly parcelaRepositorio: IParcelaRepositorio,
  ) {}

  /**
   * @description Ejecuta la baja lógica de la parcela.
   */
  async ejecutar(id: string): Promise<Result<boolean, ParcelaError>> {
    this.logger.log(`Eliminando parcela con ID: ${id}`);

    const parcela = await this.parcelaRepositorio.buscarPorId(id);
    if (!parcela) {
      return Result.fail(new ParcelaNoEncontradaError(id));
    }

    const eliminado = await this.parcelaRepositorio.eliminar(id);
    return Result.ok(eliminado);
  }
}
