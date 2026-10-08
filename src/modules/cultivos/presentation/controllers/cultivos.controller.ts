import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CrearCultivoDto } from '../dtos/crear-cultivo.dto.js';
import { ActualizarCultivoDto } from '../dtos/actualizar-cultivo.dto.js';
import { CultivoItemDto } from '../../application/dtos/cultivo-item.dto.js';
import { RegistrarCultivoCommand } from '../../application/commands/registrar-cultivo.command.js';
import { ActualizarCultivoCommand } from '../../application/commands/actualizar-cultivo.command.js';
import { ListarCultivosActivosCasoUso } from '../../application/use-cases/listar-cultivos-activos.caso-uso.js';
import { RegistrarCultivoCasoUso } from '../../application/use-cases/registrar-cultivo.caso-uso.js';
import { ActualizarCultivoCasoUso } from '../../application/use-cases/actualizar-cultivo.caso-uso.js';
import { EliminarCultivoCasoUso } from '../../application/use-cases/eliminar-cultivo.caso-uso.js';
import {
  CultivoYaExisteError,
  CultivoNoEncontradoError,
  CultivoEnUsoError,
} from '../../domain/errors/cultivo.errors.js';

/**
 * @description Controlador REST para el catálogo y mantenimiento integral de cultivos.
 */
@ApiTags('Cultivos')
@ApiBearerAuth()
@Controller('cultivos')
export class CultivosController {
  constructor(
    private readonly listarCultivosActivosCasoUso: ListarCultivosActivosCasoUso,
    private readonly registrarCultivoCasoUso: RegistrarCultivoCasoUso,
    private readonly actualizarCultivoCasoUso: ActualizarCultivoCasoUso,
    private readonly eliminarCultivoCasoUso: EliminarCultivoCasoUso,
  ) {}

  /**
   * @description Obtiene el catálogo de cultivos activos.
   */
  @Get()
  @ApiOperation({ summary: 'Listar cultivos activos' })
  @ApiResponse({ status: 200, description: 'Catálogo de cultivos activos', type: [CultivoItemDto] })
  async listar(): Promise<CultivoItemDto[]> {
    const resultado = await this.listarCultivosActivosCasoUso.ejecutar();
    return resultado.value;
  }

  /**
   * @description Registra un nuevo cultivo.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo cultivo en el catálogo' })
  @ApiResponse({ status: 201, description: 'Cultivo registrado exitosamente', type: CultivoItemDto })
  @ApiResponse({ status: 409, description: 'El cultivo ya existe' })
  async crear(@Body() dto: CrearCultivoDto): Promise<CultivoItemDto> {
    const comando = new RegistrarCultivoCommand(
      dto.nombre,
      dto.nombreCientifico,
      dto.variedadesDefault,
      dto.colorHex,
    );

    const resultado = await this.registrarCultivoCasoUso.ejecutar(comando);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof CultivoYaExisteError) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException('Error al registrar el cultivo.');
    }

    return resultado.value;
  }

  /**
   * @description Actualiza los datos de un cultivo existente.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un cultivo del catálogo' })
  @ApiParam({ name: 'id', description: 'Identificador UUID del cultivo' })
  @ApiResponse({ status: 200, description: 'Cultivo actualizado exitosamente', type: CultivoItemDto })
  @ApiResponse({ status: 404, description: 'Cultivo no encontrado' })
  @ApiResponse({ status: 409, description: 'El nombre ya está en uso' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarCultivoDto,
  ): Promise<CultivoItemDto> {
    const comando = new ActualizarCultivoCommand(
      id,
      dto.nombre,
      dto.nombreCientifico,
      dto.variedadesDefault,
      dto.colorHex,
      dto.activo,
    );

    const resultado = await this.actualizarCultivoCasoUso.ejecutar(comando);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof CultivoNoEncontradoError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof CultivoYaExisteError) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException('Error al actualizar el cultivo.');
    }

    return resultado.value;
  }

  /**
   * @description Cambia el estado activo/inactivo de un cultivo.
   */
  @Patch(':id/estado')
  @ApiOperation({ summary: 'Alternar estado activo/inactivo de un cultivo' })
  @ApiParam({ name: 'id', description: 'Identificador UUID del cultivo' })
  @ApiResponse({ status: 200, description: 'Estado actualizado', type: CultivoItemDto })
  async cambiarEstado(
    @Param('id') id: string,
    @Body('activo') activo: boolean,
  ): Promise<CultivoItemDto> {
    const comando = new ActualizarCultivoCommand(id, undefined, undefined, undefined, undefined, activo);
    const resultado = await this.actualizarCultivoCasoUso.ejecutar(comando);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof CultivoNoEncontradoError) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Error al cambiar el estado del cultivo.');
    }
    return resultado.value;
  }

  /**
   * @description Elimina un cultivo del catálogo (soft-delete).
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un cultivo del catálogo' })
  @ApiParam({ name: 'id', description: 'Identificador UUID del cultivo' })
  @ApiResponse({ status: 204, description: 'Cultivo eliminado exitosamente' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar porque tiene parcelas asociadas' })
  @ApiResponse({ status: 404, description: 'Cultivo no encontrado' })
  async eliminar(@Param('id') id: string): Promise<void> {
    const resultado = await this.eliminarCultivoCasoUso.ejecutar(id);
    if (resultado.isFailure) {
      const error = resultado.error;
      if (error instanceof CultivoNoEncontradoError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof CultivoEnUsoError) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Error al eliminar el cultivo.');
    }
  }
}
