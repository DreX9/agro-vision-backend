import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TipoActividad, EstadoActividad } from '@prisma/client';
import { ListarActividadesCasoUso } from './listar-actividades.caso-uso.js';
import { ListarActividadesQuery } from '../queries/listar-actividades.query.js';
import { ActividadAgricola } from '../../domain/entities/actividad-agricola.entity.js';
import { type IActividadRepositorio } from '../../domain/ports/actividad-repositorio.port.js';

/**
 * @description Pruebas unitarias para ListarActividadesCasoUso.
 */
describe('ListarActividadesCasoUso', () => {
  let casoUso: ListarActividadesCasoUso;
  let mockRepositorio: IActividadRepositorio;

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

    casoUso = new ListarActividadesCasoUso(mockRepositorio);
  });

  it('debe listar actividades paginadas correctamente', async () => {
    const query = new ListarActividadesQuery(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1,
      10,
    );

    const actividadesMock = [
      new ActividadAgricola({
        id: '0192a6c0-0000-7000-8000-000000000001',
        codigo: 'ACT-001',
        titulo: 'Fertilización 1',
        tipo: TipoActividad.FERTILIZACION,
        parcelaId: '0192a6c0-0000-7000-8000-000000000010',
        fechaInicio: new Date(),
        estado: EstadoActividad.PENDIENTE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    vi.mocked(mockRepositorio.listar).mockResolvedValue({
      actividades: actividadesMock,
      total: 1,
    });

    const resultado = await casoUso.ejecutar(query);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.items).toHaveLength(1);
      expect(resultado.value.total).toBe(1);
      expect(resultado.value.items[0].codigo).toBe('ACT-001');
    }
  });
});
