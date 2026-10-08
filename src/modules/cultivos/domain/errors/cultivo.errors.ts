/**
 * @description Clase base para errores del dominio de cultivos.
 */
export abstract class CultivoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class CultivoYaExisteError extends CultivoError {
  constructor(nombre: string) {
    super(`El cultivo con nombre "${nombre}" ya se encuentra registrado.`);
  }
}

export class CultivoNoEncontradoError extends CultivoError {
  constructor(id: string) {
    super(`No se encontró el cultivo con identificador ${id}.`);
  }
}

export class CultivoEnUsoError extends CultivoError {
  constructor(id: string) {
    super(`No se puede eliminar el cultivo con ID ${id} porque tiene parcelas asociadas.`);
  }
}
