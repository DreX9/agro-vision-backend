import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IActividadRepositorio,
  ACTIVIDAD_REPOSITORIO_PORT,
} from '../../domain/ports/actividad-repositorio.port.js';
import {
  ActividadError,
  ActividadNoEncontradaError,
} from '../../domain/errors/actividad.errors.js';

/**
 * @description Caso de uso para eliminar lógicamente una actividad agrícola.
 */
@Injectable()
export class EliminarActividadCasoUso {
  private readonly logger = new Logger(EliminarActividadCasoUso.name);

  constructor(
    @Inject(ACTIVIDAD_REPOSITORIO_PORT)
    private readonly actividadRepositorio: IActividadRepositorio,
  ) {}

  async ejecutar(id: string): Promise<Result<boolean, ActividadError>> {
    this.logger.log(`Eliminando actividad ID: ${id}`);

    const actividad = await this.actividadRepositorio.buscarPorId(id);
    if (!actividad) {
      return Result.fail(new ActividadNoEncontradaError(id));
    }

    const eliminado = await this.actividadRepositorio.eliminar(id);
    return Result.ok(eliminado);
  }
}
