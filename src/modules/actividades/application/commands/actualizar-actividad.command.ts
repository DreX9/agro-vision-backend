import { TipoActividad, EstadoActividad } from '@prisma/client';
import {
  TrabajadorAsignarComando,
  RecursoAsignarComando,
} from './registrar-actividad.command.js';

/**
 * @description Comando para actualizar una actividad agrícola existente.
 */
export class ActualizarActividadCommand {
  constructor(
    public readonly id: string,
    public readonly titulo?: string,
    public readonly tipo?: TipoActividad,
    public readonly parcelaId?: string,
    public readonly fechaInicio?: Date,
    public readonly fechaFin?: Date,
    public readonly usuarioResponsableId?: string,
    public readonly descripcion?: string,
    public readonly observaciones?: string,
    public readonly estado?: EstadoActividad,
    public readonly trabajadores?: TrabajadorAsignarComando[],
    public readonly recursos?: RecursoAsignarComando[],
    public readonly actualizadoPor?: string,
  ) {}
}
