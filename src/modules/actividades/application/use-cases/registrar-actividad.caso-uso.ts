import { Injectable, Inject, Logger } from '@nestjs/common';
import { EstadoActividad } from '@prisma/client';
import { Result } from '@/shared/domain/result.js';
import {
  type IActividadRepositorio,
  ACTIVIDAD_REPOSITORIO_PORT,
} from '../../domain/ports/actividad-repositorio.port.js';
import { RegistrarActividadCommand } from '../commands/registrar-actividad.command.js';
import { ActividadDetalleDto } from '../dtos/actividad-detalle.dto.js';
import { ActividadAgricola } from '../../domain/entities/actividad-agricola.entity.js';
import {
  ActividadError,
  ActividadCodigoYaExisteError,
} from '../../domain/errors/actividad.errors.js';

/**
 * @description Caso de uso para registrar una nueva actividad agrícola con cuadrilla e insumos.
 */
@Injectable()
export class RegistrarActividadCasoUso {
  private readonly logger = new Logger(RegistrarActividadCasoUso.name);

  constructor(
    @Inject(ACTIVIDAD_REPOSITORIO_PORT)
    private readonly actividadRepositorio: IActividadRepositorio,
  ) {}

  async ejecutar(
    comando: RegistrarActividadCommand,
  ): Promise<Result<ActividadDetalleDto, ActividadError>> {
    let codigo = comando.codigo?.trim().toUpperCase();

    if (!codigo) {
      const totalActual = await this.actividadRepositorio.contarTotal();
      codigo = `ACT-${String(totalActual + 1).padStart(3, '0')}`;
    }

    const existe = await this.actividadRepositorio.buscarPorCodigo(codigo);
    if (existe) {
      return Result.fail(new ActividadCodigoYaExisteError(codigo));
    }

    this.logger.log(`Registrando actividad: ${codigo} - ${comando.titulo}`);

    const nuevaActividad = new ActividadAgricola({
      id: '',
      codigo,
      titulo: comando.titulo.trim(),
      tipo: comando.tipo,
      descripcion: comando.descripcion?.trim() || null,
      observaciones: comando.observaciones?.trim() || null,
      parcelaId: comando.parcelaId,
      usuarioResponsableId: comando.usuarioResponsableId || null,
      fechaInicio: comando.fechaInicio,
      fechaFin: comando.fechaFin || null,
      estado: comando.estado || EstadoActividad.PENDIENTE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const guardada = await this.actividadRepositorio.crear(
      nuevaActividad,
      comando.trabajadores,
      comando.recursos,
    );

    return Result.ok(ActividadDetalleDto.desdeEntidad(guardada));
  }
}
