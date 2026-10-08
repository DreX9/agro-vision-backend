/**
 * @description Parámetros de consulta y paginación para listar parcelas.
 */
export class ListarParcelasQuery {
  constructor(
    public readonly busqueda?: string,
    public readonly cultivoId?: string,
    public readonly estado?: string,
    public readonly usuarioResponsableId?: string,
    public readonly pagina: number = 1,
    public readonly limite: number = 10,
  ) {}
}
