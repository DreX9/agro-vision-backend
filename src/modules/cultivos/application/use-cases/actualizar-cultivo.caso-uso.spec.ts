import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ActualizarCultivoCasoUso } from './actualizar-cultivo.caso-uso.js';
import { ActualizarCultivoCommand } from '../commands/actualizar-cultivo.command.js';
import { Cultivo } from '../../domain/entities/cultivo.entity.js';
import { type ICultivoRepositorio } from '../../domain/ports/cultivo-repositorio.port.js';
import {
  CultivoNoEncontradoError,
  CultivoYaExisteError,
} from '../../domain/errors/cultivo.errors.js';

/**
 * @description Pruebas unitarias para ActualizarCultivoCasoUso.
 */
describe('ActualizarCultivoCasoUso', () => {
  let casoUso: ActualizarCultivoCasoUso;
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

    casoUso = new ActualizarCultivoCasoUso(mockRepositorio);
  });

  it('debe actualizar los datos de un cultivo exitosamente', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000001';
    const comando = new ActualizarCultivoCommand(
      id,
      'Palto Hass Premium',
      'Persea americana var.',
    );

    const cultivoExistente = new Cultivo({
      id,
      nombre: 'Palto',
      nombreCientifico: 'Persea americana',
      variedadesDefault: ['Hass'],
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const cultivoActualizado = new Cultivo({
      id,
      nombre: 'Palto Hass Premium',
      nombreCientifico: 'Persea americana var.',
      variedadesDefault: ['Hass'],
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(cultivoExistente);
    vi.mocked(mockRepositorio.buscarPorNombre).mockResolvedValue(null);
    vi.mocked(mockRepositorio.actualizar).mockResolvedValue(cultivoActualizado);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.nombre).toBe('Palto Hass Premium');
      expect(resultado.value.nombreCientifico).toBe('Persea americana var.');
    }
  });

  it('debe fallar con CultivoNoEncontradoError si el cultivo no existe', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000999';
    const comando = new ActualizarCultivoCommand(id, 'Inexistente');

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(null);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(CultivoNoEncontradoError);
    }
  });

  it('debe fallar con CultivoYaExisteError si se intenta renombrar a un nombre ya tomado por otro cultivo', async () => {
    const id = '0192a6c0-0000-7000-8000-000000000001';
    const comando = new ActualizarCultivoCommand(id, 'Arándano');

    const cultivoActual = new Cultivo({
      id,
      nombre: 'Palto',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const otroCultivoConMismoNombre = new Cultivo({
      id: '0192a6c0-0000-7000-8000-000000000002',
      nombre: 'Arándano',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorId).mockResolvedValue(cultivoActual);
    vi.mocked(mockRepositorio.buscarPorNombre).mockResolvedValue(otroCultivoConMismoNombre);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(CultivoYaExisteError);
    }
  });
});
