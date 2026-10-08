import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IInsumoRepositorio,
  INSUMO_REPOSITORIO_PORT,
} from '../../domain/ports/insumo-repositorio.port.js';
import { InsumoItemDto } from '../dtos/insumo-item.dto.js';
import { ActividadError } from '../../domain/errors/actividad.errors.js';

/**
 * @description Caso de uso para consultar el catálogo de insumos y recursos agrícolas activos.
 */
@Injectable()
export class ListarInsumosCasoUso {
  private readonly logger = new Logger(ListarInsumosCasoUso.name);

  constructor(
    @Inject(INSUMO_REPOSITORIO_PORT)
    private readonly insumoRepositorio: IInsumoRepositorio,
  ) {}

  async ejecutar(categoria?: string): Promise<Result<InsumoItemDto[], ActividadError>> {
    this.logger.log(`Listando insumos activos - Categoría: ${categoria || 'TODAS'}`);
    const insumos = await this.insumoRepositorio.listarActivos(categoria);
    return Result.ok(insumos.map((i) => InsumoItemDto.desdeEntidad(i)));
  }
}
