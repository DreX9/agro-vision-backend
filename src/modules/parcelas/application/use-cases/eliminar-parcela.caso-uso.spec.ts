import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EstadoParcela } from '@prisma/client';
import { EliminarParcelaCasoUso } from './eliminar-parcela.caso-uso.js';
import { Parcela } from '../../domain/entities/parcela.entity.js';
import { type IParcelaRepositorio } from '../../domain/ports/parcela-repositorio.port.js';
import { ParcelaNoEncontradaError } from '../../domain/errors/parcela.errors.js';

/**
 * @description Pruebas unitarias para el caso de uso EliminarParcelaCasoUso.
 */
describe('EliminarParcelaCasoUso', () => {
  let casoUso: EliminarParcelaCasoUso;
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

    casoUso = new EliminarParcelaCasoUso(mockRepositorio);
  });

  it('debe eliminar lógicamente la parcela cuando existe', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000001';

    const parcelaExistente = new Parcela({
      id,
      codigo: 'P-001',
      nombre: 'Lote a eliminar',
      areaHectareas: 5.0,
      cultivoId: '0192a6c0-0000-7000-8000-000000000010',
      estado: EstadoParcela.ACTIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(parcelaExistente);
    vi.mocked(mockRepositorio.eliminar).mockResolvedValue(true);

    const resultado = await casoUso.ejecutar(id);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value).toBe(true);
    }
    expect(mockRepositorio.eliminar).toHaveBeenCalledWith(id);
  });

  it('debe fallar con ParcelaNoEncontradaError si la parcela a eliminar no existe', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000999';

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(null);

    const resultado = await casoUso.ejecutar(id);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(ParcelaNoEncontradaError);
    }
    expect(mockRepositorio.eliminar).not.toHaveBeenCalled();
  });
});
