import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { EstadoParcela } from '@prisma/client';
import { RegistrarSectorParcelaCasoUso } from './registrar-sector-parcela.caso-uso.js';
import { IParcelaRepositorio } from '../../domain/ports/parcela-repositorio.port.js';
import { ISectorParcelaRepositorio } from '../../domain/ports/sector-parcela-repositorio.port.js';
import { Parcela } from '../../domain/entities/parcela.entity.js';
import { SectorParcela } from '../../domain/entities/sector-parcela.entity.js';
import {
  ParcelaNoEncontradaError,
  SectorSuperaAreaDisponibleError,
} from '../../domain/errors/parcela.errors.js';
import { PrismaService } from '@/prisma/prisma.service.js';

describe('RegistrarSectorParcelaCasoUso', () => {
  let casoUso: RegistrarSectorParcelaCasoUso;
  let mockParcelaRepo: IParcelaRepositorio;
  let mockSectorRepo: ISectorParcelaRepositorio;
  let mockPrisma: Partial<PrismaService>;

  const parcelaMock = new Parcela({
    id: '0192a6c0-0000-7000-8000-000000000001',
    codigo: 'P-001',
    nombre: 'Lote Santa Rosa',
    areaHectareas: 10.0,
    estado: EstadoParcela.ACTIVA,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const cultivoMock = {
    id: '0192a6c0-0000-7000-8000-000000000099',
    nombre: 'Palto',
    colorHex: '#15803D',
  };

  beforeEach(() => {
    mockParcelaRepo = {
      listar: vi.fn(),
      buscarPorId: vi.fn(),
      buscarPorCodigo: vi.fn(),
      crear: vi.fn(),
      actualizar: vi.fn(),
      actualizarEstado: vi.fn(),
      eliminar: vi.fn(),
      contarTotal: vi.fn(),
    };

    mockSectorRepo = {
      listarPorParcela: vi.fn(),
      buscarPorId: vi.fn(),
      crear: vi.fn(),
      actualizar: vi.fn(),
      eliminar: vi.fn(),
      obtenerSiguienteCorrelativo: vi.fn(),
      sumarAreaAsignada: vi.fn(),
    };

    mockPrisma = {
      cultivo: {
        findUnique: vi.fn(),
      } as any,
    };

    casoUso = new RegistrarSectorParcelaCasoUso(
      mockParcelaRepo,
      mockSectorRepo,
      mockPrisma as PrismaService,
    );
  });

  it('debe registrar exitosamente un sector dentro del área disponible', async () => {
    vi.mocked(mockParcelaRepo.buscarPorId).mockResolvedValue(parcelaMock);
    vi.mocked(mockPrisma.cultivo!.findUnique).mockResolvedValue(cultivoMock as any);
    vi.mocked(mockSectorRepo.sumarAreaAsignada).mockResolvedValue(4.0); // 4 ha ocupadas de 10 ha
    vi.mocked(mockSectorRepo.obtenerSiguienteCorrelativo).mockResolvedValue('P-001-S02');

    const sectorGuardado = new SectorParcela({
      id: '0192a6c0-0000-7000-8000-000000000777',
      codigo: 'P-001-S02',
      nombre: 'Sector Norte',
      areaHectareas: 3.5,
      colorHex: '#15803D',
      parcelaId: parcelaMock.id,
      parcelaCodigo: parcelaMock.codigo,
      parcelaNombre: parcelaMock.nombre,
      cultivoId: cultivoMock.id,
      cultivoNombre: cultivoMock.nombre,
      cultivoColorHex: cultivoMock.colorHex,
      estado: EstadoParcela.ACTIVA,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    vi.mocked(mockSectorRepo.crear).mockResolvedValue(sectorGuardado);

    const resultado = await casoUso.ejecutar(parcelaMock.id, {
      nombre: 'Sector Norte',
      cultivoId: cultivoMock.id,
      areaHectareas: 3.5,
      delimitacionGeoJson: [{ latitude: -13.1, longitude: -76.3 }],
    });

    expect(resultado.codigo).toBe('P-001-S02');
    expect(resultado.areaHectareas).toBe(3.5);
    expect(resultado.cultivoNombre).toBe('Palto');
    expect(mockSectorRepo.crear).toHaveBeenCalledTimes(1);
  });

  it('debe lanzar SectorSuperaAreaDisponibleError si el área solicitada supera lo disponible', async () => {
    vi.mocked(mockParcelaRepo.buscarPorId).mockResolvedValue(parcelaMock);
    vi.mocked(mockPrisma.cultivo!.findUnique).mockResolvedValue(cultivoMock as any);
    vi.mocked(mockSectorRepo.sumarAreaAsignada).mockResolvedValue(8.0); // 8 ha ocupadas de 10 ha (quedan 2 ha)

    await expect(
      casoUso.ejecutar(parcelaMock.id, {
        nombre: 'Sector Demasiado Grande',
        cultivoId: cultivoMock.id,
        areaHectareas: 4.0, // 4 ha > 2 ha disponibles
        delimitacionGeoJson: [],
      }),
    ).rejects.toThrow(SectorSuperaAreaDisponibleError);

    expect(mockSectorRepo.crear).not.toHaveBeenCalled();
  });

  it('debe lanzar ParcelaNoEncontradaError si la parcela no existe', async () => {
    vi.mocked(mockParcelaRepo.buscarPorId).mockResolvedValue(null);

    await expect(
      casoUso.ejecutar('id-invalido', {
        nombre: 'Sector X',
        cultivoId: cultivoMock.id,
        areaHectareas: 2.0,
        delimitacionGeoJson: [],
      }),
    ).rejects.toThrow(ParcelaNoEncontradaError);
  });
});
