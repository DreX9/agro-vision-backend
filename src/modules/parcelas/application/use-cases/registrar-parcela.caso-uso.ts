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

export const PALETA_COLORES_LOTES = [
  '#15803D', // Verde Bosque
  '#0284C7', // Azul Océano
  '#D97706', // Ámbar / Dorado
  '#7C3AED', // Púrpura / Violeta
  '#EA580C', // Naranja Fuego
  '#0D9488', // Turquesa / Teal
  '#DB2777', // Rosa Fucsia
  '#65A30D', // Verde Lima
  '#4F46E5', // Índigo
  '#B45309', // Ocre / Bronce
];

export function calcularColorDistintivoPorCodigo(codigo: string): string {
  const match = codigo.match(/(\d+)$/);
  const num = match ? parseInt(match[1], 10) : 1;
  const index = Math.max(0, num - 1) % PALETA_COLORES_LOTES.length;
  return PALETA_COLORES_LOTES[index];
}

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
      let correlativo = totalActual + 1;
      codigo = `P-${String(correlativo).padStart(3, '0')}`;
      let existe = await this.parcelaRepositorio.buscarPorCodigo(codigo);
      let intentos = 0;
      while (existe && intentos < 100) {
        correlativo += 1;
        codigo = `P-${String(correlativo).padStart(3, '0')}`;
        existe = await this.parcelaRepositorio.buscarPorCodigo(codigo);
        intentos += 1;
      }
    } else {
      const existe = await this.parcelaRepositorio.buscarPorCodigo(codigo);
      if (existe) {
        return Result.fail(new ParcelaCodigoYaExisteError(codigo));
      }
    }

    const colorHex = comando.colorHex || calcularColorDistintivoPorCodigo(codigo);

    this.logger.log(`Registrando parcela con código: ${codigo} - ${comando.nombre} - color: ${colorHex}`);

    const nuevaParcela = new Parcela({
      id: '',
      codigo,
      nombre: comando.nombre.trim(),
      areaHectareas: comando.areaHectareas,
      colorHex,
      cultivoId: comando.cultivoId || null,
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

    try {
      const guardada = await this.parcelaRepositorio.crear(nuevaParcela);
      return Result.ok(ParcelaItemDto.desdeEntidad(guardada));
    } catch (error) {
      if (error instanceof ParcelaCodigoYaExisteError) {
        return Result.fail(error);
      }
      throw error;
    }
  }
}
