import { EstadoParcela } from '@prisma/client';

export interface ParcelaProps {
  id: string;
  codigo: string;
  nombre: string;
  areaHectareas: number;
  cultivoId: string;
  cultivoNombre?: string;
  cultivoColorHex?: string | null;
  variedad?: string | null;
  usuarioResponsableId?: string | null;
  usuarioResponsableNombre?: string | null;
  ubicacion?: string | null;
  departamento?: string | null;
  provincia?: string | null;
  distrito?: string | null;
  estado: EstadoParcela;
  delimitacionGeoJson?: unknown;
  latitudCentro?: number | null;
  longitudCentro?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description Entidad de dominio que representa una parcela o lote agrícola georreferenciado.
 */
export class Parcela {
  private readonly props: ParcelaProps;

  constructor(props: ParcelaProps) {
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

  get cultivoId(): string {
    return this.props.cultivoId;
  }

  get cultivoNombre(): string | undefined {
    return this.props.cultivoNombre;
  }

  get cultivoColorHex(): string | null | undefined {
    return this.props.cultivoColorHex;
  }

  get variedad(): string | null | undefined {
    return this.props.variedad;
  }

  get usuarioResponsableId(): string | null | undefined {
    return this.props.usuarioResponsableId;
  }

  get usuarioResponsableNombre(): string | null | undefined {
    return this.props.usuarioResponsableNombre;
  }

  get ubicacion(): string | null | undefined {
    return this.props.ubicacion;
  }

  get departamento(): string | null | undefined {
    return this.props.departamento;
  }

  get provincia(): string | null | undefined {
    return this.props.provincia;
  }

  get distrito(): string | null | undefined {
    return this.props.distrito;
  }

  get estado(): EstadoParcela {
    return this.props.estado;
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

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
