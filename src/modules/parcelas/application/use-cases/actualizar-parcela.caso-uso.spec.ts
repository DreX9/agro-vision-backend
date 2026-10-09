import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EstadoParcela } from '@prisma/client';
import { ActualizarParcelaCasoUso } from './actualizar-parcela.caso-uso.js';
import { ActualizarParcelaCommand } from '../commands/actualizar-parcela.command.js';
import { Parcela } from '../../domain/entities/parcela.entity.js';
import { type IParcelaRepositorio } from '../../domain/ports/parcela-repositorio.port.js';
import { ParcelaNoEncontradaError } from '../../domain/errors/parcela.errors.js';

/**
 * @description Pruebas unitarias para el caso de uso ActualizarParcelaCasoUso.
 */
describe('ActualizarParcelaCasoUso', () => {
  let casoUso: ActualizarParcelaCasoUso;
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

    casoUso = new ActualizarParcelaCasoUso(mockRepositorio);
  });

  it('debe actualizar los datos de la parcela exitosamente', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000001';
    const comando = new ActualizarParcelaCommand(
      id,
      'Lote Actualizado',
      18.0,
      undefined,
      'Zutano',
    );

    const parcelaExistente = new Parcela({
      id,
      codigo: 'P-001',
      nombre: 'Lote Original',
      areaHectareas: 15.0,
      cultivoId: '0192a6c0-0000-7000-8000-000000000010',
      variedad: 'Hass',
      estado: EstadoParcela.ACTIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const parcelaActualizada = new Parcela({
      id,
      codigo: 'P-001',
      nombre: 'Lote Actualizado',
      areaHectareas: 18.0,
      cultivoId: '0192a6c0-0000-7000-8000-000000000010',
      variedad: 'Zutano',
      estado: EstadoParcela.ACTIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(parcelaExistente);
    vi.mocked(mockRepositorio.actualizar).mockResolvedValue(parcelaActualizada);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.nombre).toBe('Lote Actualizado');
      expect(resultado.value.areaHectareas).toBe(18.0);
      expect(resultado.value.variedad).toBe('Zutano');
    }
    expect(mockRepositorio.actualizar).toHaveBeenCalledTimes(1);
  });

  it('debe fallar con ParcelaNoEncontradaError si la parcela a actualizar no existe', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000999';
    const comando = new ActualizarParcelaCommand(id, 'Lote Inexistente');

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(null);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(ParcelaNoEncontradaError);
    }
    expect(mockRepositorio.actualizar).not.toHaveBeenCalled();
  });
});
