import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IHashingServicio } from '../../domain/ports/hashing-servicio.port.js';

/**
 * @description Servicio de encriptación y validación de contraseñas usando bcrypt.
 */
@Injectable()
export class BcryptHashingService implements IHashingServicio {
  private readonly saltRounds = 10;

  /**
   * @description Compara un texto en plano contra un hash almacenado.
   */
  async comparar(textoPlano: string, hash: string): Promise<boolean> {
    return bcrypt.compare(textoPlano, hash);
  }

  /**
   * @description Genera un hash seguro a partir de una contraseña en texto plano.
   */
  async encriptar(textoPlano: string): Promise<string> {
    return bcrypt.hash(textoPlano, this.saltRounds);
  }
}
