import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoSaludFoliar } from '@prisma/client';
import { DiagnosticoCampo } from '../../domain/entities/diagnostico-campo.entity.js';

export class DiagnosticoItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  codigo!: string;

  @ApiProperty()
  parcelaId!: string;

  @ApiPropertyOptional()
  parcelaNombre?: string | null;

  @ApiPropertyOptional()
  parcelaCodigo?: string | null;

  @ApiPropertyOptional()
  sectorId?: string | null;

  @ApiPropertyOptional()
  sectorNombre?: string | null;

  @ApiPropertyOptional()
  sectorCodigo?: string | null;

  @ApiPropertyOptional()
  cultivoNombre?: string | null;

  @ApiPropertyOptional()
  cultivoVariedad?: string | null;

  @ApiPropertyOptional()
  usuarioId?: string | null;

  @ApiPropertyOptional()
  usuarioNombre?: string | null;

  @ApiProperty()
  latitud!: number;

  @ApiProperty()
  longitud!: number;

  @ApiProperty({ enum: EstadoSaludFoliar })
  estadoGeneral!: EstadoSaludFoliar;

  @ApiProperty()
  saludPorcentaje!: number;

  @ApiProperty()
  totalPlagasDetectadas!: number;

  @ApiPropertyOptional()
  detecciones?: unknown;

  @ApiPropertyOptional()
  recomendaciones?: unknown;

  @ApiPropertyOptional()
  tiempoProcesamientoMs?: number | null;

  @ApiPropertyOptional()
  imagenUrl?: string | null;

  @ApiPropertyOptional()
  origenCaptura?: string | null;

  @ApiPropertyOptional()
  observaciones?: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;

  static desdeEntidad(e: DiagnosticoCampo): DiagnosticoItemDto {
    return {
      id: e.id,
      codigo: e.codigo,
      parcelaId: e.parcelaId,
      parcelaNombre: e.parcelaNombre,
      parcelaCodigo: e.parcelaCodigo,
      sectorId: e.sectorId,
      sectorNombre: e.sectorNombre,
      sectorCodigo: e.sectorCodigo,
      cultivoNombre: e.cultivoNombre,
      cultivoVariedad: e.cultivoVariedad,
      usuarioId: e.usuarioId,
      usuarioNombre: e.usuarioNombre,
      latitud: e.latitud,
      longitud: e.longitud,
      estadoGeneral: e.estadoGeneral,
      saludPorcentaje: e.saludPorcentaje,
      totalPlagasDetectadas: e.totalPlagasDetectadas,
      detecciones: e.detecciones,
      recomendaciones: e.recomendaciones,
      tiempoProcesamientoMs: e.tiempoProcesamientoMs,
      imagenUrl: e.imagenUrl,
      origenCaptura: e.origenCaptura,
      observaciones: e.observaciones,
      createdAt: e.createdAt.toISOString(),
      updatedAt: e.updatedAt.toISOString(),
    };
  }
}

export class RespuestaPaginadaDiagnosticosDto {
  @ApiProperty({ type: [DiagnosticoItemDto] })
  items!: DiagnosticoItemDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  pagina!: number;

  @ApiProperty()
  limite!: number;

  @ApiProperty()
  totalPaginas!: number;
}
