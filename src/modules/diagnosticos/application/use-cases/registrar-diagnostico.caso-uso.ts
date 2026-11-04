import { Injectable, Inject, Optional, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '@/prisma/prisma.service.js';
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
import { AlertasFitosanitariasService } from '../services/alertas-fitosanitarias.service.js';

@Injectable()
export class RegistrarDiagnosticoCasoUso {
  constructor(
    @Inject(DIAGNOSTICO_CAMPO_REPOSITORIO_PORT)
    private readonly diagnosticoRepositorio: IDiagnosticoCampoRepositorio,
    @Inject(PARCELA_REPOSITORIO_PORT)
    private readonly parcelaRepositorio: IParcelaRepositorio,
    private readonly alertasService: AlertasFitosanitariasService,
    @Optional()
    private readonly prisma?: PrismaService,
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

    // Detección automática en segundo plano de la labor agrícola que realizaba el trabajador
    let actividadCodigo: string | null = null;
    let actividadTitulo: string | null = null;
    let actividadTipo: string | null = null;
    let supervisorAsignadoId: string | null = null;
    let supervisorAsignadoNombre: string | null = null;

    if (this.prisma && dto.usuarioId) {
      try {
        const asignacion = await this.prisma.actividadTrabajador.findFirst({
          where: {
            usuarioId: dto.usuarioId,
            actividad: {
              estado: { in: ['PENDIENTE', 'EN_PROGRESO'] },
            },
          },
          include: {
            actividad: {
              include: {
                usuarioResponsable: { select: { id: true, nombres: true, apellidos: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (asignacion?.actividad) {
          actividadCodigo = asignacion.actividad.codigo;
          actividadTitulo = asignacion.actividad.titulo;
          actividadTipo = String(asignacion.actividad.tipo);
          if (asignacion.actividad.usuarioResponsable) {
            supervisorAsignadoId = asignacion.actividad.usuarioResponsable.id;
            supervisorAsignadoNombre = `${asignacion.actividad.usuarioResponsable.nombres} ${asignacion.actividad.usuarioResponsable.apellidos}`.trim();
          }
        }
      } catch {
        // Silencioso para no bloquear registro
      }
    }

    let observacionesFinal = dto.observaciones || null;
    if (actividadTitulo && (!dto.observaciones || !dto.observaciones.includes(actividadTitulo))) {
      observacionesFinal = `[Labor en curso: ${actividadTitulo} (${actividadCodigo})] ${dto.observaciones || ''}`.trim();
    }

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
      observaciones: observacionesFinal,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const guardado = await this.diagnosticoRepositorio.crear(nuevoDiagnostico);
    const resultado = DiagnosticoItemDto.desdeEntidad(guardado);

    // Enriquecer DTO de respuesta con detalles detectados en segundo plano
    if (actividadTitulo) {
      resultado.actividadTitulo = actividadTitulo;
      resultado.actividadCodigo = actividadCodigo;
      resultado.actividadTipo = actividadTipo;
    }
    if (supervisorAsignadoId) {
      resultado.supervisorId = supervisorAsignadoId;
      resultado.supervisorNombre = supervisorAsignadoNombre;
    }
    if (dto.ubicacionFueraTerreno) {
      resultado.ubicacionFueraTerreno = true;
    }

    // Si constituye una alerta fitosanitaria, notificar en tiempo real al supervisor y agrónomos
    if (guardado.esAlerta) {
      this.alertasService.emitirAlerta(resultado);
    }

    return resultado;
  }
}
