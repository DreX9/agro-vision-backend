import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TipoActividad, EstadoActividad } from '@prisma/client';
import { RegistrarActividadCasoUso } from './registrar-actividad.caso-uso.js';
import { RegistrarActividadCommand } from '../commands/registrar-actividad.command.js';
import { ActividadAgricola } from '../../domain/entities/actividad-agricola.entity.js';
import { type IActividadRepositorio } from '../../domain/ports/actividad-repositorio.port.js';
import { ActividadCodigoYaExisteError } from '../../domain/errors/actividad.errors.js';

/**
 * @description Pruebas unitarias para RegistrarActividadCasoUso.
 */
describe('RegistrarActividadCasoUso', () => {
  let casoUso: RegistrarActividadCasoUso;
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

    casoUso = new RegistrarActividadCasoUso(mockRepositorio);
  });

  it('debe registrar una actividad exitosamente con su cuadrilla e insumos', async () => {
    const comando = new RegistrarActividadCommand(
      'ACT-001',
      'Fertilización Foliar',
      TipoActividad.FERTILIZACION,
      '0192a6c0-0000-7000-8000-000000000001',
      new Date('2026-10-10'),
      new Date('2026-10-12'),
      '0192a6c0-0000-7000-8000-000000000002',
      'Aplicación con pulverizadora',
      undefined,
      EstadoActividad.PENDIENTE,
      [{ usuarioId: '0192a6c0-0000-7000-8000-000000000003', rolEnActividad: 'Fumigador' }],
      [{ insumoId: '0192a6c0-0000-7000-8000-000000000004', cantidadEstimada: 50, unidadMedida: 'Kg' }],
    );

    const actividadCreada = new ActividadAgricola({
      id: '0192a6c0-0000-7000-8000-000000000099',
      codigo: 'ACT-001',
      titulo: 'Fertilización Foliar',
      tipo: TipoActividad.FERTILIZACION,
      parcelaId: '0192a6c0-0000-7000-8000-000000000001',
      fechaInicio: new Date('2026-10-10'),
      fechaFin: new Date('2026-10-12'),
      estado: EstadoActividad.PENDIENTE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorCodigo).mockResolvedValue(null);
    vi.mocked(mockRepositorio.crear).mockResolvedValue(actividadCreada);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.codigo).toBe('ACT-001');
      expect(resultado.value.titulo).toBe('Fertilización Foliar');
    }
    expect(mockRepositorio.buscarPorCodigo).toHaveBeenCalledWith('ACT-001');
    expect(mockRepositorio.crear).toHaveBeenCalledTimes(1);
  });

  it('debe fallar con ActividadCodigoYaExisteError si el código ya existe', async () => {
    const comando = new RegistrarActividadCommand(
      'ACT-001',
      'Poda Sanitaria',
      TipoActividad.PODA,
      '0192a6c0-0000-7000-8000-000000000001',
      new Date(),
    );

    const actividadExistente = new ActividadAgricola({
      id: '0192a6c0-0000-7000-8000-000000000050',
      codigo: 'ACT-001',
      titulo: 'Actividad Anterior',
      tipo: TipoActividad.PODA,
      parcelaId: '0192a6c0-0000-7000-8000-000000000001',
      fechaInicio: new Date(),
      estado: EstadoActividad.PENDIENTE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorCodigo).mockResolvedValue(actividadExistente);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(ActividadCodigoYaExisteError);
    }
    expect(mockRepositorio.crear).not.toHaveBeenCalled();
  });

  it('debe generar código correlativo automático cuando no se provee código', async () => {
    const comando = new RegistrarActividadCommand(
      undefined,
      'Riego de mantenimiento',
      TipoActividad.RIEGO,
      '0192a6c0-0000-7000-8000-000000000001',
      new Date(),
    );

    vi.mocked(mockRepositorio.contarTotal).mockResolvedValue(2);
    vi.mocked(mockRepositorio.buscarPorCodigo).mockResolvedValue(null);

    const actividadGenerada = new ActividadAgricola({
      id: '0192a6c0-0000-7000-8000-000000000077',
      codigo: 'ACT-003',
      titulo: 'Riego de mantenimiento',
      tipo: TipoActividad.RIEGO,
      parcelaId: '0192a6c0-0000-7000-8000-000000000001',
      fechaInicio: new Date(),
      estado: EstadoActividad.PENDIENTE,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.crear).mockResolvedValue(actividadGenerada);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.codigo).toBe('ACT-003');
    }
  });
});
