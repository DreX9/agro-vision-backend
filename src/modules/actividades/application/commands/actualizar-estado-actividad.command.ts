import { EstadoActividad } from '@prisma/client';

/**
 * @description Comando para actualizar el estado operativo de una actividad.
 */
export class ActualizarEstadoActividadCommand {
  constructor(
    public readonly id: string,
    public readonly estado: EstadoActividad,
    public readonly actualizadoPor?: string,
  ) {}
}
