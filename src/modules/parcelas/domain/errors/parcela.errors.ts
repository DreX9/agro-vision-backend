/**
 * @description Clase base para errores del dominio de parcelas.
 */
export abstract class ParcelaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ParcelaCodigoYaExisteError extends ParcelaError {
  constructor(codigo: string) {
    super(`El código de parcela "${codigo}" ya se encuentra registrado.`);
  }
}

export class ParcelaNoEncontradaError extends ParcelaError {
  constructor(id: string) {
    super(`No se encontró la parcela con identificador ${id}.`);
  }
}
