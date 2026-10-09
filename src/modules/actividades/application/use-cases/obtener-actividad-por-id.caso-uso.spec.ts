import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TipoActividad, EstadoActividad } from '@prisma/client';
import { ObtenerActividadPorIdCasoUso } from './obtener-actividad-por-id.caso-uso.js';
import { ActividadAgricola } from '../../domain/entities/actividad-agricola.entity.js';
import { type IActividadRepositorio } from '../../domain/ports/actividad-repositorio.port.js';
import { ActividadNoEncontradaError } from '../../domain/errors/actividad.errors.js';

/**
 * @description Pruebas unitarias para ObtenerActividadPorIdCasoUso.
 */
describe('ObtenerActividadPorIdCasoUso', () => {
  let casoUso: ObtenerActividadPorIdCasoUso;
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

    casoUso = new ObtenerActividadPorIdCasoUso(mockRepositorio);
  });

  it('debe retornar el detalle de la actividad cuando el ID existe', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000001';
    const actividad = new ActividadAgricola({
      id,
      codigo: 'ACT-001',
      titulo: 'Cosecha de Uva',
      tipo: TipoActividad.COSECHA,
      parcelaId: '0192a6c0-0000-7000-8000-000000000010',
      fechaInicio: new Date(),
      estado: EstadoActividad.PENDIENTE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(actividad);

    const resultado = await casoUso.ejecutar(id);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.id).toBe(id);
      expect(resultado.value.titulo).toBe('Cosecha de Uva');
    }
  });

  it('debe fallar con ActividadNoEncontradaError si el ID no existe', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000999';

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(null);

    const resultado = await casoUso.ejecutar(id);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(ActividadNoEncontradaError);
    }
  });
});
