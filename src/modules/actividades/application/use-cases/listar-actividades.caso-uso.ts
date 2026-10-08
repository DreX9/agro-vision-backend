import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type IActividadRepositorio,
  ACTIVIDAD_REPOSITORIO_PORT,
} from '../../domain/ports/actividad-repositorio.port.js';
import { ActividadItemDto } from '../dtos/actividad-item.dto.js';
import { ListarActividadesQuery } from '../queries/listar-actividades.query.js';
import { ActividadError } from '../../domain/errors/actividad.errors.js';

export interface PaginaActividadesRespuesta {
  items: ActividadItemDto[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

/**
 * @description Caso de uso para listar actividades agrícolas con filtros y paginación estándar.
 */
@Injectable()
export class ListarActividadesCasoUso {
  private readonly logger = new Logger(ListarActividadesCasoUso.name);

  constructor(
    @Inject(ACTIVIDAD_REPOSITORIO_PORT)
    private readonly actividadRepositorio: IActividadRepositorio,
  ) {}

  async ejecutar(
    query: ListarActividadesQuery,
  ): Promise<Result<PaginaActividadesRespuesta, ActividadError>> {
    this.logger.log(`Listando actividades - Página: ${query.pagina}, Límite: ${query.limite}`);

    const { actividades, total } = await this.actividadRepositorio.listar({
      busqueda: query.busqueda,
      parcelaId: query.parcelaId,
      tipo: query.tipo,
      estado: query.estado,
      usuarioResponsableId: query.usuarioResponsableId,
      fechaDesde: query.fechaDesde,
      fechaHasta: query.fechaHasta,
      pagina: query.pagina,
      limite: query.limite,
    });

    const totalPaginas = Math.ceil(total / (query.limite || 10)) || 1;
    const items = actividades.map((a) => ActividadItemDto.desdeEntidad(a));

    return Result.ok({
      items,
      total,
      pagina: query.pagina,
      limite: query.limite,
      totalPaginas,
    });
  }
}
