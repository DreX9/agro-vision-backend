import { Injectable, Inject, Logger } from '@nestjs/common';
import { EstadoParcela } from '@prisma/client';
import { Result } from '@/shared/domain/result.js';
import {
  type IParcelaRepositorio,
  PARCELA_REPOSITORIO_PORT,
} from '../../domain/ports/parcela-repositorio.port.js';
import { RegistrarParcelaCommand } from '../commands/registrar-parcela.command.js';
import { ParcelaItemDto } from '../dtos/parcela-item.dto.js';
import { Parcela } from '../../domain/entities/parcela.entity.js';
import {
  ParcelaError,
  ParcelaCodigoYaExisteError,
} from '../../domain/errors/parcela.errors.js';

/**
 * @description Caso de uso para registrar una nueva parcela o lote agrícola.
 */
@Injectable()
export class RegistrarParcelaCasoUso {
  private readonly logger = new Logger(RegistrarParcelaCasoUso.name);

  constructor(
    @Inject(PARCELA_REPOSITORIO_PORT)
    private readonly parcelaRepositorio: IParcelaRepositorio,
  ) {}

  /**
   * @description Registra la parcela generando código correlativo automático si no fue provisto.
   */
  async ejecutar(comando: RegistrarParcelaCommand): Promise<Result<ParcelaItemDto, ParcelaError>> {
    let codigo = comando.codigo?.trim().toUpperCase();

    if (!codigo) {
      const totalActual = await this.parcelaRepositorio.contarTotal();
      codigo = `P-${String(totalActual + 1).padStart(3, '0')}`;
    }

    const existe = await this.parcelaRepositorio.buscarPorCodigo(codigo);
    if (existe) {
      return Result.fail(new ParcelaCodigoYaExisteError(codigo));
    }

    this.logger.log(`Registrando parcela con código: ${codigo} - ${comando.nombre}`);

    const nuevaParcela = new Parcela({
      id: '',
      codigo,
      nombre: comando.nombre.trim(),
      areaHectareas: comando.areaHectareas,
      cultivoId: comando.cultivoId,
      variedad: comando.variedad?.trim() || null,
      usuarioResponsableId: comando.usuarioResponsableId || null,
      ubicacion: comando.ubicacion?.trim() || null,
      departamento: comando.departamento?.trim() || null,
      provincia: comando.provincia?.trim() || null,
      distrito: comando.distrito?.trim() || null,
      estado: comando.estado || EstadoParcela.ACTIVA,
      delimitacionGeoJson: comando.delimitacionGeoJson,
      latitudCentro: comando.latitudCentro ?? null,
      longitudCentro: comando.longitudCentro ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const guardada = await this.parcelaRepositorio.crear(nuevaParcela);
    return Result.ok(ParcelaItemDto.desdeEntidad(guardada));
  }
}
