import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IParcelaRepositorio,
  PARCELA_REPOSITORIO_PORT,
} from '../../domain/ports/parcela-repositorio.port.js';
import { ParcelaItemDto } from '../dtos/parcela-item.dto.js';
import { ListarParcelasQuery } from '../queries/listar-parcelas.query.js';
import { ParcelaError } from '../../domain/errors/parcela.errors.js';

export interface PaginaParcelasRespuesta {
  items: ParcelaItemDto[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

/**
 * @description Caso de uso para listar parcelas con filtros y paginación estándar.
 */
@Injectable()
export class ListarParcelasCasoUso {
  private readonly logger = new Logger(ListarParcelasCasoUso.name);

  constructor(
    @Inject(PARCELA_REPOSITORIO_PORT)
    private readonly parcelaRepositorio: IParcelaRepositorio,
  ) {}

  /**
   * @description Consulta las parcelas según los criterios de búsqueda y paginación.
   */
  async ejecutar(query: ListarParcelasQuery): Promise<Result<PaginaParcelasRespuesta, ParcelaError>> {
    this.logger.log(`Listando parcelas - Página: ${query.pagina}, Límite: ${query.limite}`);

    const { parcelas, total } = await this.parcelaRepositorio.listar({
      busqueda: query.busqueda,
      cultivoId: query.cultivoId,
      estado: query.estado,
      usuarioResponsableId: query.usuarioResponsableId,
      pagina: query.pagina,
      limite: query.limite,
    });

    const totalPaginas = Math.ceil(total / (query.limite || 10)) || 1;
    const items = parcelas.map((p) => ParcelaItemDto.desdeEntidad(p));

    return Result.ok({
      items,
      total,
      pagina: query.pagina,
      limite: query.limite,
      totalPaginas,
    });
  }
}
