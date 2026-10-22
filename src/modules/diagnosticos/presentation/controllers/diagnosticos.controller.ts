import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CrearDiagnosticoDto } from '../../application/dtos/crear-diagnostico.dto.js';
import { FiltrosDiagnosticosDto } from '../../application/dtos/filtros-diagnosticos.dto.js';
import {
  DiagnosticoItemDto,
  RespuestaPaginadaDiagnosticosDto,
} from '../../application/dtos/diagnostico-item.dto.js';
import { RegistrarDiagnosticoCasoUso } from '../../application/use-cases/registrar-diagnostico.caso-uso.js';
import { ListarDiagnosticosCasoUso } from '../../application/use-cases/listar-diagnosticos.caso-uso.js';

@ApiTags('Diagnósticos de Campo e IA')
@Controller('diagnosticos')
export class DiagnosticosController {
  constructor(
    private readonly registrarDiagnosticoCasoUso: RegistrarDiagnosticoCasoUso,
    private readonly listarDiagnosticosCasoUso: ListarDiagnosticosCasoUso,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar un nuevo diagnóstico fitosanitario de campo',
    description: 'Guarda en base de datos los hallazgos de IA junto con las coordenadas GPS del dron, parcela y sector.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Diagnóstico registrado exitosamente',
    type: DiagnosticoItemDto,
  })
  async registrar(@Body() dto: CrearDiagnosticoDto): Promise<DiagnosticoItemDto> {
    return this.registrarDiagnosticoCasoUso.ejecutar(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar diagnósticos fitosanitarios registrados',
    description: 'Consulta los diagnósticos georreferenciados con soporte de filtros por parcela, sector y paginación.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Listado paginado de diagnósticos',
    type: RespuestaPaginadaDiagnosticosDto,
  })
  async listar(@Query() filtros: FiltrosDiagnosticosDto): Promise<RespuestaPaginadaDiagnosticosDto> {
    return this.listarDiagnosticosCasoUso.ejecutar(filtros);
  }
}
