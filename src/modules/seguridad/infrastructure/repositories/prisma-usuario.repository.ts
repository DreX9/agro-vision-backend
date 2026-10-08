import { Injectable } from '@nestjs/common';
import { Prisma, RolUsuario, type Usuario as PrismaUsuario } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service.js';
import { Usuario } from '../../domain/entities/usuario.entity.js';
import {
  IUsuarioRepositorio,
  FiltrosListarUsuarios,
} from '../../domain/ports/usuario-repositorio.port.js';

/**
 * @description Repositorio de infraestructura para Usuario utilizando Prisma ORM y PostgreSQL.
 */
@Injectable()
export class PrismaUsuarioRepository implements IUsuarioRepositorio {
  constructor(private readonly prisma: PrismaService) {}

  private mapearAEntidad(registro: PrismaUsuario): Usuario {
    return new Usuario({
      id: registro.id,
      nombres: registro.nombres,
      apellidos: registro.apellidos,
      correo: registro.correo,
      telefono: registro.telefono,
      passwordHash: registro.passwordHash,
      rol: registro.rol,
      sexo: registro.sexo,
      fechaNacimiento: registro.fechaNacimiento,
      direccion: registro.direccion,
      departamento: registro.departamento,
      provincia: registro.provincia,
      activo: registro.activo,
      createdAt: registro.createdAt,
      updatedAt: registro.updatedAt,
    });
  }

  /**
   * @description Busca un usuario por su correo electrónico.
   */
  async buscarPorCorreo(correo: string): Promise<Usuario | null> {
    const registro = await this.prisma.usuario.findUnique({
      where: { correo, deletedAt: null },
    });

    if (!registro) {
      return null;
    }

    return this.mapearAEntidad(registro);
  }

  /**
   * @description Busca un usuario por su identificador único (UUID).
   */
  async buscarPorId(id: string): Promise<Usuario | null> {
    const registro = await this.prisma.usuario.findUnique({
      where: { id, deletedAt: null },
    });

    if (!registro) {
      return null;
    }

    return this.mapearAEntidad(registro);
  }

  /**
   * @description Lista usuarios con soporte para filtros de búsqueda, rol, estado y paginación.
   */
  async listar(
    filtros?: FiltrosListarUsuarios,
  ): Promise<{ usuarios: Usuario[]; total: number }> {
    const pagina = filtros?.pagina && filtros.pagina > 0 ? filtros.pagina : 1;
    const limite = filtros?.limite && filtros.limite > 0 ? filtros.limite : 10;
    const skip = (pagina - 1) * limite;

    const where: Prisma.UsuarioWhereInput = {
      deletedAt: null,
    };

    if (filtros?.activo !== undefined) {
      where.activo = filtros.activo;
    }

    if (filtros?.rol && Object.values(RolUsuario).includes(filtros.rol as RolUsuario)) {
      where.rol = filtros.rol as RolUsuario;
    }

    if (filtros?.busqueda && filtros.busqueda.trim() !== '') {
      const termino = filtros.busqueda.trim();
      where.OR = [
        { nombres: { contains: termino, mode: 'insensitive' } },
        { apellidos: { contains: termino, mode: 'insensitive' } },
        { correo: { contains: termino, mode: 'insensitive' } },
      ];
    }

    const [registros, total] = await Promise.all([
      this.prisma.usuario.findMany({
        where,
        skip,
        take: limite,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.usuario.count({ where }),
    ]);

    return {
      usuarios: registros.map((r) => this.mapearAEntidad(r)),
      total,
    };
  }

  /**
   * @description Inserta un nuevo registro de usuario en la base de datos.
   */
  async crear(usuario: Usuario): Promise<Usuario> {
    const registro = await this.prisma.usuario.create({
      data: {
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        telefono: usuario.telefono,
        passwordHash: usuario.passwordHash,
        rol: usuario.rol,
        sexo: usuario.sexo,
        fechaNacimiento: usuario.fechaNacimiento,
        direccion: usuario.direccion,
        departamento: usuario.departamento,
        provincia: usuario.provincia,
        activo: usuario.activo,
      },
    });

    return this.mapearAEntidad(registro);
  }

  /**
   * @description Actualiza los datos de un usuario existente.
   */
  async actualizar(usuario: Usuario): Promise<Usuario | null> {
    try {
      const registro = await this.prisma.usuario.update({
        where: { id: usuario.id, deletedAt: null },
        data: {
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          correo: usuario.correo,
          telefono: usuario.telefono,
          passwordHash: usuario.passwordHash,
          rol: usuario.rol,
          sexo: usuario.sexo,
          fechaNacimiento: usuario.fechaNacimiento,
          direccion: usuario.direccion,
          departamento: usuario.departamento,
          provincia: usuario.provincia,
          activo: usuario.activo,
        },
      });
      return this.mapearAEntidad(registro);
    } catch {
      return null;
    }
  }

  /**
   * @description Actualiza el estado activo/inactivo de un usuario.
   */
  async actualizarEstado(id: string, activo: boolean): Promise<Usuario | null> {
    try {
      const registro = await this.prisma.usuario.update({
        where: { id, deletedAt: null },
        data: { activo },
      });
      return this.mapearAEntidad(registro);
    } catch {
      return null;
    }
  }

  /**
   * @description Realiza la baja lógica (soft-delete) de un usuario.
   */
  async eliminar(id: string): Promise<boolean> {
    try {
      await this.prisma.usuario.update({
        where: { id, deletedAt: null },
        data: { deletedAt: new Date(), activo: false },
      });
      return true;
    } catch {
      return false;
    }
  }
}

