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
import { CrearParcelaDto } from '../dtos/crear-parcela.dto.js';
import { ActualizarParcelaDto } from '../dtos/actualizar-parcela.dto.js';
import { FiltroParcelasDto } from '../dtos/filtro-parcelas.dto.js';
import { ActualizarEstadoParcelaDto } from '../dtos/actualizar-estado-parcela.dto.js';
import { ParcelaItemDto } from '../../application/dtos/parcela-item.dto.js';
import { ListarParcelasQuery } from '../../application/queries/listar-parcelas.query.js';
import { RegistrarParcelaCommand } from '../../application/commands/registrar-parcela.command.js';
import { ActualizarParcelaCommand } from '../../application/commands/actualizar-parcela.command.js';
import { ActualizarEstadoParcelaCommand } from '../../application/commands/actualizar-estado-parcela.command.js';
import {
  ListarParcelasCasoUso,
  type PaginaParcelasRespuesta,
} from '../../application/use-cases/listar-parcelas.caso-uso.js';
import { RegistrarParcelaCasoUso } from '../../application/use-cases/registrar-parcela.caso-uso.js';
import { ActualizarParcelaCasoUso } from '../../application/use-cases/actualizar-parcela.caso-uso.js';
import { ObtenerParcelaPorIdCasoUso } from '../../application/use-cases/obtener-parcela-por-id.caso-uso.js';
import { ActualizarEstadoParcelaCasoUso } from '../../application/use-cases/actualizar-estado-parcela.caso-uso.js';
import { EliminarParcelaCasoUso } from '../../application/use-cases/eliminar-parcela.caso-uso.js';
import {
  ParcelaCodigoYaExisteError,
  ParcelaNoEncontradaError,
} from '../../domain/errors/parcela.errors.js';

/**
 * @description Controlador REST para el módulo de parcelas y delimitación geográfica.
 */
@ApiTags('Parcelas')
@ApiBearerAuth()
@Controller('parcelas')
export class ParcelasController {
  constructor(
    private readonly listarParcelasCasoUso: ListarParcelasCasoUso,
    private readonly registrarParcelaCasoUso: RegistrarParcelaCasoUso,
    private readonly actualizarParcelaCasoUso: ActualizarParcelaCasoUso,
    private readonly obtenerParcelaPorIdCasoUso: ObtenerParcelaPorIdCasoUso,
    private readonly actualizarEstadoParcelaCasoUso: ActualizarEstadoParcelaCasoUso,
    private readonly eliminarParcelaCasoUso: EliminarParcelaCasoUso,
  ) {}

  /**
   * @description Consulta parcelas con paginación y filtros.
   */
  @Get()
  @ApiOperation({ summary: 'Listar parcelas con filtros y paginación' })
  @ApiResponse({ status: 200, description: 'Listado de parcelas obtenido exitosamente' })
  async listar(@Query() filtros: FiltroParcelasDto): Promise<PaginaParcelasRespuesta> {
    const query = new ListarParcelasQuery(
      filtros.busqueda,
      filtros.cultivoId,
      filtros.estado,
      filtros.usuarioResponsableId,
      filtros.pagina,
      filtros.limite,
    );

    const resultado = await this.listarParcelasCasoUso.ejecutar(query);
    return resultado.value;
  }

  /**
   * @description Obtiene una parcela por su identificador único.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener parcela por ID' })
  @ApiResponse({ status: 200, description: 'Parcela encontrada', type: ParcelaItemDto })
  @ApiResponse({ status: 404, description: 'Parcela no encontrada' })
  async obtenerPorId(@Param('id') id: string): Promise<ParcelaItemDto> {
    const resultado = await this.obtenerParcelaPorIdCasoUso.ejecutar(id);
    if (resultado.isFailure) {
      throw new NotFoundException(resultado.error.message);
    }
    return resultado.value;
  }

  /**
   * @description Registra una nueva parcela agrícola con su delimitación geográfica.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar una nueva parcela' })
  @ApiResponse({ status: 201, description: 'Parcela creada exitosamente', type: ParcelaItemDto })
  @ApiResponse({ status: 409, description: 'Código de parcela duplicado' })
  async crear(@Body() dto: CrearParcelaDto): Promise<ParcelaItemDto> {
    const comando = new RegistrarParcelaCommand(
      dto.codigo,
      dto.nombre,
      dto.areaHectareas,
      dto.cultivoId,
      dto.variedad,
      dto.usuarioResponsableId,
      dto.ubicacion,
      dto.departamento,
      dto.provincia,
      dto.distrito,
      dto.estado,
      dto.delimitacionGeoJson,
      dto.latitudCentro,
      dto.longitudCentro,
    );

    const resultado = await this.registrarParcelaCasoUso.ejecutar(comando);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof ParcelaCodigoYaExisteError) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException(error.message);
    }

    return resultado.value;
  }

  /**
   * @description Actualiza los datos de una parcela existente.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar datos de una parcela' })
  @ApiResponse({ status: 200, description: 'Parcela actualizada exitosamente', type: ParcelaItemDto })
  @ApiResponse({ status: 404, description: 'Parcela no encontrada' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarParcelaDto,
  ): Promise<ParcelaItemDto> {
    const comando = new ActualizarParcelaCommand(
      id,
      dto.nombre,
      dto.areaHectareas,
      dto.cultivoId,
      dto.variedad,
      dto.usuarioResponsableId,
      dto.ubicacion,
      dto.departamento,
      dto.provincia,
      dto.distrito,
      dto.estado,
      dto.delimitacionGeoJson,
      dto.latitudCentro,
      dto.longitudCentro,
    );

    const resultado = await this.actualizarParcelaCasoUso.ejecutar(comando);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof ParcelaNoEncontradaError) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }

    return resultado.value;
  }

  /**
   * @description Cambia el estado operativo de una parcela.
   */
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado operativo de una parcela' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente', type: ParcelaItemDto })
  async actualizarEstado(
    @Param('id') id: string,
    @Body() dto: ActualizarEstadoParcelaDto,
  ): Promise<ParcelaItemDto> {
    const comando = new ActualizarEstadoParcelaCommand(id, dto.estado);
    const resultado = await this.actualizarEstadoParcelaCasoUso.ejecutar(comando);
    if (resultado.isFailure) {
      throw new NotFoundException(resultado.error.message);
    }
    return resultado.value;
  }

  /**
   * @description Realiza la baja lógica de una parcela.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar lógicamente una parcela' })
  @ApiResponse({ status: 204, description: 'Parcela eliminada exitosamente' })
  async eliminar(@Param('id') id: string): Promise<void> {
    const resultado = await this.eliminarParcelaCasoUso.ejecutar(id);
    if (resultado.isFailure) {
      throw new NotFoundException(resultado.error.message);
    }
  }
}
