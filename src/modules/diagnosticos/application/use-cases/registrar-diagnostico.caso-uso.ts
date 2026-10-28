import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DiagnosticoCampo } from '../../domain/entities/diagnostico-campo.entity.js';
import {
  DIAGNOSTICO_CAMPO_REPOSITORIO_PORT,
  type IDiagnosticoCampoRepositorio,
} from '../../domain/ports/diagnostico-campo-repositorio.port.js';
import {
  PARCELA_REPOSITORIO_PORT,
  type IParcelaRepositorio,
} from '../../../parcelas/domain/ports/parcela-repositorio.port.js';
import { CrearDiagnosticoDto } from '../dtos/crear-diagnostico.dto.js';
import { DiagnosticoItemDto } from '../dtos/diagnostico-item.dto.js';

@Injectable()
export class RegistrarDiagnosticoCasoUso {
  constructor(
    @Inject(DIAGNOSTICO_CAMPO_REPOSITORIO_PORT)
    private readonly diagnosticoRepositorio: IDiagnosticoCampoRepositorio,
    @Inject(PARCELA_REPOSITORIO_PORT)
    private readonly parcelaRepositorio: IParcelaRepositorio,
  ) {}

  async ejecutar(dto: CrearDiagnosticoDto): Promise<DiagnosticoItemDto> {
    const parcela = await this.parcelaRepositorio.buscarPorId(dto.parcelaId);
    if (!parcela) {
      throw new NotFoundException(`La parcela con ID ${dto.parcelaId} no existe`);
    }

    const total = await this.diagnosticoRepositorio.contarTotal();
    const correlativo = String(total + 1).padStart(4, '0');
    const anio = new Date().getFullYear();
    const codigo = `DIAG-${anio}-${correlativo}`;

    const esAlerta =
      dto.esAlerta !== undefined
        ? dto.esAlerta
        : (dto.estadoGeneral === 'ALERTA' ||
           dto.estadoGeneral === 'CRITICO' ||
           dto.totalPlagasDetectadas > 0);

    const nuevoDiagnostico = new DiagnosticoCampo({
      id: randomUUID(),
      codigo,
      parcelaId: dto.parcelaId,
      sectorId: dto.sectorId || null,
      usuarioId: dto.usuarioId || null,
      latitud: dto.latitud,
      longitud: dto.longitud,
      estadoGeneral: dto.estadoGeneral,
      saludPorcentaje: dto.saludPorcentaje,
      totalPlagasDetectadas: dto.totalPlagasDetectadas,
      esAlerta,
      detecciones: dto.detecciones ?? [],
      recomendaciones: dto.recomendaciones ?? [],
      tiempoProcesamientoMs: dto.tiempoProcesamientoMs || null,
      imagenUrl: dto.imagenUrl || null,
      origenCaptura: dto.origenCaptura || 'DRON_SIMULADO',
      observaciones: dto.observaciones || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const guardado = await this.diagnosticoRepositorio.crear(nuevoDiagnostico);
    return DiagnosticoItemDto.desdeEntidad(guardado);
  }
}
