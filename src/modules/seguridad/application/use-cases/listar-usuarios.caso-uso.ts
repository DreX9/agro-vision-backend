import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import { ListarUsuariosQuery } from '../queries/listar-usuarios.query.js';
import { UsuarioItemDto } from '../dtos/usuario-item.dto.js';
import {
  type IUsuarioRepositorio,
  USUARIO_REPOSITORIO_PORT,
} from '../../domain/ports/usuario-repositorio.port.js';

export interface ListaPaginadaUsuarios {
  elementos: UsuarioItemDto[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

/**
 * @description Caso de uso para obtener la lista paginada y filtrada de usuarios.
 */
@Injectable()
export class ListarUsuariosCasoUso {
  private readonly logger = new Logger(ListarUsuariosCasoUso.name);

  constructor(
    @Inject(USUARIO_REPOSITORIO_PORT)
    private readonly usuarioRepositorio: IUsuarioRepositorio,
  ) {}

  /**
   * @description Ejecuta la búsqueda paginada de usuarios en el repositorio.
   */
  async ejecutar(
    query: ListarUsuariosQuery,
  ): Promise<Result<ListaPaginadaUsuarios, never>> {
    this.logger.log(`Listando usuarios - Página: ${query.pagina}, Límite: ${query.limite}`);

    const { usuarios, total } = await this.usuarioRepositorio.listar({
      busqueda: query.busqueda,
      rol: query.rol,
      activo: query.activo,
      pagina: query.pagina,
      limite: query.limite,
    });

    const elementos = usuarios.map((u) => UsuarioItemDto.desdeEntidad(u));
    const totalPaginas = Math.ceil(total / query.limite) || 1;

    return Result.ok({
      elementos,
      total,
      pagina: query.pagina,
      limite: query.limite,
      totalPaginas,
    });
  }
}
