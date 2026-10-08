/**
 * @description Comando con los parámetros requeridos para la autenticación de un usuario.
 */
export class IniciarSesionCommand {
  constructor(
    public readonly correo: string,
    public readonly password: string,
  ) {}
}
