import { DiagnosticoCampo } from '../entities/diagnostico-campo.entity.js';

export interface FiltrosListarDiagnosticos {
  parcelaId?: string;
  sectorId?: string;
  estadoGeneral?: string;
  esAlerta?: boolean;
  pagina?: number;
  limite?: number;
}

export const DIAGNOSTICO_CAMPO_REPOSITORIO_PORT = Symbol('DIAGNOSTICO_CAMPO_REPOSITORIO_PORT');

export interface IDiagnosticoCampoRepositorio {
  listar(filtros?: FiltrosListarDiagnosticos): Promise<{ diagnosticos: DiagnosticoCampo[]; total: number }>;
  buscarPorId(id: string): Promise<DiagnosticoCampo | null>;
  crear(diagnostico: DiagnosticoCampo): Promise<DiagnosticoCampo>;
  contarTotal(): Promise<number>;
}
