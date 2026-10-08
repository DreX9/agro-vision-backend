/**
 * @description Parámetros de consulta y paginación para el listado de actividades.
 */
export class ListarActividadesQuery {
  constructor(
    public readonly busqueda?: string,
    public readonly parcelaId?: string,
    public readonly tipo?: string,
    public readonly estado?: string,
    public readonly usuarioResponsableId?: string,
    public readonly fechaDesde?: Date,
    public readonly fechaHasta?: Date,
    public readonly pagina: number = 1,
    public readonly limite: number = 10,
  ) {}
}
