import { EstadoSaludFoliar } from '@prisma/client';

export interface DiagnosticoCampoProps {
  id: string;
  codigo: string;
  parcelaId: string;
  parcelaNombre?: string | null;
  parcelaCodigo?: string | null;
  sectorId?: string | null;
  sectorNombre?: string | null;
  sectorCodigo?: string | null;
  cultivoNombre?: string | null;
  cultivoVariedad?: string | null;
  usuarioId?: string | null;
  usuarioNombre?: string | null;
  latitud: number;
  longitud: number;
  estadoGeneral: EstadoSaludFoliar;
  saludPorcentaje: number;
  totalPlagasDetectadas: number;
  detecciones: unknown;
  recomendaciones: unknown;
  tiempoProcesamientoMs?: number | null;
  imagenUrl?: string | null;
  origenCaptura?: string | null;
  observaciones?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description Entidad de dominio que representa un registro fitosanitario capturado en campo por dron/cámara.
 */
export class DiagnosticoCampo {
  private readonly props: DiagnosticoCampoProps;

  constructor(props: DiagnosticoCampoProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get codigo(): string {
    return this.props.codigo;
  }

  get parcelaId(): string {
    return this.props.parcelaId;
  }

  get parcelaNombre(): string | null | undefined {
    return this.props.parcelaNombre;
  }

  get parcelaCodigo(): string | null | undefined {
    return this.props.parcelaCodigo;
  }

  get sectorId(): string | null | undefined {
    return this.props.sectorId;
  }

  get sectorNombre(): string | null | undefined {
    return this.props.sectorNombre;
  }

  get sectorCodigo(): string | null | undefined {
    return this.props.sectorCodigo;
  }

  get cultivoNombre(): string | null | undefined {
    return this.props.cultivoNombre;
  }

  get cultivoVariedad(): string | null | undefined {
    return this.props.cultivoVariedad;
  }

  get usuarioId(): string | null | undefined {
    return this.props.usuarioId;
  }

  get usuarioNombre(): string | null | undefined {
    return this.props.usuarioNombre;
  }

  get latitud(): number {
    return this.props.latitud;
  }

  get longitud(): number {
    return this.props.longitud;
  }

  get estadoGeneral(): EstadoSaludFoliar {
    return this.props.estadoGeneral;
  }

  get saludPorcentaje(): number {
    return this.props.saludPorcentaje;
  }

  get totalPlagasDetectadas(): number {
    return this.props.totalPlagasDetectadas;
  }

  get detecciones(): unknown {
    return this.props.detecciones;
  }

  get recomendaciones(): unknown {
    return this.props.recomendaciones;
  }

  get tiempoProcesamientoMs(): number | null | undefined {
    return this.props.tiempoProcesamientoMs;
  }

  get imagenUrl(): string | null | undefined {
    return this.props.imagenUrl;
  }

  get origenCaptura(): string | null | undefined {
    return this.props.origenCaptura;
  }

  get observaciones(): string | null | undefined {
    return this.props.observaciones;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
