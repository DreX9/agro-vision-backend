/**
 * @description Propiedades de dominio de la entidad Cultivo.
 */
export interface CultivoProps {
  id: string;
  nombre: string;
  nombreCientifico?: string | null;
  variedadesDefault: string[];
  colorHex?: string | null;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description Entidad de dominio para representar un tipo de cultivo agrícola.
 */
export class Cultivo {
  private readonly props: CultivoProps;

  constructor(props: CultivoProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get nombre(): string {
    return this.props.nombre;
  }

  get nombreCientifico(): string | null | undefined {
    return this.props.nombreCientifico;
  }

  get variedadesDefault(): string[] {
    return this.props.variedadesDefault;
  }

  get colorHex(): string | null | undefined {
    return this.props.colorHex;
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
