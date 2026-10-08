import { RolUsuario, SexoUsuario } from '@prisma/client';

/**
 * @description Comando con datos validados para la actualización de un usuario existente.
 */
export class ActualizarUsuarioCommand {
  constructor(
    public readonly id: string,
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly correo: string,
    public readonly rol: RolUsuario,
    public readonly password?: string | null,
    public readonly telefono?: string | null,
    public readonly sexo?: SexoUsuario | null,
    public readonly fechaNacimiento?: Date | null,
    public readonly direccion?: string | null,
    public readonly departamento?: string | null,
    public readonly provincia?: string | null,
  ) {}
}
