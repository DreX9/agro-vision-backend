import { EstadoParcela } from '@prisma/client';

/**
 * @description Comando para actualizar los datos de una parcela existente.
 */
export class ActualizarParcelaCommand {
  constructor(
    public readonly id: string,
    public readonly nombre?: string,
    public readonly areaHectareas?: number,
    public readonly cultivoId?: string,
    public readonly variedad?: string,
    public readonly usuarioResponsableId?: string,
    public readonly ubicacion?: string,
    public readonly departamento?: string,
    public readonly provincia?: string,
    public readonly distrito?: string,
    public readonly estado?: EstadoParcela,
    public readonly delimitacionGeoJson?: unknown,
    public readonly latitudCentro?: number,
    public readonly longitudCentro?: number,
    public readonly actualizadoPor?: string,
  ) {}
}
