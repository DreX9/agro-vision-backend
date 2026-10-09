import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ListarCultivosActivosCasoUso } from './listar-cultivos-activos.caso-uso.js';
import { Cultivo } from '../../domain/entities/cultivo.entity.js';
import { type ICultivoRepositorio } from '../../domain/ports/cultivo-repositorio.port.js';

/**
 * @description Pruebas unitarias para ListarCultivosActivosCasoUso.
 */
describe('ListarCultivosActivosCasoUso', () => {
  let casoUso: ListarCultivosActivosCasoUso;
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

    casoUso = new ListarCultivosActivosCasoUso(mockRepositorio);
  });

  it('debe retornar la lista de cultivos activos mapeados a DTOs', async () => {
    const cultivosMock = [
      new Cultivo({
        id: '0192a6c0-0000-7000-8000-000000000001',
        nombre: 'Arándano',
        variedadesDefault: ['Biloxi', 'Ventura'],
        colorHex: '#3b82f6',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Cultivo({
        id: '0192a6c0-0000-7000-8000-000000000002',
        nombre: 'Vid',
        variedadesDefault: ['Red Globe'],
        colorHex: '#8b5cf6',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    vi.mocked(mockRepositorio.listarActivos).mockResolvedValue(cultivosMock);

    const resultado = await casoUso.ejecutar();

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value).toHaveLength(2);
      expect(resultado.value[0].nombre).toBe('Arándano');
      expect(resultado.value[1].nombre).toBe('Vid');
    }
    expect(mockRepositorio.listarActivos).toHaveBeenCalledTimes(1);
  });
});
