import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module.js';
import { ParcelasController } from './presentation/controllers/parcelas.controller.js';
import { ListarParcelasCasoUso } from './application/use-cases/listar-parcelas.caso-uso.js';
import { ObtenerParcelaPorIdCasoUso } from './application/use-cases/obtener-parcela-por-id.caso-uso.js';
import { RegistrarParcelaCasoUso } from './application/use-cases/registrar-parcela.caso-uso.js';
import { ActualizarParcelaCasoUso } from './application/use-cases/actualizar-parcela.caso-uso.js';
import { ActualizarEstadoParcelaCasoUso } from './application/use-cases/actualizar-estado-parcela.caso-uso.js';
import { EliminarParcelaCasoUso } from './application/use-cases/eliminar-parcela.caso-uso.js';
import { PARCELA_REPOSITORIO_PORT } from './domain/ports/parcela-repositorio.port.js';
import { PrismaParcelaRepository } from './infrastructure/repositories/prisma-parcela.repository.js';

/**
 * @description Módulo de gestión y delimitación de parcelas agrícolas para Agro Vision.
 */
@Module({
  imports: [PrismaModule],
  controllers: [ParcelasController],
  providers: [
    ListarParcelasCasoUso,
    ObtenerParcelaPorIdCasoUso,
    RegistrarParcelaCasoUso,
    ActualizarParcelaCasoUso,
    ActualizarEstadoParcelaCasoUso,
    EliminarParcelaCasoUso,
    {
      provide: PARCELA_REPOSITORIO_PORT,
      useClass: PrismaParcelaRepository,
    },
  ],
  exports: [
    PARCELA_REPOSITORIO_PORT,
    ListarParcelasCasoUso,
    ObtenerParcelaPorIdCasoUso,
  ],
})
export class ParcelasModule {}
