import { RolUsuario, SexoUsuario } from '@prisma/client';

export interface UsuarioProps {
  id: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string | null;
  passwordHash: string;
  rol: RolUsuario;
  sexo?: SexoUsuario | null;
  fechaNacimiento?: Date | null;
  direccion?: string | null;
  departamento?: string | null;
  provincia?: string | null;
  activo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * @description Entidad de dominio que representa a un usuario del sistema agrícola.
 */
export class Usuario {
  private readonly props: UsuarioProps;

  constructor(props: UsuarioProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get nombres(): string {
    return this.props.nombres;
  }

  get apellidos(): string {
    return this.props.apellidos;
  }

  get nombreCompleto(): string {
    return `${this.props.nombres} ${this.props.apellidos}`.trim();
  }

  get correo(): string {
    return this.props.correo;
  }

  get telefono(): string | null | undefined {
    return this.props.telefono;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get rol(): RolUsuario {
    return this.props.rol;
  }

  get sexo(): SexoUsuario | null | undefined {
    return this.props.sexo;
  }

  get fechaNacimiento(): Date | null | undefined {
    return this.props.fechaNacimiento;
  }

  get direccion(): string | null | undefined {
    return this.props.direccion;
  }

  get departamento(): string | null | undefined {
    return this.props.departamento;
  }

  get provincia(): string | null | undefined {
    return this.props.provincia;
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
