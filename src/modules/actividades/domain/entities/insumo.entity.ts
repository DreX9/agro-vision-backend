import { CategoriaInsumo } from '@prisma/client';

export interface InsumoProps {
  id: string;
  codigo: string;
  nombre: string;
  categoria: CategoriaInsumo;
  unidadMedida: string;
  descripcion?: string | null;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description Entidad de dominio que representa un insumo, fertilizante, fitosanitario o equipo agrícola.
 */
export class Insumo {
  private readonly props: InsumoProps;

  constructor(props: InsumoProps) {
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

  get categoria(): CategoriaInsumo {
    return this.props.categoria;
  }

  get unidadMedida(): string {
    return this.props.unidadMedida;
  }

  get descripcion(): string | null | undefined {
    return this.props.descripcion;
  }

  get activo(): boolean {
    return this.props.activo;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }
}
