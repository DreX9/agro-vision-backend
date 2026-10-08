import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IParcelaRepositorio,
  PARCELA_REPOSITORIO_PORT,
} from '../../domain/ports/parcela-repositorio.port.js';
import { ActualizarEstadoParcelaCommand } from '../commands/actualizar-estado-parcela.command.js';
import { ParcelaItemDto } from '../dtos/parcela-item.dto.js';
import {
  ParcelaError,
  ParcelaNoEncontradaError,
} from '../../domain/errors/parcela.errors.js';

/**
 * @description Caso de uso para cambiar el estado operativo de una parcela.
 */
@Injectable()
export class ActualizarEstadoParcelaCasoUso {
  private readonly logger = new Logger(ActualizarEstadoParcelaCasoUso.name);

  constructor(
    @Inject(PARCELA_REPOSITORIO_PORT)
    private readonly parcelaRepositorio: IParcelaRepositorio,
  ) {}

  /**
   * @description Modifica el estado de una parcela.
   */
  async ejecutar(comando: ActualizarEstadoParcelaCommand): Promise<Result<ParcelaItemDto, ParcelaError>> {
    this.logger.log(`Cambiando estado de parcela ${comando.id} a ${comando.estado}`);

    const parcela = await this.parcelaRepositorio.buscarPorId(comando.id);
    if (!parcela) {
      return Result.fail(new ParcelaNoEncontradaError(comando.id));
    }

    const actualizada = await this.parcelaRepositorio.actualizarEstado(comando.id, comando.estado);
    if (!actualizada) {
      return Result.fail(new ParcelaNoEncontradaError(comando.id));
    }

    return Result.ok(ParcelaItemDto.desdeEntidad(actualizada));
  }
}
