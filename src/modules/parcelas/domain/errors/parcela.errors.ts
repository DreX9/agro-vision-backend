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

export class SectorNoEncontradoError extends ParcelaError {
  constructor(id: string) {
    super(`No se encontró el sector o área de cultivo con identificador ${id}.`);
  }
}

export class SectorCodigoYaExisteError extends ParcelaError {
  constructor(codigo: string) {
    super(`El código de sector "${codigo}" ya está registrado en esta parcela.`);
  }
}

export class SectorSuperaAreaDisponibleError extends ParcelaError {
  constructor(areaSolicitada: number, areaDisponible: number) {
    super(
      `El área solicitada (${areaSolicitada.toFixed(2)} ha) supera el área disponible restante de la parcela (${areaDisponible.toFixed(2)} ha).`,
    );
  }
}

