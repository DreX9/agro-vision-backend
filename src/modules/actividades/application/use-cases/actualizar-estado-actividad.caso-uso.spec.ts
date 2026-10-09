import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TipoActividad, EstadoActividad } from '@prisma/client';
import { ActualizarEstadoActividadCasoUso } from './actualizar-estado-actividad.caso-uso.js';
import { ActualizarEstadoActividadCommand } from '../commands/actualizar-estado-actividad.command.js';
import { ActividadAgricola } from '../../domain/entities/actividad-agricola.entity.js';
import { type IActividadRepositorio } from '../../domain/ports/actividad-repositorio.port.js';
import { ActividadNoEncontradaError } from '../../domain/errors/actividad.errors.js';

/**
 * @description Pruebas unitarias para ActualizarEstadoActividadCasoUso.
 */
describe('ActualizarEstadoActividadCasoUso', () => {
  let casoUso: ActualizarEstadoActividadCasoUso;
  let mockRepositorio: IActividadRepositorio;

  beforeEach(() => {
    mockRepositorio = {
      listar: vi.fn(),
      buscarPorId: vi.fn(),
      buscarPorCodigo: vi.fn(),
      crear: vi.fn(),
      actualizar: vi.fn(),
      actualizarEstado: vi.fn(),
      eliminar: vi.fn(),
      contarTotal: vi.fn(),
    };

    casoUso = new ActualizarEstadoActividadCasoUso(mockRepositorio);
  });

  it('debe cambiar el estado de la actividad a EN_PROGRESO exitosamente', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000001';
    const comando = new ActualizarEstadoActividadCommand(id, EstadoActividad.EN_PROGRESO);

    const actividadExistente = new ActividadAgricola({
      id,
      codigo: 'ACT-001',
      titulo: 'Poda',
      tipo: TipoActividad.PODA,
      parcelaId: '0192a6c0-0000-7000-8000-000000000010',
      fechaInicio: new Date(),
      estado: EstadoActividad.PENDIENTE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const actividadActualizada = new ActividadAgricola({
      id,
      codigo: 'ACT-001',
      titulo: 'Poda',
      tipo: TipoActividad.PODA,
      parcelaId: '0192a6c0-0000-7000-8000-000000000010',
      fechaInicio: new Date(),
      estado: EstadoActividad.EN_PROGRESO,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(actividadExistente);
    vi.mocked(mockRepositorio.actualizarEstado).mockResolvedValue(actividadActualizada);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.estado).toBe(EstadoActividad.EN_PROGRESO);
    }
  });

  it('debe fallar con ActividadNoEncontradaError si la actividad no existe', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000999';
    const comando = new ActualizarEstadoActividadCommand(id, EstadoActividad.COMPLETADA);

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(null);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(ActividadNoEncontradaError);
    }
  });
});
