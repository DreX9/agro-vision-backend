import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type ICultivoRepositorio,
  CULTIVO_REPOSITORIO_PORT,
} from '../../domain/ports/cultivo-repositorio.port.js';
import { CultivoItemDto } from '../dtos/cultivo-item.dto.js';
import { CultivoError } from '../../domain/errors/cultivo.errors.js';

/**
 * @description Caso de uso para listar todos los cultivos activos disponibles en el catálogo.
 */
@Injectable()
export class ListarCultivosActivosCasoUso {
  private readonly logger = new Logger(ListarCultivosActivosCasoUso.name);

  constructor(
    @Inject(CULTIVO_REPOSITORIO_PORT)
    private readonly cultivoRepositorio: ICultivoRepositorio,
  ) {}

  /**
   * @description Consulta y retorna los cultivos activos.
   */
  async ejecutar(): Promise<Result<CultivoItemDto[], CultivoError>> {
    this.logger.log('Listando cultivos activos del sistema');
    const cultivos = await this.cultivoRepositorio.listarActivos();
    return Result.ok(cultivos.map((c) => CultivoItemDto.desdeEntidad(c)));
  }
}
