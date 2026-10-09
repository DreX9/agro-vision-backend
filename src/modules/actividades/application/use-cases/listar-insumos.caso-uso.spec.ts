import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CategoriaInsumo } from '@prisma/client';
import { ListarInsumosCasoUso } from './listar-insumos.caso-uso.js';
import { Insumo } from '../../domain/entities/insumo.entity.js';
import { type IInsumoRepositorio } from '../../domain/ports/insumo-repositorio.port.js';

/**
 * @description Pruebas unitarias para ListarInsumosCasoUso.
 */
describe('ListarInsumosCasoUso', () => {
  let casoUso: ListarInsumosCasoUso;
  let mockRepositorio: IInsumoRepositorio;

  beforeEach(() => {
    mockRepositorio = {
      listarActivos: vi.fn(),
      buscarPorId: vi.fn(),
      buscarPorCodigo: vi.fn(),
      crear: vi.fn(),
    };

    casoUso = new ListarInsumosCasoUso(mockRepositorio);
  });

  it('debe listar insumos activos correctamente', async () => {
    const insumosMock = [
      new Insumo({
        id: '0192a6c0-0000-7000-8000-000000000001',
        codigo: 'INS-001',
        nombre: 'Urea 46%',
        categoria: CategoriaInsumo.FERTILIZANTE,
        unidadMedida: 'Saco 50kg',
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    vi.mocked(mockRepositorio.listarActivos).mockResolvedValue(insumosMock);

    const resultado = await casoUso.ejecutar('FERTILIZANTE');

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value).toHaveLength(1);
      expect(resultado.value[0].codigo).toBe('INS-001');
      expect(resultado.value[0].nombre).toBe('Urea 46%');
    }
    expect(mockRepositorio.listarActivos).toHaveBeenCalledWith('FERTILIZANTE');
  });
});
