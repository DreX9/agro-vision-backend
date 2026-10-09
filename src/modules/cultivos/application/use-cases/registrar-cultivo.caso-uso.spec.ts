import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RegistrarCultivoCasoUso } from './registrar-cultivo.caso-uso.js';
import { RegistrarCultivoCommand } from '../commands/registrar-cultivo.command.js';
import { Cultivo } from '../../domain/entities/cultivo.entity.js';
import { type ICultivoRepositorio } from '../../domain/ports/cultivo-repositorio.port.js';
import { CultivoYaExisteError } from '../../domain/errors/cultivo.errors.js';

/**
 * @description Pruebas unitarias para RegistrarCultivoCasoUso.
 */
describe('RegistrarCultivoCasoUso', () => {
  let casoUso: RegistrarCultivoCasoUso;
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

    casoUso = new RegistrarCultivoCasoUso(mockRepositorio);
  });

  it('debe registrar un cultivo exitosamente cuando no existe duplicado', async () => {
    const comando = new RegistrarCultivoCommand(
      'Palto',
      'Persea americana',
      ['Hass', 'Fuerte'],
      '#15803d',
    );

    const cultivoCreado = new Cultivo({
      id: '0192a6c0-0000-7000-8000-000000000001',
      nombre: 'Palto',
      nombreCientifico: 'Persea americana',
      variedadesDefault: ['Hass', 'Fuerte'],
      colorHex: '#15803d',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorNombre).mockResolvedValue(null);
    vi.mocked(mockRepositorio.crear).mockResolvedValue(cultivoCreado);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.nombre).toBe('Palto');
      expect(resultado.value.nombreCientifico).toBe('Persea americana');
      expect(resultado.value.variedadesDefault).toEqual(['Hass', 'Fuerte']);
    }
    expect(mockRepositorio.buscarPorNombre).toHaveBeenCalledWith('Palto');
    expect(mockRepositorio.crear).toHaveBeenCalledTimes(1);
  });

  it('debe fallar con CultivoYaExisteError si ya existe un cultivo con el mismo nombre', async () => {
    const comando = new RegistrarCultivoCommand('Palto');

    const cultivoExistente = new Cultivo({
      id: '0192a6c0-0000-7000-8000-000000000001',
      nombre: 'Palto',
      variedadesDefault: [],
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorNombre).mockResolvedValue(cultivoExistente);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(CultivoYaExisteError);
    }
    expect(mockRepositorio.crear).not.toHaveBeenCalled();
  });
});
