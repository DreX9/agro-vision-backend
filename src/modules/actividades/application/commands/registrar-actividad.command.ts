import { TipoActividad, EstadoActividad } from '@prisma/client';

export interface TrabajadorAsignarComando {
  usuarioId: string;
  rolEnActividad?: string;
}

export interface RecursoAsignarComando {
  insumoId: string;
  cantidadEstimada: number;
  unidadMedida: string;
  notas?: string;
}

/**
 * @description Comando para registrar una nueva actividad agrícola.
 */
export class RegistrarActividadCommand {
  constructor(
    public readonly codigo: string | undefined,
    public readonly titulo: string,
    public readonly tipo: TipoActividad,
    public readonly parcelaId: string,
    public readonly fechaInicio: Date,
    public readonly fechaFin?: Date,
    public readonly usuarioResponsableId?: string,
    public readonly descripcion?: string,
    public readonly observaciones?: string,
    public readonly estado?: EstadoActividad,
    public readonly trabajadores: TrabajadorAsignarComando[] = [],
    public readonly recursos: RecursoAsignarComando[] = [],
    public readonly creadoPor?: string,
  ) {}
}
