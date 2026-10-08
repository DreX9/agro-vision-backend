import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type ICultivoRepositorio,
  CULTIVO_REPOSITORIO_PORT,
} from '../../domain/ports/cultivo-repositorio.port.js';
import { ActualizarCultivoCommand } from '../commands/actualizar-cultivo.command.js';
import { CultivoItemDto } from '../dtos/cultivo-item.dto.js';
import {
  CultivoError,
  CultivoNoEncontradoError,
  CultivoYaExisteError,
} from '../../domain/errors/cultivo.errors.js';

/**
 * @description Caso de uso para actualizar un cultivo existente.
 */
@Injectable()
export class ActualizarCultivoCasoUso {
  private readonly logger = new Logger(ActualizarCultivoCasoUso.name);

  constructor(
    @Inject(CULTIVO_REPOSITORIO_PORT)
    private readonly cultivoRepositorio: ICultivoRepositorio,
  ) {}

  /**
   * @description Actualiza los datos de un cultivo validando existencia y unicidad de nombre.
   */
  async ejecutar(
    comando: ActualizarCultivoCommand,
  ): Promise<Result<CultivoItemDto, CultivoError>> {
    this.logger.log(`Actualizando cultivo con ID: ${comando.id}`);

    const cultivoExistente = await this.cultivoRepositorio.buscarPorId(comando.id);
    if (!cultivoExistente) {
      return Result.fail(new CultivoNoEncontradoError(comando.id));
    }

    if (comando.nombre && comando.nombre.trim().toLowerCase() !== cultivoExistente.nombre.toLowerCase()) {
      const nombreNormalizado = comando.nombre.trim();
      const conMismoNombre = await this.cultivoRepositorio.buscarPorNombre(nombreNormalizado);
      if (conMismoNombre && conMismoNombre.id !== comando.id) {
        return Result.fail(new CultivoYaExisteError(nombreNormalizado));
      }
    }

    const actualizado = await this.cultivoRepositorio.actualizar(comando.id, {
      ...(comando.nombre !== undefined && { nombre: comando.nombre.trim() }),
      ...(comando.nombreCientifico !== undefined && {
        nombreCientifico: comando.nombreCientifico ? comando.nombreCientifico.trim() : null,
      }),
      ...(comando.variedadesDefault !== undefined && { variedadesDefault: comando.variedadesDefault }),
      ...(comando.colorHex !== undefined && { colorHex: comando.colorHex }),
      ...(comando.activo !== undefined && { activo: comando.activo }),
      updatedAt: new Date(),
    });

    return Result.ok(CultivoItemDto.desdeEntidad(actualizado));
  }
}
