import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IActividadRepositorio,
  ACTIVIDAD_REPOSITORIO_PORT,
} from '../../domain/ports/actividad-repositorio.port.js';
import { ActualizarActividadCommand } from '../commands/actualizar-actividad.command.js';
import { ActividadDetalleDto } from '../dtos/actividad-detalle.dto.js';
import { ActividadAgricola } from '../../domain/entities/actividad-agricola.entity.js';
import {
  ActividadError,
  ActividadNoEncontradaError,
} from '../../domain/errors/actividad.errors.js';

/**
 * @description Caso de uso para actualizar datos, cuadrilla o insumos de una actividad existente.
 */
@Injectable()
export class ActualizarActividadCasoUso {
  private readonly logger = new Logger(ActualizarActividadCasoUso.name);

  constructor(
    @Inject(ACTIVIDAD_REPOSITORIO_PORT)
    private readonly actividadRepositorio: IActividadRepositorio,
  ) {}

  async ejecutar(
    comando: ActualizarActividadCommand,
  ): Promise<Result<ActividadDetalleDto, ActividadError>> {
    this.logger.log(`Actualizando actividad ID: ${comando.id}`);

    const actividadExistente = await this.actividadRepositorio.buscarPorId(comando.id);
    if (!actividadExistente) {
      return Result.fail(new ActividadNoEncontradaError(comando.id));
    }

    const entidadActualizada = new ActividadAgricola({
      id: actividadExistente.id,
      codigo: actividadExistente.codigo,
      titulo: comando.titulo ? comando.titulo.trim() : actividadExistente.titulo,
      tipo: comando.tipo ?? actividadExistente.tipo,
      descripcion: comando.descripcion !== undefined ? comando.descripcion : actividadExistente.descripcion,
      observaciones: comando.observaciones !== undefined ? comando.observaciones : actividadExistente.observaciones,
      parcelaId: comando.parcelaId ?? actividadExistente.parcelaId,
      usuarioResponsableId:
        comando.usuarioResponsableId !== undefined
          ? comando.usuarioResponsableId
          : actividadExistente.usuarioResponsableId,
      fechaInicio: comando.fechaInicio ?? actividadExistente.fechaInicio,
      fechaFin: comando.fechaFin !== undefined ? comando.fechaFin : actividadExistente.fechaFin,
      estado: comando.estado ?? actividadExistente.estado,
      createdAt: actividadExistente.createdAt,
      updatedAt: new Date(),
    });

    const guardada = await this.actividadRepositorio.actualizar(
      entidadActualizada,
      comando.trabajadores,
      comando.recursos,
    );

    if (!guardada) {
      return Result.fail(new ActividadNoEncontradaError(comando.id));
    }

    return Result.ok(ActividadDetalleDto.desdeEntidad(guardada));
  }
}
