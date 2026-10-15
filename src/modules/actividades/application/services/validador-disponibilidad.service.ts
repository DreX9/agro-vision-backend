import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';

export interface ConflictoDisponibilidad {
  usuarioId: string;
  trabajadorNombre: string;
  actividadId: string;
  actividadTitulo: string;
  parcelaOrigen: string;
  parcelaDestino: string;
  distanciaKm?: number;
  minutosRequeridos: number;
  minutosDisponibles: number;
  tipoConflicto: 'SOLAPAMIENTO_HORARIO' | 'TIEMPO_TRASLADO_INSUFICIENTE';
  mensaje: string;
}

export interface ValidacionDisponibilidadResultado {
  esValido: boolean;
  conflictos: ConflictoDisponibilidad[];
}

export interface TrabajadorAValidar {
  usuarioId: string;
  horaInicio?: Date;
  horaFin?: Date;
}

/**
 * @description Servicio para validar la disponibilidad horaria y los tiempos de traslado
 * entre parcelas agrícolas según coordenadas geográficas.
 */
@Injectable()
export class ValidadorDisponibilidadService {
  private readonly logger = new Logger(ValidadorDisponibilidadService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * @description Calcula la distancia ortodrómica en kilómetros usando la fórmula de Haversine.
   */
  calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio medio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  }

  /**
   * @description Estima los minutos necesarios de traslado entre dos parcelas.
   * Considera 15 km/h como velocidad estándar de desplazamiento en fundo (camioneta/tractor)
   * más 10 minutos de alistamiento y guarda de herramientas de campo.
   */
  estimarMinutosTraslado(
    lat1?: number | null,
    lon1?: number | null,
    lat2?: number | null,
    lon2?: number | null,
    mismaParcela: boolean = false,
  ): { minutos: number; distanciaKm?: number } {
    if (mismaParcela) {
      return { minutos: 0, distanciaKm: 0 };
    }

    if (
      lat1 !== null &&
      lat1 !== undefined &&
      lon1 !== null &&
      lon1 !== undefined &&
      lat2 !== null &&
      lat2 !== undefined &&
      lon2 !== null &&
      lon2 !== undefined
    ) {
      const dist = this.calcularDistanciaKm(Number(lat1), Number(lon1), Number(lat2), Number(lon2));
      // 15 km/h = 0.25 km/minuto + 10 min de alistamiento
      const minutos = Math.max(15, Math.ceil((dist / 15) * 60) + 10);
      return { minutos, distanciaKm: dist };
    }

    // Si no hay coordenadas geográficas configuradas, se asume un colchón prudente de 20 minutos
    return { minutos: 20 };
  }

