import { EstadoParcela } from '@prisma/client';

export interface SectorParcelaProps {
  id: string;
  codigo: string;
  nombre: string;
  areaHectareas: number;
  colorHex?: string | null;
  parcelaId: string;
  parcelaCodigo?: string | null;
  parcelaNombre?: string | null;
  cultivoId: string;
  cultivoNombre?: string | null;
  cultivoColorHex?: string | null;
  variedad?: string | null;
  delimitacionGeoJson?: unknown;
  latitudCentro?: number | null;
  longitudCentro?: number | null;
  fechaSiembra?: Date | null;
  fechaCosechaEstimada?: Date | null;
  estado: EstadoParcela;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description Entidad de dominio que representa un sector o sub-área de cultivo delimitada dentro de una parcela matriz.
 */
export class SectorParcela {
  private readonly props: SectorParcelaProps;

  constructor(props: SectorParcelaProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get codigo(): string {
    return this.props.codigo;
  }

  get nombre(): string {
    return this.props.nombre;
  }

  get areaHectareas(): number {
    return this.props.areaHectareas;
  }

  get colorHex(): string | null | undefined {
    return this.props.colorHex;
  }

  get parcelaId(): string {
    return this.props.parcelaId;
  }

  get parcelaCodigo(): string | null | undefined {
    return this.props.parcelaCodigo;
  }

  get parcelaNombre(): string | null | undefined {
    return this.props.parcelaNombre;
  }

  get cultivoId(): string {
    return this.props.cultivoId;
  }

  get cultivoNombre(): string | null | undefined {
    return this.props.cultivoNombre;
  }

  get cultivoColorHex(): string | null | undefined {
    return this.props.cultivoColorHex;
  }

  get variedad(): string | null | undefined {
    return this.props.variedad;
  }

  get delimitacionGeoJson(): unknown {
    return this.props.delimitacionGeoJson;
  }

  get latitudCentro(): number | null | undefined {
    return this.props.latitudCentro;
  }

  get longitudCentro(): number | null | undefined {
    return this.props.longitudCentro;
  }

  get fechaSiembra(): Date | null | undefined {
    return this.props.fechaSiembra;
  }

  get fechaCosechaEstimada(): Date | null | undefined {
    return this.props.fechaCosechaEstimada;
  }

  get estado(): EstadoParcela {
    return this.props.estado;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
