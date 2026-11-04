import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EstadoSaludFoliar } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { RegistrarDiagnosticoCasoUso } from './registrar-diagnostico.caso-uso.js';
import { type IDiagnosticoCampoRepositorio } from '../../domain/ports/diagnostico-campo-repositorio.port.js';
import { type IParcelaRepositorio } from '../../../parcelas/domain/ports/parcela-repositorio.port.js';
import { DiagnosticoCampo } from '../../domain/entities/diagnostico-campo.entity.js';
import { AlertasFitosanitariasService } from '../services/alertas-fitosanitarias.service.js';

describe('RegistrarDiagnosticoCasoUso', () => {
  let casoUso: RegistrarDiagnosticoCasoUso;
  let mockDiagnosticoRepo: IDiagnosticoCampoRepositorio;
  let mockParcelaRepo: IParcelaRepositorio;
  let mockAlertasService: AlertasFitosanitariasService;

  beforeEach(() => {
    mockDiagnosticoRepo = {
      listar: vi.fn(),
      buscarPorId: vi.fn(),
      crear: vi.fn().mockImplementation(async (d: DiagnosticoCampo) => d),
      contarTotal: vi.fn().mockResolvedValue(5),
    };

    mockParcelaRepo = {
      listar: vi.fn(),
      buscarPorId: vi.fn().mockResolvedValue({ id: 'parcela-uuid-1', nombre: 'Parcela Norte' }),
      buscarPorCodigo: vi.fn(),
      crear: vi.fn(),
      actualizar: vi.fn(),
      actualizarEstado: vi.fn(),
      eliminar: vi.fn(),
      contarTotal: vi.fn(),
    };

    mockAlertasService = {
      emitirAlerta: vi.fn(),
      obtenerStreamAlertas: vi.fn(),
      obtenerAlertasRecientes: vi.fn(),
    } as unknown as AlertasFitosanitariasService;

    casoUso = new RegistrarDiagnosticoCasoUso(
      mockDiagnosticoRepo,
      mockParcelaRepo,
      mockAlertasService,
    );
  });

  it('debe registrar un diagnóstico como ALERTA cuando se detectan plagas o estado crítico', async () => {
    const resultado = await casoUso.ejecutar({
      parcelaId: 'parcela-uuid-1',
      latitud: -11.95,
      longitud: -76.98,
      estadoGeneral: EstadoSaludFoliar.ALERTA,
      saludPorcentaje: 70,
      totalPlagasDetectadas: 2,
      detecciones: [{ clase: 'Gusano cogollero', confianza: 0.95 }],
      recomendaciones: ['Aplicar control biológico'],
    });

    expect(resultado).toBeDefined();
    expect(resultado.codigo).toContain('DIAG-');
    expect(resultado.esAlerta).toBe(true);
    expect(resultado.estadoGeneral).toBe(EstadoSaludFoliar.ALERTA);
    expect(mockDiagnosticoRepo.crear).toHaveBeenCalledTimes(1);
    expect(mockAlertasService.emitirAlerta).toHaveBeenCalledTimes(1);
  });

  it('debe registrar un diagnóstico como NO ALERTA (esAlerta: false) si el estado es OPTIMO y 0 plagas', async () => {
    const resultado = await casoUso.ejecutar({
      parcelaId: 'parcela-uuid-1',
      latitud: -11.95,
      longitud: -76.98,
      estadoGeneral: EstadoSaludFoliar.OPTIMO,
      saludPorcentaje: 98,
      totalPlagasDetectadas: 0,
      detecciones: [],
      recomendaciones: [],
    });

    expect(resultado.esAlerta).toBe(false);
    expect(resultado.estadoGeneral).toBe(EstadoSaludFoliar.OPTIMO);
  });

  it('debe respetar el flag explícito esAlerta si viene especificado', async () => {
    const resultado = await casoUso.ejecutar({
      parcelaId: 'parcela-uuid-1',
      latitud: -11.95,
      longitud: -76.98,
      estadoGeneral: EstadoSaludFoliar.OPTIMO,
      saludPorcentaje: 90,
      totalPlagasDetectadas: 0,
      esAlerta: true, // Forzado por el usuario/técnico
    });

    expect(resultado.esAlerta).toBe(true);
  });

  it('debe lanzar NotFoundException si la parcela indicada no existe', async () => {
    vi.mocked(mockParcelaRepo.buscarPorId).mockResolvedValue(null);

    await expect(
      casoUso.ejecutar({
        parcelaId: 'parcela-inexistente',
        latitud: -11.95,
        longitud: -76.98,
        estadoGeneral: EstadoSaludFoliar.OPTIMO,
        saludPorcentaje: 95,
        totalPlagasDetectadas: 0,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});