  /**
   * @description Valida que ningún trabajador tenga solapamiento de horarios ni conflictos
   * de tiempo de viaje entre parcelas distintas.
   */
  async validar(
    parcelaDestinoId: string,
    fechaInicioActividad: Date,
    fechaFinActividad: Date | undefined,
    trabajadores: TrabajadorAValidar[],
    excluirActividadId?: string,
  ): Promise<ValidacionDisponibilidadResultado> {
    if (!trabajadores || trabajadores.length === 0) {
      return { esValido: true, conflictos: [] };
    }

    const usuarioIds = trabajadores.map((t) => t.usuarioId);

    // 1. Obtener la parcela destino con sus coordenadas
    const parcelaDestino = await this.prisma.parcela.findUnique({
      where: { id: parcelaDestinoId },
      select: {
        id: true,
        nombre: true,
        codigo: true,
        latitudCentro: true,
        longitudCentro: true,
      },
    });

    const parcelaDestinoNombre = parcelaDestino ? parcelaDestino.nombre : 'Parcela Destino';
    const latDestino = parcelaDestino?.latitudCentro ? Number(parcelaDestino.latitudCentro) : null;
    const lonDestino = parcelaDestino?.longitudCentro ? Number(parcelaDestino.longitudCentro) : null;

    // 2. Definir rango de consulta para el día (inicio del día a fin del día con holgura de 12 horas)
    const ventanaDesde = new Date(fechaInicioActividad.getTime() - 12 * 3600 * 1000);
    const ventanaHasta = new Date(
      (fechaFinActividad || fechaInicioActividad).getTime() + 12 * 3600 * 1000,
    );

    // 3. Consultar asignaciones activas de los trabajadores en ese rango
    const asignacionesExistentes = await this.prisma.actividadTrabajador.findMany({
      where: {
        usuarioId: { in: usuarioIds },
        ...(excluirActividadId ? { actividadId: { not: excluirActividadId } } : {}),
        actividad: {
          deletedAt: null,
          estado: { not: 'CANCELADA' },
          fechaInicio: { lte: ventanaHasta },
          OR: [{ fechaFin: null }, { fechaFin: { gte: ventanaDesde } }],
        },
      },
      include: {
        usuario: { select: { id: true, nombres: true, apellidos: true } },
        actividad: {
          select: {
            id: true,
            codigo: true,
            titulo: true,
            fechaInicio: true,
            fechaFin: true,
            parcelaId: true,
            parcela: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
                latitudCentro: true,
                longitudCentro: true,
              },
            },
          },
        },
      },
    });

    const conflictos: ConflictoDisponibilidad[] = [];

    // 4. Evaluar cada trabajador programado
    for (const t of trabajadores) {
      const inicioPropuesto = t.horaInicio ? new Date(t.horaInicio) : new Date(fechaInicioActividad);
      const finPropuesto = t.horaFin
        ? new Date(t.horaFin)
        : fechaFinActividad
        ? new Date(fechaFinActividad)
        : new Date(inicioPropuesto.getTime() + 4 * 3600 * 1000); // 4 horas por defecto

      const asignacionesDelTrabajador = asignacionesExistentes.filter((a) => a.usuarioId === t.usuarioId);

      for (const asig of asignacionesDelTrabajador) {
        const usuarioNombre = `${asig.usuario.nombres} ${asig.usuario.apellidos}`.trim();
        const actExistente = asig.actividad;
        const parcelaOrigen = actExistente.parcela;
        const mismaParcela = parcelaDestinoId === actExistente.parcelaId;

        const inicioExistente = asig.horaInicio
          ? new Date(asig.horaInicio)
          : new Date(actExistente.fechaInicio);
        const finExistente = asig.horaFin
          ? new Date(asig.horaFin)
          : actExistente.fechaFin
          ? new Date(actExistente.fechaFin)
          : new Date(inicioExistente.getTime() + 4 * 3600 * 1000);

        // A) Conflicto directo por solapamiento de horarios
        const seSolapan = inicioPropuesto < finExistente && finPropuesto > inicioExistente;
        if (seSolapan) {
          const horaIniStr = inicioExistente.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
          const horaFinStr = finExistente.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

          conflictos.push({
            usuarioId: t.usuarioId,
            trabajadorNombre: usuarioNombre,
            actividadId: actExistente.id,
            actividadTitulo: actExistente.titulo,
            parcelaOrigen: parcelaOrigen.nombre,
            parcelaDestino: parcelaDestinoNombre,
            minutosRequeridos: 0,
            minutosDisponibles: 0,
            tipoConflicto: 'SOLAPAMIENTO_HORARIO',
            mensaje: `El trabajador ${usuarioNombre} ya está asignado a "${actExistente.titulo}" en ${parcelaOrigen.nombre} de ${horaIniStr} a ${horaFinStr}.`,
          });
          continue;
        }

        // B) Conflicto de traslado entre parcelas distintas
        if (!mismaParcela) {
          const latOrigen = parcelaOrigen.latitudCentro ? Number(parcelaOrigen.latitudCentro) : null;
          const lonOrigen = parcelaOrigen.longitudCentro ? Number(parcelaOrigen.longitudCentro) : null;

          const { minutos: minutosRequeridos, distanciaKm } = this.estimarMinutosTraslado(
            latOrigen,
            lonOrigen,
            latDestino,
            lonDestino,
            mismaParcela,
          );

          // Caso 1: La labor existente finaliza antes de que comience la nueva
          if (finExistente <= inicioPropuesto) {
            const minutosDisponibles = Math.floor(
              (inicioPropuesto.getTime() - finExistente.getTime()) / (60 * 1000),
            );

            if (minutosDisponibles < minutosRequeridos) {
              const finHoraStr = finExistente.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
              const iniHoraStr = inicioPropuesto.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
              const distTxt = distanciaKm ? ` (${distanciaKm} km)` : '';

              conflictos.push({
                usuarioId: t.usuarioId,
                trabajadorNombre: usuarioNombre,
                actividadId: actExistente.id,
                actividadTitulo: actExistente.titulo,
                parcelaOrigen: parcelaOrigen.nombre,
                parcelaDestino: parcelaDestinoNombre,
                distanciaKm,
                minutosRequeridos,
                minutosDisponibles,
                tipoConflicto: 'TIEMPO_TRASLADO_INSUFICIENTE',
                mensaje: `El trabajador ${usuarioNombre} termina a las ${finHoraStr} en ${parcelaOrigen.nombre}, pero requiere al menos ${minutosRequeridos} min de traslado hacia ${parcelaDestinoNombre}${distTxt}. Solo dispone de ${minutosDisponibles} min antes de las ${iniHoraStr}.`,
              });
            }
          }

          // Caso 2: La nueva labor finaliza antes de que comience la existente
          if (finPropuesto <= inicioExistente) {
            const minutosDisponibles = Math.floor(
              (inicioExistente.getTime() - finPropuesto.getTime()) / (60 * 1000),
            );

            if (minutosDisponibles < minutosRequeridos) {
              const finPropuestoStr = finPropuesto.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
              const iniExistenteStr = inicioExistente.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
              const distTxt = distanciaKm ? ` (${distanciaKm} km)` : '';

              conflictos.push({
                usuarioId: t.usuarioId,
                trabajadorNombre: usuarioNombre,
                actividadId: actExistente.id,
                actividadTitulo: actExistente.titulo,
                parcelaOrigen: parcelaDestinoNombre,
                parcelaDestino: parcelaOrigen.nombre,
                distanciaKm,
                minutosRequeridos,
                minutosDisponibles,
                tipoConflicto: 'TIEMPO_TRASLADO_INSUFICIENTE',
                mensaje: `La labor para ${usuarioNombre} terminaría a las ${finPropuestoStr} en ${parcelaDestinoNombre}, pero tiene otra labor a las ${iniExistenteStr} en ${parcelaOrigen.nombre}. Requiere ${minutosRequeridos} min de traslado${distTxt} y solo dispone de ${minutosDisponibles} min.`,
              });
            }
          }
        }
      }
    }

    return {
      esValido: conflictos.length === 0,
      conflictos,
    };
  }
}
