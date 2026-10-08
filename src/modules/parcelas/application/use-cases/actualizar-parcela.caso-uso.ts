import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IParcelaRepositorio,
  PARCELA_REPOSITORIO_PORT,
} from '../../domain/ports/parcela-repositorio.port.js';
import { ActualizarParcelaCommand } from '../commands/actualizar-parcela.command.js';
import { ParcelaItemDto } from '../dtos/parcela-item.dto.js';
import { Parcela } from '../../domain/entities/parcela.entity.js';
import {
  ParcelaError,
  ParcelaNoEncontradaError,
} from '../../domain/errors/parcela.errors.js';

/**
 * @description Caso de uso para actualizar la información agronómica y geográfica de una parcela.
 */
@Injectable()
export class ActualizarParcelaCasoUso {
  private readonly logger = new Logger(ActualizarParcelaCasoUso.name);

  constructor(
    @Inject(PARCELA_REPOSITORIO_PORT)
    private readonly parcelaRepositorio: IParcelaRepositorio,
  ) {}

  /**
   * @description Actualiza una parcela existente.
   */
  async ejecutar(comando: ActualizarParcelaCommand): Promise<Result<ParcelaItemDto, ParcelaError>> {
    this.logger.log(`Actualizando parcela ID: ${comando.id}`);

    const parcelaExistente = await this.parcelaRepositorio.buscarPorId(comando.id);
    if (!parcelaExistente) {
      return Result.fail(new ParcelaNoEncontradaError(comando.id));
    }

    const parcelaActualizada = new Parcela({
      id: parcelaExistente.id,
      codigo: parcelaExistente.codigo,
      nombre: comando.nombre ? comando.nombre.trim() : parcelaExistente.nombre,
      areaHectareas: comando.areaHectareas ?? parcelaExistente.areaHectareas,
      cultivoId: comando.cultivoId ?? parcelaExistente.cultivoId,
      variedad: comando.variedad !== undefined ? comando.variedad : parcelaExistente.variedad,
      usuarioResponsableId:
        comando.usuarioResponsableId !== undefined
          ? comando.usuarioResponsableId
          : parcelaExistente.usuarioResponsableId,
      ubicacion: comando.ubicacion !== undefined ? comando.ubicacion : parcelaExistente.ubicacion,
      departamento:
        comando.departamento !== undefined ? comando.departamento : parcelaExistente.departamento,
      provincia:
        comando.provincia !== undefined ? comando.provincia : parcelaExistente.provincia,
      distrito: comando.distrito !== undefined ? comando.distrito : parcelaExistente.distrito,
      estado: comando.estado ?? parcelaExistente.estado,
      delimitacionGeoJson:
        comando.delimitacionGeoJson !== undefined
          ? comando.delimitacionGeoJson
          : parcelaExistente.delimitacionGeoJson,
      latitudCentro:
        comando.latitudCentro !== undefined
          ? comando.latitudCentro
          : parcelaExistente.latitudCentro,
      longitudCentro:
        comando.longitudCentro !== undefined
          ? comando.longitudCentro
          : parcelaExistente.longitudCentro,
      createdAt: parcelaExistente.createdAt,
      updatedAt: new Date(),
    });

    const guardada = await this.parcelaRepositorio.actualizar(parcelaActualizada);
    if (!guardada) {
      return Result.fail(new ParcelaNoEncontradaError(comando.id));
    }

    return Result.ok(ParcelaItemDto.desdeEntidad(guardada));
  }
}
