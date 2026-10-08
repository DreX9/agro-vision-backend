import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpCode,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CrearUsuarioDto } from '../dtos/crear-usuario.dto.js';
import { ActualizarUsuarioDto } from '../dtos/actualizar-usuario.dto.js';
import { FiltroUsuariosDto } from '../dtos/filtro-usuarios.dto.js';
import { CambiarEstadoUsuarioDto } from '../dtos/cambiar-estado-usuario.dto.js';
import { UsuarioItemDto } from '../../application/dtos/usuario-item.dto.js';
import { ListarUsuariosQuery } from '../../application/queries/listar-usuarios.query.js';
import { RegistrarUsuarioCommand } from '../../application/commands/registrar-usuario.command.js';
import { ActualizarUsuarioCommand } from '../../application/commands/actualizar-usuario.command.js';
import { ListarUsuariosCasoUso, ListaPaginadaUsuarios } from '../../application/use-cases/listar-usuarios.caso-uso.js';
import { RegistrarUsuarioCasoUso } from '../../application/use-cases/registrar-usuario.caso-uso.js';
import { ActualizarUsuarioCasoUso } from '../../application/use-cases/actualizar-usuario.caso-uso.js';
import { ObtenerUsuarioPorIdCasoUso } from '../../application/use-cases/obtener-usuario-por-id.caso-uso.js';
import { CambiarEstadoUsuarioCasoUso } from '../../application/use-cases/cambiar-estado-usuario.caso-uso.js';
import { EliminarUsuarioCasoUso } from '../../application/use-cases/eliminar-usuario.caso-uso.js';
import {
  CorreoYaRegistradoError,
  UsuarioNoEncontradoError,
} from '../../domain/errors/autenticacion.errors.js';

/**
 * @description Controlador REST para el mantenimiento y administración de usuarios.
 */
@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly listarUsuariosCasoUso: ListarUsuariosCasoUso,
    private readonly registrarUsuarioCasoUso: RegistrarUsuarioCasoUso,
    private readonly actualizarUsuarioCasoUso: ActualizarUsuarioCasoUso,
    private readonly obtenerUsuarioPorIdCasoUso: ObtenerUsuarioPorIdCasoUso,
    private readonly cambiarEstadoUsuarioCasoUso: CambiarEstadoUsuarioCasoUso,
    private readonly eliminarUsuarioCasoUso: EliminarUsuarioCasoUso,
  ) {}

  /**
   * @description Lista usuarios con soporte para filtros de búsqueda, rol, estado y paginación.
   */
  @Get()
  @ApiOperation({ summary: 'Listar usuarios con filtros y paginación' })
  @ApiResponse({ status: 200, description: 'Listado de usuarios obtenido correctamente' })
  async listar(@Query() filtros: FiltroUsuariosDto): Promise<ListaPaginadaUsuarios> {
    const query = new ListarUsuariosQuery(
      filtros.busqueda,
      filtros.rol,
      filtros.activo,
      filtros.pagina,
      filtros.limite,
    );
    const resultado = await this.listarUsuariosCasoUso.ejecutar(query);
    return resultado.value;
  }

  /**
   * @description Obtiene los datos detallados de un usuario por su ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener ficha detallada de usuario por ID' })
  @ApiResponse({ status: 200, description: 'Ficha de usuario', type: UsuarioItemDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async obtenerPorId(@Param('id') id: string): Promise<UsuarioItemDto> {
    const resultado = await this.obtenerUsuarioPorIdCasoUso.ejecutar(id);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof UsuarioNoEncontradoError) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Error al consultar usuario.');
    }
    return resultado.value;
  }

  /**
   * @description Registra un nuevo usuario con credenciales encriptadas.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo usuario en el sistema' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: UsuarioItemDto })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya existe' })
  async crear(@Body() dto: CrearUsuarioDto): Promise<UsuarioItemDto> {
    const fechaNacimiento = dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : null;

    const comando = new RegistrarUsuarioCommand(
      dto.nombres,
      dto.apellidos,
      dto.correo,
      dto.password,
      dto.rol,
      dto.telefono,
      dto.sexo,
      fechaNacimiento,
      dto.direccion,
      dto.departamento,
      dto.provincia,
    );

    const resultado = await this.registrarUsuarioCasoUso.ejecutar(comando);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof CorreoYaRegistradoError) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException('Error al crear usuario.');
    }

    return resultado.value;
  }

  /**
   * @description Actualiza los datos de un usuario existente.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar datos de un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente', type: UsuarioItemDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya existe en otro usuario' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarUsuarioDto,
  ): Promise<UsuarioItemDto> {
    const fechaNacimiento = dto.fechaNacimiento ? new Date(dto.fechaNacimiento) : null;

    const comando = new ActualizarUsuarioCommand(
      id,
      dto.nombres,
      dto.apellidos,
      dto.correo,
      dto.rol,
      dto.password,
      dto.telefono,
      dto.sexo,
      fechaNacimiento,
      dto.direccion,
      dto.departamento,
      dto.provincia,
    );

    const resultado = await this.actualizarUsuarioCasoUso.ejecutar(comando);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof UsuarioNoEncontradoError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof CorreoYaRegistradoError) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException('Error al actualizar usuario.');
    }

    return resultado.value;
  }

  /**
   * @description Activa o desactiva la cuenta de un usuario.
   */
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Activar o desactivar cuenta de usuario' })
  @ApiResponse({ status: 200, description: 'Estado actualizado correctamente', type: UsuarioItemDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async cambiarEstado(
    @Param('id') id: string,
    @Body() dto: CambiarEstadoUsuarioDto,
  ): Promise<UsuarioItemDto> {
    const resultado = await this.cambiarEstadoUsuarioCasoUso.ejecutar(id, dto.activo);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof UsuarioNoEncontradoError) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Error al actualizar estado del usuario.');
    }
    return resultado.value;
  }

  /**
   * @description Da de baja lógica a un usuario.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Dar de baja lógica a un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async eliminar(@Param('id') id: string): Promise<{ exito: boolean }> {
    const resultado = await this.eliminarUsuarioCasoUso.ejecutar(id);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof UsuarioNoEncontradoError) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Error al eliminar usuario.');
    }
    return { exito: resultado.value };
  }
}

