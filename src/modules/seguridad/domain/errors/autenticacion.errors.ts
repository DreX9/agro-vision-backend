/**
 * @description Error emitido cuando las credenciales de acceso son incorrectas.
 */
export class CredencialesInvalidasError extends Error {
  constructor() {
    super('El correo electrónico o la contraseña ingresada son incorrectos.');
    this.name = 'CredencialesInvalidasError';
  }
}

/**
 * @description Error emitido cuando el usuario intenta acceder pero se encuentra inactivo o suspendido.
 */
export class UsuarioInactivoError extends Error {
  constructor(correo: string) {
    super(`La cuenta asociada al correo "${correo}" se encuentra inactiva. Contacte al administrador.`);
    this.name = 'UsuarioInactivoError';
  }
}

/**
 * @description Error emitido al intentar registrar un usuario con un correo ya existente.
 */
export class CorreoYaRegistradoError extends Error {
  constructor(correo: string) {
    super(`El correo electrónico "${correo}" ya se encuentra registrado en el sistema.`);
    this.name = 'CorreoYaRegistradoError';
  }
}

/**
 * @description Error emitido cuando no se encuentra un usuario por su ID.
 */
export class UsuarioNoEncontradoError extends Error {
  constructor(id: string) {
    super(`No se encontró ningún usuario con el identificador "${id}".`);
    this.name = 'UsuarioNoEncontradoError';
  }
}

export type AutenticacionError =
  | CredencialesInvalidasError
  | UsuarioInactivoError
  | CorreoYaRegistradoError
  | UsuarioNoEncontradoError;
