import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InsumoItemDto } from '../../application/dtos/insumo-item.dto.js';
import { ListarInsumosCasoUso } from '../../application/use-cases/listar-insumos.caso-uso.js';

/**
 * @description Controlador REST para el catálogo de insumos, fertilizantes y equipos agrícolas.
 */
@ApiTags('Insumos')
@ApiBearerAuth()
@Controller('insumos')
export class InsumosController {
  constructor(private readonly listarInsumosCasoUso: ListarInsumosCasoUso) {}

  @Get()
  @ApiOperation({ summary: 'Listar catálogo de insumos y recursos agrícolas activos' })
  @ApiQuery({ name: 'categoria', required: false, description: 'Filtrar por categoría (FERTILIZANTE, FITOSANITARIO, etc.)' })
  @ApiResponse({ status: 200, description: 'Catálogo de insumos obtenido exitosamente', type: [InsumoItemDto] })
  async listar(@Query('categoria') categoria?: string): Promise<InsumoItemDto[]> {
    const resultado = await this.listarInsumosCasoUso.ejecutar(categoria);
    return resultado.value;
  }
}
