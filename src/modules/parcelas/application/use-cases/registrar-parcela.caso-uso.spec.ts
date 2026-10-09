import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EstadoParcela } from '@prisma/client';
import { RegistrarParcelaCasoUso } from './registrar-parcela.caso-uso.js';
import { RegistrarParcelaCommand } from '../commands/registrar-parcela.command.js';
import { Parcela } from '../../domain/entities/parcela.entity.js';
import { type IParcelaRepositorio } from '../../domain/ports/parcela-repositorio.port.js';
import { ParcelaCodigoYaExisteError } from '../../domain/errors/parcela.errors.js';

/**
 * @description Pruebas unitarias para el caso de uso RegistrarParcelaCasoUso.
 */
describe('RegistrarParcelaCasoUso', () => {
  let casoUso: RegistrarParcelaCasoUso;
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

    casoUso = new RegistrarParcelaCasoUso(mockRepositorio);
  });

  it('debe registrar una parcela exitosamente cuando los datos son válidos', async () => {
    const comando = new RegistrarParcelaCommand(
      'PAR-001',
      'Lote Norte',
      15.5,
      '0192a6c0-0000-7000-8000-000000000001',
      'Hass',
      '0192a6c0-0000-7000-8000-000000000002',
      'Sector Las Dunas',
      'Ica',
      'Ica',
      'Salas',
      EstadoParcela.ACTIVA,
    );

    const parcelaCreada = new Parcela({
      id: '0192a6c0-0000-7000-8000-000000000099',
      codigo: 'PAR-001',
      nombre: 'Lote Norte',
      areaHectareas: 15.5,
      cultivoId: '0192a6c0-0000-7000-8000-000000000001',
      variedad: 'Hass',
      usuarioResponsableId: '0192a6c0-0000-7000-8000-000000000002',
      ubicacion: 'Sector Las Dunas',
      departamento: 'Ica',
      provincia: 'Ica',
      distrito: 'Salas',
      estado: EstadoParcela.ACTIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorCodigo).mockResolvedValue(null);
    vi.mocked(mockRepositorio.crear).mockResolvedValue(parcelaCreada);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.codigo).toBe('PAR-001');
      expect(resultado.value.nombre).toBe('Lote Norte');
      expect(resultado.value.areaHectareas).toBe(15.5);
    }
    expect(mockRepositorio.buscarPorCodigo).toHaveBeenCalledWith('PAR-001');
    expect(mockRepositorio.crear).toHaveBeenCalledTimes(1);
  });

  it('debe fallar con ParcelaCodigoYaExisteError si el código ya está registrado', async () => {
    const comando = new RegistrarParcelaCommand(
      'PAR-001',
      'Lote Norte Duplicado',
      10.0,
      '0192a6c0-0000-7000-8000-000000000001',
    );

    const parcelaExistente = new Parcela({
      id: '0192a6c0-0000-7000-8000-000000000050',
      codigo: 'PAR-001',
      nombre: 'Lote Original',
      areaHectareas: 12.0,
      cultivoId: '0192a6c0-0000-7000-8000-000000000001',
      estado: EstadoParcela.ACTIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.buscarPorCodigo).mockResolvedValue(parcelaExistente);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isFailure).toBe(true);
    if (resultado.isFailure) {
      expect(resultado.error).toBeInstanceOf(ParcelaCodigoYaExisteError);
      expect(resultado.error.message).toContain('PAR-001');
    }
    expect(mockRepositorio.crear).not.toHaveBeenCalled();
  });

  it('debe generar un código automático correlativo cuando no se provee un código', async () => {
    const comando = new RegistrarParcelaCommand(
      undefined,
      'Lote Sin Código',
      8.0,
      '0192a6c0-0000-7000-8000-000000000001',
    );

    vi.mocked(mockRepositorio.contarTotal).mockResolvedValue(4);
    vi.mocked(mockRepositorio.buscarPorCodigo).mockResolvedValue(null);

    const parcelaGenerada = new Parcela({
      id: '0192a6c0-0000-7000-8000-000000000055',
      codigo: 'P-005',
      nombre: 'Lote Sin Código',
      areaHectareas: 8.0,
      cultivoId: '0192a6c0-0000-7000-8000-000000000001',
      estado: EstadoParcela.ACTIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockRepositorio.crear).mockResolvedValue(parcelaGenerada);

    const resultado = await casoUso.ejecutar(comando);

    expect(resultado.isSuccess).toBe(true);
    if (resultado.isSuccess) {
      expect(resultado.value.codigo).toBe('P-005');
    }
    expect(mockRepositorio.contarTotal).toHaveBeenCalledTimes(1);
    expect(mockRepositorio.buscarPorCodigo).toHaveBeenCalledWith('P-005');
  });
});
