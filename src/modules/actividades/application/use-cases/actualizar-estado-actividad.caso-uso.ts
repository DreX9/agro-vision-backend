import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IActividadRepositorio,
  ACTIVIDAD_REPOSITORIO_PORT,
} from '../../domain/ports/actividad-repositorio.port.js';
import { ActualizarEstadoActividadCommand } from '../commands/actualizar-estado-actividad.command.js';
import { ActividadDetalleDto } from '../dtos/actividad-detalle.dto.js';
import {
  ActividadError,
  ActividadNoEncontradaError,
} from '../../domain/errors/actividad.errors.js';

/**
 * @description Caso de uso para cambiar el estado de una actividad (PENDIENTE, EN_PROGRESO, COMPLETADA, CANCELADA).
 */
@Injectable()
export class ActualizarEstadoActividadCasoUso {
  private readonly logger = new Logger(ActualizarEstadoActividadCasoUso.name);

  constructor(
    @Inject(ACTIVIDAD_REPOSITORIO_PORT)
    private readonly actividadRepositorio: IActividadRepositorio,
  ) {}

  async ejecutar(
    comando: ActualizarEstadoActividadCommand,
  ): Promise<Result<ActividadDetalleDto, ActividadError>> {
    this.logger.log(`Cambiando estado de actividad ${comando.id} a ${comando.estado}`);

    const actividad = await this.actividadRepositorio.buscarPorId(comando.id);
    if (!actividad) {
      return Result.fail(new ActividadNoEncontradaError(comando.id));
    }

    const actualizada = await this.actividadRepositorio.actualizarEstado(comando.id, comando.estado);
    if (!actualizada) {
      return Result.fail(new ActividadNoEncontradaError(comando.id));
    }

    return Result.ok(ActividadDetalleDto.desdeEntidad(actualizada));
  }
}
