import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IParcelaRepositorio,
  PARCELA_REPOSITORIO_PORT,
} from '../../domain/ports/parcela-repositorio.port.js';
import { ParcelaItemDto } from '../dtos/parcela-item.dto.js';
import { ParcelaError, ParcelaNoEncontradaError } from '../../domain/errors/parcela.errors.js';

/**
 * @description Caso de uso para obtener una parcela por su identificador único.
 */
@Injectable()
export class ObtenerParcelaPorIdCasoUso {
  private readonly logger = new Logger(ObtenerParcelaPorIdCasoUso.name);

  constructor(
    @Inject(PARCELA_REPOSITORIO_PORT)
    private readonly parcelaRepositorio: IParcelaRepositorio,
  ) {}

  /**
   * @description Busca y retorna los datos completos de una parcela.
   */
  async ejecutar(id: string): Promise<Result<ParcelaItemDto, ParcelaError>> {
    this.logger.log(`Buscando parcela con ID: ${id}`);
    const parcela = await this.parcelaRepositorio.buscarPorId(id);

    if (!parcela) {
      return Result.fail(new ParcelaNoEncontradaError(id));
    }

    return Result.ok(ParcelaItemDto.desdeEntidad(parcela));
  }
}
