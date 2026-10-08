import { ActividadAgricola } from '../entities/actividad-agricola.entity.js';

export interface FiltrosListarActividades {
  busqueda?: string;
  parcelaId?: string;
  tipo?: string;
  estado?: string;
  usuarioResponsableId?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  pagina?: number;
  limite?: number;
}

export interface TrabajadorEntrada {
  usuarioId: string;
  rolEnActividad?: string;
}

export interface RecursoEntrada {
  insumoId: string;
  cantidadEstimada: number;
  unidadMedida: string;
  notas?: string;
}

export const ACTIVIDAD_REPOSITORIO_PORT = Symbol('ACTIVIDAD_REPOSITORIO_PORT');

/**
 * @description Puerto del repositorio de persistencia para actividades agrícolas.
 */
export interface IActividadRepositorio {
  listar(filtros?: FiltrosListarActividades): Promise<{ actividades: ActividadAgricola[]; total: number }>;
  buscarPorId(id: string): Promise<ActividadAgricola | null>;
  buscarPorCodigo(codigo: string): Promise<ActividadAgricola | null>;
  crear(
    actividad: ActividadAgricola,
    trabajadores: TrabajadorEntrada[],
    recursos: RecursoEntrada[],
  ): Promise<ActividadAgricola>;
  actualizar(
    actividad: ActividadAgricola,
    trabajadores?: TrabajadorEntrada[],
    recursos?: RecursoEntrada[],
  ): Promise<ActividadAgricola | null>;
  actualizarEstado(id: string, estado: string): Promise<ActividadAgricola | null>;
  eliminar(id: string): Promise<boolean>;
  contarTotal(): Promise<number>;
}
