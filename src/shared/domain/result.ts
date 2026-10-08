/**
 * @description Implementación funcional del patrón Result para evitar excepciones no controladas.
 */
export class Result<T, E> {
  private readonly _isSuccess: boolean;
  private readonly _value?: T;
  private readonly _error?: E;

  private constructor(isSuccess: boolean, value?: T, error?: E) {
    this._isSuccess = isSuccess;
    this._value = value;
    this._error = error;
  }

  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  public get isFailure(): boolean {
    return !this._isSuccess;
  }

  public get value(): T {
    if (!this._isSuccess) {
      throw new Error('No se puede obtener el valor de un Result fallido.');
    }
    return this._value as T;
  }

  public get error(): E {
    if (this._isSuccess) {
      throw new Error('No se puede obtener el error de un Result exitoso.');
    }
    return this._error as E;
  }

  public static ok<T, E = never>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  public static fail<T = never, E = unknown>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }
}
