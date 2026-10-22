import { Injectable, Inject } from '@nestjs/common';
import {
  DIAGNOSTICO_CAMPO_REPOSITORIO_PORT,
  type IDiagnosticoCampoRepositorio,
} from '../../domain/ports/diagnostico-campo-repositorio.port.js';
import { FiltrosDiagnosticosDto } from '../dtos/filtros-diagnosticos.dto.js';
import {
  DiagnosticoItemDto,
  RespuestaPaginadaDiagnosticosDto,
} from '../dtos/diagnostico-item.dto.js';

@Injectable()
export class ListarDiagnosticosCasoUso {
  constructor(
    @Inject(DIAGNOSTICO_CAMPO_REPOSITORIO_PORT)
    private readonly diagnosticoRepositorio: IDiagnosticoCampoRepositorio,
  ) {}

  async ejecutar(filtros: FiltrosDiagnosticosDto): Promise<RespuestaPaginadaDiagnosticosDto> {
    const pagina = filtros.pagina ?? 1;
    const limite = filtros.limite ?? 20;

    const { diagnosticos, total } = await this.diagnosticoRepositorio.listar({
      parcelaId: filtros.parcelaId,
      sectorId: filtros.sectorId,
      estadoGeneral: filtros.estadoGeneral,
      pagina,
      limite,
    });

    return {
      items: diagnosticos.map((d) => DiagnosticoItemDto.desdeEntidad(d)),
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite) || 1,
    };
  }
}
