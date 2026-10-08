import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@/prisma/prisma.module.js';
import { AutenticacionController } from './presentation/controllers/autenticacion.controller.js';
import { UsuariosController } from './presentation/controllers/usuarios.controller.js';
import { IniciarSesionCasoUso } from './application/use-cases/iniciar-sesion.caso-uso.js';
import { ListarUsuariosCasoUso } from './application/use-cases/listar-usuarios.caso-uso.js';
import { RegistrarUsuarioCasoUso } from './application/use-cases/registrar-usuario.caso-uso.js';
import { ActualizarUsuarioCasoUso } from './application/use-cases/actualizar-usuario.caso-uso.js';
import { ObtenerUsuarioPorIdCasoUso } from './application/use-cases/obtener-usuario-por-id.caso-uso.js';
import { CambiarEstadoUsuarioCasoUso } from './application/use-cases/cambiar-estado-usuario.caso-uso.js';
import { EliminarUsuarioCasoUso } from './application/use-cases/eliminar-usuario.caso-uso.js';
import { USUARIO_REPOSITORIO_PORT } from './domain/ports/usuario-repositorio.port.js';
import { PrismaUsuarioRepository } from './infrastructure/repositories/prisma-usuario.repository.js';
import { HASHING_SERVICIO_PORT } from './domain/ports/hashing-servicio.port.js';
import { BcryptHashingService } from './infrastructure/services/bcrypt-hashing.service.js';
import { TOKEN_SERVICIO_PORT } from './domain/ports/token-servicio.port.js';
import { JwtTokenService } from './infrastructure/services/jwt-token.service.js';

/**
 * @description Módulo de seguridad, usuarios y autenticación para el sistema Agro Vision.
 */
@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    JwtModule.register({}),
  ],
  controllers: [
    AutenticacionController,
    UsuariosController,
  ],
  providers: [
    IniciarSesionCasoUso,
    ListarUsuariosCasoUso,
    RegistrarUsuarioCasoUso,
    ActualizarUsuarioCasoUso,
    ObtenerUsuarioPorIdCasoUso,
    CambiarEstadoUsuarioCasoUso,
    EliminarUsuarioCasoUso,
    {
      provide: USUARIO_REPOSITORIO_PORT,
      useClass: PrismaUsuarioRepository,
    },
    {
      provide: HASHING_SERVICIO_PORT,
      useClass: BcryptHashingService,
    },
    {
      provide: TOKEN_SERVICIO_PORT,
      useClass: JwtTokenService,
    },
  ],
  exports: [
    USUARIO_REPOSITORIO_PORT,
    TOKEN_SERVICIO_PORT,
    HASHING_SERVICIO_PORT,
  ],
})
export class SeguridadModule {}

