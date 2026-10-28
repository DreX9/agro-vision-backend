import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Sse,
  HttpStatus,
  HttpCode,
  MessageEvent,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CrearDiagnosticoDto } from '../../application/dtos/crear-diagnostico.dto.js';
import { FiltrosDiagnosticosDto } from '../../application/dtos/filtros-diagnosticos.dto.js';
import {
  DiagnosticoItemDto,
  RespuestaPaginadaDiagnosticosDto,
} from '../../application/dtos/diagnostico-item.dto.js';
import { RegistrarDiagnosticoCasoUso } from '../../application/use-cases/registrar-diagnostico.caso-uso.js';
import { ListarDiagnosticosCasoUso } from '../../application/use-cases/listar-diagnosticos.caso-uso.js';
import { AlertasFitosanitariasService } from '../../application/services/alertas-fitosanitarias.service.js';

@ApiTags('Diagnósticos de Campo e IA')
@Controller('diagnosticos')
export class DiagnosticosController {
  constructor(
    private readonly registrarDiagnosticoCasoUso: RegistrarDiagnosticoCasoUso,
    private readonly listarDiagnosticosCasoUso: ListarDiagnosticosCasoUso,
    private readonly alertasService: AlertasFitosanitariasService,
  ) {}

  @Sse('alertas/en-vivo')
  @ApiOperation({
    summary: 'Flujo reactivo SSE de alertas fitosanitarias en tiempo real',
    description: 'Permite a los agrónomos recibir notificaciones instantáneas tan pronto se detecta una alerta en campo.',
  })
  streamAlertas(): Observable<MessageEvent> {
    return this.alertasService.obtenerStreamAlertas().pipe(
      map(
        (alerta) =>
          ({
            data: alerta,
            type: 'alerta-fitosanitaria',
          }) as MessageEvent,
      ),
    );
  }

  @Get('alertas/recientes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Consultar alertas fitosanitarias recientes',
    description: 'Obtiene las alertas emitidas recientemente o a partir de una marca de tiempo dada.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [DiagnosticoItemDto] })
  obtenerAlertasRecientes(@Query('desde') desde?: string): DiagnosticoItemDto[] {
    const desdeMs = desde ? new Date(desde).getTime() : undefined;
    return this.alertasService.obtenerAlertasRecientes(desdeMs);
  }

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
