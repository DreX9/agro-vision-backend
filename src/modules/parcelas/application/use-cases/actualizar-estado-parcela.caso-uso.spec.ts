import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EstadoParcela } from '@prisma/client';
import { ActualizarEstadoParcelaCasoUso } from './actualizar-estado-parcela.caso-uso.js';
import { ActualizarEstadoParcelaCommand } from '../commands/actualizar-estado-parcela.command.js';
import { Parcela } from '../../domain/entities/parcela.entity.js';
import { type IParcelaRepositorio } from '../../domain/ports/parcela-repositorio.port.js';
import { ParcelaNoEncontradaError } from '../../domain/errors/parcela.errors.js';

/**
 * @description Pruebas unitarias para el caso de uso ActualizarEstadoParcelaCasoUso.
 */
describe('ActualizarEstadoParcelaCasoUso', () => {
  let casoUso: ActualizarEstadoParcelaCasoUso;
  let mockRepositorio: IParcelaRepositorio;

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

    casoUso = new ActualizarEstadoParcelaCasoUso(mockRepositorio);
  });

  it('debe actualizar el estado de la parcela a EN_PREPARACION exitosamente', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000001';
    const comando = new ActualizarEstadoParcelaCommand(id, EstadoParcela.EN_PREPARACION);

    const parcelaExistente = new Parcela({
      id,
      codigo: 'P-001',
      nombre: 'Lote 1',
      areaHectareas: 10.0,
      cultivoId: '0192a6c0-0000-7000-8000-000000000010',
      estado: EstadoParcela.ACTIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const parcelaConNuevoEstado = new Parcela({
      id,
      codigo: 'P-001',
      nombre: 'Lote 1',
      areaHectareas: 10.0,
      cultivoId: '0192a6c0-0000-7000-8000-000000000010',
      estado: EstadoParcela.EN_PREPARACION,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(parcelaExistente);
    vi.mocked(mockRepositorio.actualizarEstado).mockResolvedValue(parcelaConNuevoEstado);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.estado).toBe(EstadoParcela.EN_PREPARACION);
    }
    expect(mockRepositorio.actualizarEstado).toHaveBeenCalledWith(id, EstadoParcela.EN_PREPARACION);
  });

  it('debe fallar con ParcelaNoEncontradaError si la parcela no existe', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000999';
    const comando = new ActualizarEstadoParcelaCommand(id, EstadoParcela.INACTIVA);

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(null);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(ParcelaNoEncontradaError);
    }
    expect(mockRepositorio.actualizarEstado).not.toHaveBeenCalled();
  });
});
