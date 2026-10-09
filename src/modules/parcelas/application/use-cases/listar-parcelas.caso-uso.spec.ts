import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EstadoParcela } from '@prisma/client';
import { ListarParcelasCasoUso } from './listar-parcelas.caso-uso.js';
import { ListarParcelasQuery } from '../queries/listar-parcelas.query.js';
import { Parcela } from '../../domain/entities/parcela.entity.js';
import { type IParcelaRepositorio } from '../../domain/ports/parcela-repositorio.port.js';

/**
 * @description Pruebas unitarias para el caso de uso ListarParcelasCasoUso.
 */
describe('ListarParcelasCasoUso', () => {
  let casoUso: ListarParcelasCasoUso;
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

    casoUso = new ListarParcelasCasoUso(mockRepositorio);
  });

  it('debe listar parcelas paginadas correctamente', async () => {
    const query = new ListarParcelasQuery(
      undefined,
      undefined,
      undefined,
      undefined,
      1,
      10,
    );

    const parcelasMock = [
      new Parcela({
        id: '0192a6c0-0000-7000-8000-000000000001',
        codigo: 'P-001',
        nombre: 'Parcela San Pedro',
        areaHectareas: 10.0,
        cultivoId: '0192a6c0-0000-7000-8000-000000000010',
        cultivoNombre: 'Palto',
        estado: EstadoParcela.ACTIVA,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
      new Parcela({
        id: '0192a6c0-0000-7000-8000-000000000002',
        codigo: 'P-002',
        nombre: 'Parcela Santa Rosa',
        areaHectareas: 14.5,
        cultivoId: '0192a6c0-0000-7000-8000-000000000020',
        cultivoNombre: 'Arándano',
        estado: EstadoParcela.ACTIVA,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    vi.mocked(mockRepositorio.listar).mockResolvedValue({
      parcelas: parcelasMock,
      total: 2,
    });

    const resultado = await casoUso.ejecutar(query);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.items).toHaveLength(2);
      expect(resultado.value.total).toBe(2);
      expect(resultado.value.pagina).toBe(1);
      expect(resultado.value.limite).toBe(10);
      expect(resultado.value.totalPaginas).toBe(1);
      expect(resultado.value.items[0].codigo).toBe('P-001');
      expect(resultado.value.items[1].codigo).toBe('P-002');
    }
    expect(mockRepositorio.listar).toHaveBeenCalledWith({
      busqueda: undefined,
      cultivoId: undefined,
      estado: undefined,
      usuarioResponsableId: undefined,
      pagina: 1,
      limite: 10,
    });
  });

  it('debe calcular correctamente el total de páginas para múltiples registros', async () => {
    const query = new ListarParcelasQuery(
      'Norte',
      undefined,
      undefined,
      undefined,
      2,
      5,
    );

    vi.mocked(mockRepositorio.listar).mockResolvedValue({
      parcelas: [],
      total: 23,
    });

    const resultado = await casoUso.ejecutar(query);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.total).toBe(23);
      expect(resultado.value.pagina).toBe(2);
      expect(resultado.value.limite).toBe(5);
      expect(resultado.value.totalPaginas).toBe(5);
    }
  });
});
