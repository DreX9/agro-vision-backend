import { Injectable, Logger } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { DiagnosticoItemDto } from '../dtos/diagnostico-item.dto.js';

/**
 * @description Servicio en memoria para la distribución en tiempo real de alertas fitosanitarias
 * hacia agrónomos, administradores y supervisores conectados.
 */
@Injectable()
export class AlertasFitosanitariasService {
  private readonly logger = new Logger(AlertasFitosanitariasService.name);
  private readonly alertaSubject = new Subject<DiagnosticoItemDto>();
  private readonly buferRecientes: DiagnosticoItemDto[] = [];
  private readonly LIMITE_BUFER = 50;

  /**
   * @description Emite una nueva alerta fitosanitaria a todos los suscriptores conectados.
   */
  emitirAlerta(alerta: DiagnosticoItemDto): void {
    this.logger.log(
      `🚨 [ALERTA FITOSANITARIA EMITIDA] ${alerta.codigo} en Parcela: ${alerta.parcelaNombre || alerta.parcelaId} - Reportado por: ${alerta.usuarioNombre || 'Operador de Campo'}`,
    );

    // Guardar en el búfer circular en memoria
    this.buferRecientes.unshift(alerta);
    if (this.buferRecientes.length > this.LIMITE_BUFER) {
      this.buferRecientes.pop();
    }

    // Transmitir a través del flujo reactivo
    this.alertaSubject.next(alerta);
  }

  /**
   * @description Proporciona el Observable reactivo para Server-Sent Events (SSE) o WebSockets.
   */
  obtenerStreamAlertas(): Observable<DiagnosticoItemDto> {
    return this.alertaSubject.asObservable();
  }

  /**
   * @description Obtiene las alertas ocurridas recientemente (opcionalmente filtrando por marca de tiempo).
   */
  obtenerAlertasRecientes(desdeMs?: number, limite: number = 10): DiagnosticoItemDto[] {
    if (!desdeMs) {
      return this.buferRecientes.slice(0, limite);
    }

    return this.buferRecientes
      .filter((a) => new Date(a.createdAt).getTime() > desdeMs)
      .slice(0, limite);
  }
}
