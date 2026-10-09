import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EliminarCultivoCasoUso } from './eliminar-cultivo.caso-uso.js';
import { Cultivo } from '../../domain/entities/cultivo.entity.js';
import { type ICultivoRepositorio } from '../../domain/ports/cultivo-repositorio.port.js';
import {
  CultivoNoEncontradoError,
  CultivoEnUsoError,
} from '../../domain/errors/cultivo.errors.js';

/**
 * @description Pruebas unitarias para EliminarCultivoCasoUso.
 */
describe('EliminarCultivoCasoUso', () => {
  let casoUso: EliminarCultivoCasoUso;
  let mockRepositorio: ICultivoRepositorio;

  beforeEach(() => {
    mockRepositorio = {
      listarActivos: vi.fn(),
      buscarPorId: vi.fn(),
      buscarPorNombre: vi.fn(),
      crear: vi.fn(),
      actualizar: vi.fn(),
      eliminar: vi.fn(),
      tieneParcelasAsociadas: vi.fn(),
    };

    casoUso = new EliminarCultivoCasoUso(mockRepositorio);
  });

  it('debe eliminar el cultivo cuando existe y no tiene parcelas asociadas', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000001';
    const cultivo = new Cultivo({
      id,
      nombre: 'Cultivo Sin Uso',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(cultivo);
    vi.mocked(mockRepositorio.tieneParcelasAsociadas).mockResolvedValue(false);
    vi.mocked(mockRepositorio.eliminar).mockResolvedValue(undefined);

    const resultado = await casoUso.ejecutar(id);

    expect(resultado.isSuccess).toBe(true);
    expect(mockRepositorio.eliminar).toHaveBeenCalledWith(id);
  });

  it('debe fallar con CultivoNoEncontradoError si el cultivo no existe', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000999';

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(null);

    const resultado = await casoUso.ejecutar(id);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(CultivoNoEncontradoError);
    }
    expect(mockRepositorio.eliminar).not.toHaveBeenCalled();
  });

  it('debe fallar con CultivoEnUsoError si el cultivo está asignado a parcelas', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000001';
    const cultivo = new Cultivo({
      id,
      nombre: 'Palto con Lotes',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(cultivo);
    vi.mocked(mockRepositorio.tieneParcelasAsociadas).mockResolvedValue(true);

    const resultado = await casoUso.ejecutar(id);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(CultivoEnUsoError);
    }
    expect(mockRepositorio.eliminar).not.toHaveBeenCalled();
  });
});
