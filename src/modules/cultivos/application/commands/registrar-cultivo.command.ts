/**
 * @description Comando para registrar un nuevo cultivo en el catálogo del sistema.
 */
export class RegistrarCultivoCommand {
  constructor(
    public readonly nombre: string,
    public readonly nombreCientifico?: string | null,
    public readonly variedadesDefault: string[] = [],
    public readonly colorHex?: string | null,
  ) {}
}
