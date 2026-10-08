import { EstadoParcela } from '@prisma/client';

/**
 * @description Comando para registrar una nueva parcela en el sistema.
 */
export class RegistrarParcelaCommand {
  constructor(
    public readonly codigo: string | undefined,
    public readonly nombre: string,
    public readonly areaHectareas: number,
    public readonly cultivoId: string,
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
    public readonly creadoPor?: string,
  ) {}
}
