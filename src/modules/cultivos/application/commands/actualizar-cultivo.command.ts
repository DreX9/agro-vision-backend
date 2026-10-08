/**
 * @description Comando para actualizar un cultivo existente en el catálogo.
 */
export class ActualizarCultivoCommand {
  constructor(
    public readonly id: string,
    public readonly nombre?: string,
    public readonly nombreCientifico?: string | null,
    public readonly variedadesDefault?: string[],
    public readonly colorHex?: string | null,
    public readonly activo?: boolean,
  ) {}
}
