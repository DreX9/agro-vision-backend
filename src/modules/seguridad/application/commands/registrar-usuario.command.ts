import { RolUsuario, SexoUsuario } from '@prisma/client';

/**
 * @description Comando con los datos validados para registrar un nuevo usuario.
 */
export class RegistrarUsuarioCommand {
  constructor(
    public readonly nombres: string,
    public readonly apellidos: string,
    public readonly correo: string,
    public readonly password: string,
    public readonly rol: RolUsuario,
    public readonly telefono?: string | null,
    public readonly sexo?: SexoUsuario | null,
    public readonly fechaNacimiento?: Date | null,
    public readonly direccion?: string | null,
    public readonly departamento?: string | null,
    public readonly provincia?: string | null,
  ) {}
}
