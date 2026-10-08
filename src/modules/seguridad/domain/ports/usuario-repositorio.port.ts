import { Usuario } from '../entities/usuario.entity.js';

export interface FiltrosListarUsuarios {
  busqueda?: string;
  rol?: string;
  activo?: boolean;
  pagina?: number;
  limite?: number;
}

export const USUARIO_REPOSITORIO_PORT = Symbol('USUARIO_REPOSITORIO_PORT');

/**
 * @description Puerto para el repositorio de persistencia de usuarios.
 */
export interface IUsuarioRepositorio {
  buscarPorCorreo(correo: string): Promise<Usuario | null>;
  buscarPorId(id: string): Promise<Usuario | null>;
  listar(filtros?: FiltrosListarUsuarios): Promise<{ usuarios: Usuario[]; total: number }>;
  crear(usuario: Usuario): Promise<Usuario>;
  actualizar(usuario: Usuario): Promise<Usuario | null>;
  actualizarEstado(id: string, activo: boolean): Promise<Usuario | null>;
  eliminar(id: string): Promise<boolean>;
}

