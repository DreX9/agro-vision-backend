/**
 * @description Clase base para errores del dominio de actividades agrícolas.
 */
export abstract class ActividadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ActividadCodigoYaExisteError extends ActividadError {
  constructor(codigo: string) {
    super(`El código de actividad "${codigo}" ya se encuentra registrado.`);
  }
}

export class ActividadNoEncontradaError extends ActividadError {
  constructor(id: string) {
    super(`No se encontró la actividad agrícola con identificador ${id}.`);
  }
}

export class InsumoNoEncontradoError extends ActividadError {
  constructor(id: string) {
    super(`No se encontró el insumo agrícola con identificador ${id}.`);
  }
}
