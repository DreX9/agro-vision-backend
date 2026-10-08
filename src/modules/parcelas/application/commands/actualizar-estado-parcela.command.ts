import { EstadoParcela } from '@prisma/client';

/**
 * @description Comando para actualizar el estado operativo de una parcela.
 */
export class ActualizarEstadoParcelaCommand {
  constructor(
    public readonly id: string,
    public readonly estado: EstadoParcela,
    public readonly actualizadoPor?: string,
  ) {}
}
