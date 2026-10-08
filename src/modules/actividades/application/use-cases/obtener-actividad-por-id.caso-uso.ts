import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IActividadRepositorio,
  ACTIVIDAD_REPOSITORIO_PORT,
} from '../../domain/ports/actividad-repositorio.port.js';
import { ActividadDetalleDto } from '../dtos/actividad-detalle.dto.js';
import {
  ActividadError,
  ActividadNoEncontradaError,
} from '../../domain/errors/actividad.errors.js';

/**
 * @description Caso de uso para obtener los detalles completos de una actividad, incluyendo trabajadores e insumos.
 */
@Injectable()
export class ObtenerActividadPorIdCasoUso {
  private readonly logger = new Logger(ObtenerActividadPorIdCasoUso.name);

  constructor(
    @Inject(ACTIVIDAD_REPOSITORIO_PORT)
    private readonly actividadRepositorio: IActividadRepositorio,
  ) {}

  async ejecutar(id: string): Promise<Result<ActividadDetalleDto, ActividadError>> {
    this.logger.log(`Consultando detalle de actividad ID: ${id}`);
    const actividad = await this.actividadRepositorio.buscarPorId(id);

    if (!actividad) {
      return Result.fail(new ActividadNoEncontradaError(id));
    }

    return Result.ok(ActividadDetalleDto.desdeEntidad(actividad));
  }
}
