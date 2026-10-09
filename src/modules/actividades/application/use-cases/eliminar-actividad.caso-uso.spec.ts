import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TipoActividad, EstadoActividad } from '@prisma/client';
import { EliminarActividadCasoUso } from './eliminar-actividad.caso-uso.js';
import { ActividadAgricola } from '../../domain/entities/actividad-agricola.entity.js';
import { type IActividadRepositorio } from '../../domain/ports/actividad-repositorio.port.js';
import { ActividadNoEncontradaError } from '../../domain/errors/actividad.errors.js';

/**
 * @description Pruebas unitarias para EliminarActividadCasoUso.
 */
describe('EliminarActividadCasoUso', () => {
  let casoUso: EliminarActividadCasoUso;
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

    casoUso = new EliminarActividadCasoUso(mockRepositorio);
  });

  it('debe eliminar la actividad exitosamente si existe', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000001';
    const actividad = new ActividadAgricola({
      id,
      codigo: 'ACT-001',
      titulo: 'Actividad a eliminar',
      tipo: TipoActividad.MANTENIMIENTO,
      parcelaId: '0192a6c0-0000-7000-8000-000000000010',
      fechaInicio: new Date(),
      estado: EstadoActividad.PENDIENTE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(actividad);
    vi.mocked(mockRepositorio.eliminar).mockResolvedValue(true);

    const resultado = await casoUso.ejecutar(id);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value).toBe(true);
    }
  });

  it('debe fallar con ActividadNoEncontradaError si la actividad no existe', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000999';

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(null);

    const resultado = await casoUso.ejecutar(id);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(ActividadNoEncontradaError);
    }
  });
});
