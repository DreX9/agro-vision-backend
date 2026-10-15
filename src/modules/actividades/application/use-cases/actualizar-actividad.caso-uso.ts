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
  ConflictoDisponibilidadTrabajadorError,
} from '../../domain/errors/actividad.errors.js';
import { ValidadorDisponibilidadService } from '../services/validador-disponibilidad.service.js';

/**
 * @description Caso de uso para actualizar datos, cuadrilla o insumos de una actividad existente.
 */
@Injectable()
export class ActualizarActividadCasoUso {
  private readonly logger = new Logger(ActualizarActividadCasoUso.name);

  constructor(
    @Inject(ACTIVIDAD_REPOSITORIO_PORT)
    private readonly actividadRepositorio: IActividadRepositorio,
    private readonly validadorDisponibilidad: ValidadorDisponibilidadService,
  ) {}

  async ejecutar(
    comando: ActualizarActividadCommand,
  ): Promise<Result<ActividadDetalleDto, ActividadError>> {
    this.logger.log(`Actualizando actividad ID: ${comando.id}`);

    const actividadExistente = await this.actividadRepositorio.buscarPorId(comando.id);
    if (!actividadExistente) {
      return Result.fail(new ActividadNoEncontradaError(comando.id));
    }

    const parcelaDestinoId = comando.parcelaId ?? actividadExistente.parcelaId;
    const fechaInicio = comando.fechaInicio ?? actividadExistente.fechaInicio;
    const fechaFin = comando.fechaFin !== undefined ? comando.fechaFin : actividadExistente.fechaFin;

    // Si se enviaron trabajadores actualizados, validar disponibilidad y traslados
    if (comando.trabajadores && comando.trabajadores.length > 0) {
      const validacion = await this.validadorDisponibilidad.validar(
        parcelaDestinoId,
        fechaInicio,
        fechaFin || undefined,
        comando.trabajadores.map((t) => ({
          usuarioId: t.usuarioId,
          horaInicio: t.horaInicio,
          horaFin: t.horaFin,
        })),
        comando.id, // Excluir la actividad actual que se está editando
      );

      if (!validacion.esValido && validacion.conflictos.length > 0) {
        const primerConflicto = validacion.conflictos[0];
        this.logger.warn(`Conflicto de disponibilidad detectado: ${primerConflicto.mensaje}`);
        return Result.fail(new ConflictoDisponibilidadTrabajadorError(primerConflicto.mensaje));
      }
    }

    const entidadActualizada = new ActividadAgricola({
      id: actividadExistente.id,
      codigo: actividadExistente.codigo,
      titulo: comando.titulo ? comando.titulo.trim() : actividadExistente.titulo,
      tipo: comando.tipo ?? actividadExistente.tipo,
      descripcion: comando.descripcion !== undefined ? comando.descripcion : actividadExistente.descripcion,
      observaciones: comando.observaciones !== undefined ? comando.observaciones : actividadExistente.observaciones,
      parcelaId: comando.parcelaId ?? actividadExistente.parcelaId,
      sectorId: comando.sectorId !== undefined ? comando.sectorId : actividadExistente.sectorId,
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
