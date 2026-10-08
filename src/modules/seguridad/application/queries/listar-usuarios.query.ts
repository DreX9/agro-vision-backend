/**
 * @description Parámetros de consulta y paginación para el listado de usuarios.
 */
export class ListarUsuariosQuery {
  constructor(
    public readonly busqueda?: string,
    public readonly rol?: string,
    public readonly activo?: boolean,
    public readonly pagina: number = 1,
    public readonly limite: number = 10,
  ) {}
}
