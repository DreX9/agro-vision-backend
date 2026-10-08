import { TipoActividad, EstadoActividad } from '@prisma/client';

export interface TrabajadorAsignadoProps {
  id: string;
  usuarioId: string;
  nombres: string;
  apellidos: string;
  rolEnActividad?: string | null;
  telefono?: string | null;
}

export interface RecursoAsignadoProps {
  id: string;
  insumoId: string;
  nombreInsumo: string;
  categoriaInsumo: string;
  cantidadEstimada: number;
  unidadMedida: string;
  notas?: string | null;
}

export interface ActividadAgricolaProps {
  id: string;
  codigo: string;
  titulo: string;
  tipo: TipoActividad;
  descripcion?: string | null;
  observaciones?: string | null;
  parcelaId: string;
  parcelaNombre?: string;
  cultivoNombre?: string;
  usuarioResponsableId?: string | null;
  usuarioResponsableNombre?: string | null;
  fechaInicio: Date;
  fechaFin?: Date | null;
  estado: EstadoActividad;
  cantidadTrabajadores?: number;
  trabajadores?: TrabajadorAsignadoProps[];
  recursos?: RecursoAsignadoProps[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description Entidad de dominio que representa una actividad o labor de campo agrícola.
 */
export class ActividadAgricola {
  private readonly props: ActividadAgricolaProps;

  constructor(props: ActividadAgricolaProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get codigo(): string {
    return this.props.codigo;
  }

  get titulo(): string {
    return this.props.titulo;
  }

  get tipo(): TipoActividad {
    return this.props.tipo;
  }

  get descripcion(): string | null | undefined {
    return this.props.descripcion;
  }

  get observaciones(): string | null | undefined {
    return this.props.observaciones;
  }

  get parcelaId(): string {
    return this.props.parcelaId;
  }

  get parcelaNombre(): string | undefined {
    return this.props.parcelaNombre;
  }

  get cultivoNombre(): string | undefined {
    return this.props.cultivoNombre;
  }

  get usuarioResponsableId(): string | null | undefined {
    return this.props.usuarioResponsableId;
  }

  get usuarioResponsableNombre(): string | null | undefined {
    return this.props.usuarioResponsableNombre;
  }

  get fechaInicio(): Date {
    return this.props.fechaInicio;
  }

  get fechaFin(): Date | null | undefined {
    return this.props.fechaFin;
  }

  get estado(): EstadoActividad {
    return this.props.estado;
  }

  get cantidadTrabajadores(): number {
    return this.props.cantidadTrabajadores ?? (this.props.trabajadores?.length || 0);
  }

  get trabajadores(): TrabajadorAsignadoProps[] {
    return this.props.trabajadores || [];
  }

  get recursos(): RecursoAsignadoProps[] {
    return this.props.recursos || [];
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
