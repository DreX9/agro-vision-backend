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
import { CrearActividadDto } from '../dtos/crear-actividad.dto.js';
import { ActualizarActividadDto } from '../dtos/actualizar-actividad.dto.js';
import { ActualizarEstadoActividadDto } from '../dtos/actualizar-estado-actividad.dto.js';
import { FiltroActividadesDto } from '../dtos/filtro-actividades.dto.js';
import { ActividadDetalleDto } from '../../application/dtos/actividad-detalle.dto.js';
import { ListarActividadesQuery } from '../../application/queries/listar-actividades.query.js';
import { RegistrarActividadCommand } from '../../application/commands/registrar-actividad.command.js';
import { ActualizarActividadCommand } from '../../application/commands/actualizar-actividad.command.js';
import { ActualizarEstadoActividadCommand } from '../../application/commands/actualizar-estado-actividad.command.js';
import {
  ListarActividadesCasoUso,
  type PaginaActividadesRespuesta,
} from '../../application/use-cases/listar-actividades.caso-uso.js';
import { ObtenerActividadPorIdCasoUso } from '../../application/use-cases/obtener-actividad-por-id.caso-uso.js';
import { RegistrarActividadCasoUso } from '../../application/use-cases/registrar-actividad.caso-uso.js';
import { ActualizarActividadCasoUso } from '../../application/use-cases/actualizar-actividad.caso-uso.js';
import { ActualizarEstadoActividadCasoUso } from '../../application/use-cases/actualizar-estado-actividad.caso-uso.js';
import { EliminarActividadCasoUso } from '../../application/use-cases/eliminar-actividad.caso-uso.js';
import {
  ActividadCodigoYaExisteError,
  ActividadNoEncontradaError,
} from '../../domain/errors/actividad.errors.js';

/**
 * @description Controlador REST para la gestión de actividades y labores de campo agrícolas.
 */
@ApiTags('Actividades')
@ApiBearerAuth()
@Controller('actividades')
export class ActividadesController {
  constructor(
    private readonly listarActividadesCasoUso: ListarActividadesCasoUso,
    private readonly obtenerActividadPorIdCasoUso: ObtenerActividadPorIdCasoUso,
    private readonly registrarActividadCasoUso: RegistrarActividadCasoUso,
    private readonly actualizarActividadCasoUso: ActualizarActividadCasoUso,
    private readonly actualizarEstadoActividadCasoUso: ActualizarEstadoActividadCasoUso,
    private readonly eliminarActividadCasoUso: EliminarActividadCasoUso,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar actividades agrícolas con filtros y paginación' })
  @ApiResponse({ status: 200, description: 'Listado de actividades obtenido exitosamente' })
  async listar(@Query() filtros: FiltroActividadesDto): Promise<PaginaActividadesRespuesta> {
    const query = new ListarActividadesQuery(
      filtros.busqueda,
      filtros.parcelaId,
      filtros.tipo,
      filtros.estado,
      filtros.usuarioResponsableId,
      filtros.fechaDesde ? new Date(filtros.fechaDesde) : undefined,
      filtros.fechaHasta ? new Date(filtros.fechaHasta) : undefined,
      filtros.pagina,
      filtros.limite,
    );

    const resultado = await this.listarActividadesCasoUso.ejecutar(query);
    return resultado.value;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle completo de una actividad agrícola' })
  @ApiResponse({ status: 200, description: 'Detalle de la actividad encontrado', type: ActividadDetalleDto })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  async obtenerPorId(@Param('id') id: string): Promise<ActividadDetalleDto> {
    const resultado = await this.obtenerActividadPorIdCasoUso.ejecutar(id);
    if (resultado.isFailure) {
      throw new NotFoundException(resultado.error.message);
    }
    return resultado.value;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar una nueva actividad agrícola con cuadrilla y recursos' })
  @ApiResponse({ status: 201, description: 'Actividad registrada exitosamente', type: ActividadDetalleDto })
  @ApiResponse({ status: 409, description: 'Código de actividad duplicado' })
  async crear(@Body() dto: CrearActividadDto): Promise<ActividadDetalleDto> {
    const comando = new RegistrarActividadCommand(
      dto.codigo,
      dto.titulo,
      dto.tipo,
      dto.parcelaId,
      new Date(dto.fechaInicio),
      dto.fechaFin ? new Date(dto.fechaFin) : undefined,
      dto.usuarioResponsableId,
      dto.descripcion,
      dto.observaciones,
      dto.estado,
      dto.trabajadores?.map((t) => ({ usuarioId: t.usuarioId, rolEnActividad: t.rolEnActividad })) || [],
      dto.recursos?.map((r) => ({
        insumoId: r.insumoId,
        cantidadEstimada: r.cantidadEstimada,
        unidadMedida: r.unidadMedida,
        notas: r.notas,
      })) || [],
    );

    const resultado = await this.registrarActividadCasoUso.ejecutar(comando);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof ActividadCodigoYaExisteError) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException(error.message);
    }

    return resultado.value;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una actividad agrícola existente' })
  @ApiResponse({ status: 200, description: 'Actividad actualizada exitosamente', type: ActividadDetalleDto })
  @ApiResponse({ status: 404, description: 'Actividad no encontrada' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarActividadDto,
  ): Promise<ActividadDetalleDto> {
    const comando = new ActualizarActividadCommand(
      id,
      dto.titulo,
      dto.tipo,
      dto.parcelaId,
      dto.fechaInicio ? new Date(dto.fechaInicio) : undefined,
      dto.fechaFin ? new Date(dto.fechaFin) : undefined,
      dto.usuarioResponsableId,
      dto.descripcion,
      dto.observaciones,
      dto.estado,
      dto.trabajadores?.map((t) => ({ usuarioId: t.usuarioId, rolEnActividad: t.rolEnActividad })),
      dto.recursos?.map((r) => ({
        insumoId: r.insumoId,
        cantidadEstimada: r.cantidadEstimada,
        unidadMedida: r.unidadMedida,
        notas: r.notas,
      })),
    );

    const resultado = await this.actualizarActividadCasoUso.ejecutar(comando);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof ActividadNoEncontradaError) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }

    return resultado.value;
  }

  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado operativo de una actividad' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente', type: ActividadDetalleDto })
  async actualizarEstado(
    @Param('id') id: string,
    @Body() dto: ActualizarEstadoActividadDto,
  ): Promise<ActividadDetalleDto> {
    const comando = new ActualizarEstadoActividadCommand(id, dto.estado);
    const resultado = await this.actualizarEstadoActividadCasoUso.ejecutar(comando);
    if (resultado.isFailure) {
      throw new NotFoundException(resultado.error.message);
    }
    return resultado.value;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar lógicamente una actividad agrícola' })
  @ApiResponse({ status: 204, description: 'Actividad eliminada exitosamente' })
  async eliminar(@Param('id') id: string): Promise<void> {
    const resultado = await this.eliminarActividadCasoUso.ejecutar(id);
    if (resultado.isFailure) {
      throw new NotFoundException(resultado.error.message);
    }
  }
}
