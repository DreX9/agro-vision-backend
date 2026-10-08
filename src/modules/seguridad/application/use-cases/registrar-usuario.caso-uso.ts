import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import { RegistrarUsuarioCommand } from '../commands/registrar-usuario.command.js';
import { UsuarioItemDto } from '../dtos/usuario-item.dto.js';
import { Usuario } from '../../domain/entities/usuario.entity.js';
import {
  AutenticacionError,
  CorreoYaRegistradoError,
} from '../../domain/errors/autenticacion.errors.js';
import {
  type IUsuarioRepositorio,
  USUARIO_REPOSITORIO_PORT,
} from '../../domain/ports/usuario-repositorio.port.js';
import {
  type IHashingServicio,
  HASHING_SERVICIO_PORT,
} from '../../domain/ports/hashing-servicio.port.js';

/**
 * @description Caso de uso para registrar un nuevo usuario con contraseña encriptada.
 */
@Injectable()
export class RegistrarUsuarioCasoUso {
  private readonly logger = new Logger(RegistrarUsuarioCasoUso.name);

  constructor(
    @Inject(USUARIO_REPOSITORIO_PORT)
    private readonly usuarioRepositorio: IUsuarioRepositorio,
    @Inject(HASHING_SERVICIO_PORT)
    private readonly hashingServicio: IHashingServicio,
  ) {}

  /**
   * @description Registra un usuario verificando correo único y encriptando contraseña.
   */
  async ejecutar(
    comando: RegistrarUsuarioCommand,
  ): Promise<Result<UsuarioItemDto, AutenticacionError>> {
    const correoNormalizado = comando.correo.trim().toLowerCase();
    this.logger.log(`Registrando nuevo usuario: ${correoNormalizado} (${comando.rol})`);

    const usuarioExistente = await this.usuarioRepositorio.buscarPorCorreo(correoNormalizado);
    if (usuarioExistente) {
      this.logger.warn(`El correo ${correoNormalizado} ya se encuentra en uso`);
      return Result.fail(new CorreoYaRegistradoError(correoNormalizado));
    }

    const passwordHash = await this.hashingServicio.encriptar(comando.password);

    const nuevoUsuario = new Usuario({
      id: '', // Prisma genera UUIDv7 automáticamente
      nombres: comando.nombres.trim(),
      apellidos: comando.apellidos.trim(),
      correo: correoNormalizado,
      telefono: comando.telefono?.trim() || null,
      passwordHash,
      rol: comando.rol,
      sexo: comando.sexo || null,
      fechaNacimiento: comando.fechaNacimiento || null,
      direccion: comando.direccion?.trim() || null,
      departamento: comando.departamento?.trim() || null,
      provincia: comando.provincia?.trim() || null,
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const guardado = await this.usuarioRepositorio.crear(nuevoUsuario);
    this.logger.log(`Usuario registrado exitosamente con ID: ${guardado.id}`);

    return Result.ok(UsuarioItemDto.desdeEntidad(guardado));
  }
}
