import { Injectable, Inject, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result.js';
import {
  type ICultivoRepositorio,
  CULTIVO_REPOSITORIO_PORT,
} from '../../domain/ports/cultivo-repositorio.port.js';
import { Cultivo } from '../../domain/entities/cultivo.entity.js';
import { RegistrarCultivoCommand } from '../commands/registrar-cultivo.command.js';
import { CultivoItemDto } from '../dtos/cultivo-item.dto.js';
import {
  CultivoError,
  CultivoYaExisteError,
} from '../../domain/errors/cultivo.errors.js';

/**
 * @description Caso de uso para registrar un nuevo cultivo en el sistema.
 */
@Injectable()
export class RegistrarCultivoCasoUso {
  private readonly logger = new Logger(RegistrarCultivoCasoUso.name);

  constructor(
    @Inject(CULTIVO_REPOSITORIO_PORT)
    private readonly cultivoRepositorio: ICultivoRepositorio,
  ) {}

  /**
   * @description Registra un cultivo verificando unicidad de nombre.
   */
  async ejecutar(
    comando: RegistrarCultivoCommand,
  ): Promise<Result<CultivoItemDto, CultivoError>> {
    const nombreNormalizado = comando.nombre.trim();
    this.logger.log(`Registrando cultivo: "${nombreNormalizado}"`);

    const existente = await this.cultivoRepositorio.buscarPorNombre(nombreNormalizado);
    if (existente) {
      return Result.fail(new CultivoYaExisteError(nombreNormalizado));
    }

    const entidad = new Cultivo({
      id: '',
      nombre: nombreNormalizado,
      nombreCientifico: comando.nombreCientifico?.trim() || null,
      variedadesDefault: comando.variedadesDefault,
      colorHex: comando.colorHex || '#546B41',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const guardado = await this.cultivoRepositorio.crear(entidad);
    return Result.ok(CultivoItemDto.desdeEntidad(guardado));
  }
}
