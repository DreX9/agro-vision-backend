export const HASHING_SERVICIO_PORT = Symbol('HASHING_SERVICIO_PORT');

/**
 * @description Puerto para servicios de encriptación y comparación de contraseñas.
 */
export interface IHashingServicio {
  comparar(textoPlano: string, hash: string): Promise<boolean>;
  encriptar(textoPlano: string): Promise<string>;
}
