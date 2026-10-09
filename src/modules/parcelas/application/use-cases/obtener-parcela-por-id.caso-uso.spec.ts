import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EstadoParcela } from '@prisma/client';
import { ObtenerParcelaPorIdCasoUso } from './obtener-parcela-por-id.caso-uso.js';
import { Parcela } from '../../domain/entities/parcela.entity.js';
import { type IParcelaRepositorio } from '../../domain/ports/parcela-repositorio.port.js';
import { ParcelaNoEncontradaError } from '../../domain/errors/parcela.errors.js';

/**
 * @description Pruebas unitarias para el caso de uso ObtenerParcelaPorIdCasoUso.
 */
describe('ObtenerParcelaPorIdCasoUso', () => {
  let casoUso: ObtenerParcelaPorIdCasoUso;
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

    casoUso = new ObtenerParcelaPorIdCasoUso(mockRepositorio);
  });

  it('debe retornar los datos de la parcela cuando el ID existe', async () => {
    const idExistente = '0192a6c0-0000-7000-8000-000000000010';
    const parcela = new Parcela({
      id: idExistente,
      codigo: 'LOTE-10',
      nombre: 'Sector Viñedos 1',
      areaHectareas: 22.4,
      cultivoId: '0192a6c0-0000-7000-8000-000000000001',
      cultivoNombre: 'Vid',
      estado: EstadoParcela.ACTIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(parcela);

    const resultado = await casoUso.ejecutar(idExistente);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.id).toBe(idExistente);
      expect(resultado.value.codigo).toBe('LOTE-10');
      expect(resultado.value.nombre).toBe('Sector Viñedos 1');
      expect(resultado.value.cultivoNombre).toBe('Vid');
    }
    expect(mockRepositorio.buscarPorId).toHaveBeenCalledWith(idExistente);
  });

  it('debe fallar con ParcelaNoEncontradaError cuando el ID no existe', async () => {
    const idInexistente = '0192a6c0-0000-7000-8000-000000000999';

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(null);

    const resultado = await casoUso.ejecutar(idInexistente);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(ParcelaNoEncontradaError);
      expect(resultado.error.message).toContain(idInexistente);
    }
    expect(mockRepositorio.buscarPorId).toHaveBeenCalledWith(idInexistente);
  });
});
