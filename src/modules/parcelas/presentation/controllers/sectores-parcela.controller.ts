import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpCode,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CrearSectorParcelaDto } from '../dtos/crear-sector-parcela.dto.js';
import { ActualizarSectorParcelaDto } from '../dtos/actualizar-sector-parcela.dto.js';
import { SectorParcelaItemDto } from '../../application/dtos/sector-parcela-item.dto.js';
import { ResumenSectoresParcelaDto } from '../../application/dtos/resumen-sectores-parcela.dto.js';
import { ListarSectoresParcelaCasoUso } from '../../application/use-cases/listar-sectores-parcela.caso-uso.js';
import { RegistrarSectorParcelaCasoUso } from '../../application/use-cases/registrar-sector-parcela.caso-uso.js';
import { ActualizarSectorParcelaCasoUso } from '../../application/use-cases/actualizar-sector-parcela.caso-uso.js';
import { EliminarSectorParcelaCasoUso } from '../../application/use-cases/eliminar-sector-parcela.caso-uso.js';
import {
  ParcelaNoEncontradaError,
  SectorNoEncontradoError,
  SectorSuperaAreaDisponibleError,
  SectorCodigoYaExisteError,
} from '../../domain/errors/parcela.errors.js';

/**
 * @description Controlador REST para la gestión de sectores y áreas de cultivo dentro de parcelas.
 */
@ApiTags('Sectores de Parcelas / Asignación de Cultivos')
@ApiBearerAuth()
@Controller('parcelas/:parcelaId/sectores')
export class SectoresParcelaController {
  constructor(
    private readonly listarSectoresParcelaCasoUso: ListarSectoresParcelaCasoUso,
    private readonly registrarSectorParcelaCasoUso: RegistrarSectorParcelaCasoUso,
    private readonly actualizarSectorParcelaCasoUso: ActualizarSectorParcelaCasoUso,
    private readonly eliminarSectorParcelaCasoUso: EliminarSectorParcelaCasoUso,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar sectores y balance de superficie de una parcela',
    description: 'Devuelve la lista de sectores/cuarteles delimitados junto con el área total, asignada y disponible.',
  })
  @ApiParam({ name: 'parcelaId', description: 'UUID de la parcela matriz' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resumen y lista de sectores de la parcela',
    type: ResumenSectoresParcelaDto,
  })
  async listarSectores(@Param('parcelaId') parcelaId: string): Promise<ResumenSectoresParcelaDto> {
    try {
      return await this.listarSectoresParcelaCasoUso.ejecutar(parcelaId);
    } catch (error) {
      if (error instanceof ParcelaNoEncontradaError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar y delimitar un nuevo sector de cultivo en la parcela',
    description: 'Crea un sub-lote con cultivo asignado y perímetro satelital validando no superar la superficie disponible.',
  })
  @ApiParam({ name: 'parcelaId', description: 'UUID de la parcela matriz' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sector registrado exitosamente',
    type: SectorParcelaItemDto,
  })
  async registrarSector(
    @Param('parcelaId') parcelaId: string,
    @Body() dto: CrearSectorParcelaDto,
  ): Promise<SectorParcelaItemDto> {
    try {
      return await this.registrarSectorParcelaCasoUso.ejecutar(parcelaId, dto);
    } catch (error) {
      if (error instanceof ParcelaNoEncontradaError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof SectorSuperaAreaDisponibleError) {
        throw new BadRequestException(error.message);
      }
      if (error instanceof SectorCodigoYaExisteError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Put(':sectorId')
  @ApiOperation({
    summary: 'Actualizar especificaciones o delimitación de un sector',
    description: 'Permite modificar cultivo, variedad, fechas, estado o vértices del polígono del sector.',
  })
  @ApiParam({ name: 'parcelaId', description: 'UUID de la parcela matriz' })
  @ApiParam({ name: 'sectorId', description: 'UUID del sector a actualizar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sector actualizado exitosamente',
    type: SectorParcelaItemDto,
  })
  async actualizarSector(
    @Param('parcelaId') parcelaId: string,
    @Param('sectorId') sectorId: string,
    @Body() dto: ActualizarSectorParcelaDto,
  ): Promise<SectorParcelaItemDto> {
    try {
      return await this.actualizarSectorParcelaCasoUso.ejecutar(parcelaId, sectorId, dto);
    } catch (error) {
      if (error instanceof SectorNoEncontradoError || error instanceof ParcelaNoEncontradaError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof SectorSuperaAreaDisponibleError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Delete(':sectorId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar o dar de baja un sector de cultivo',
    description: 'Libera la superficie del sector para que vuelva a figurar como disponible en la parcela matriz.',
  })
  @ApiParam({ name: 'parcelaId', description: 'UUID de la parcela matriz' })
  @ApiParam({ name: 'sectorId', description: 'UUID del sector a eliminar' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sector eliminado satisfactoriamente',
  })
  async eliminarSector(
    @Param('parcelaId') parcelaId: string,
    @Param('sectorId') sectorId: string,
  ): Promise<{ mensaje: string; id: string }> {
    try {
      await this.eliminarSectorParcelaCasoUso.ejecutar(parcelaId, sectorId);
      return {
        mensaje: 'Sector de cultivo eliminado exitosamente. Su superficie ha sido liberada en la parcela matriz.',
        id: sectorId,
      };
    } catch (error) {
      if (error instanceof SectorNoEncontradoError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
