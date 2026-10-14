import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module.js';
import { ParcelasController } from './presentation/controllers/parcelas.controller.js';
import { SectoresParcelaController } from './presentation/controllers/sectores-parcela.controller.js';
import { ListarParcelasCasoUso } from './application/use-cases/listar-parcelas.caso-uso.js';
import { ObtenerParcelaPorIdCasoUso } from './application/use-cases/obtener-parcela-por-id.caso-uso.js';
import { RegistrarParcelaCasoUso } from './application/use-cases/registrar-parcela.caso-uso.js';
import { ActualizarParcelaCasoUso } from './application/use-cases/actualizar-parcela.caso-uso.js';
import { ActualizarEstadoParcelaCasoUso } from './application/use-cases/actualizar-estado-parcela.caso-uso.js';
import { EliminarParcelaCasoUso } from './application/use-cases/eliminar-parcela.caso-uso.js';
import { ListarSectoresParcelaCasoUso } from './application/use-cases/listar-sectores-parcela.caso-uso.js';
import { RegistrarSectorParcelaCasoUso } from './application/use-cases/registrar-sector-parcela.caso-uso.js';
import { ActualizarSectorParcelaCasoUso } from './application/use-cases/actualizar-sector-parcela.caso-uso.js';
import { EliminarSectorParcelaCasoUso } from './application/use-cases/eliminar-sector-parcela.caso-uso.js';
import { PARCELA_REPOSITORIO_PORT } from './domain/ports/parcela-repositorio.port.js';
import { SECTOR_PARCELA_REPOSITORIO_PORT } from './domain/ports/sector-parcela-repositorio.port.js';
import { PrismaParcelaRepository } from './infrastructure/repositories/prisma-parcela.repository.js';
import { PrismaSectorParcelaRepository } from './infrastructure/repositories/prisma-sector-parcela.repository.js';

/**
 * @description Módulo de gestión y delimitación de parcelas agrícolas y sectores de cultivo para Agro Vision.
 */
@Module({
  imports: [PrismaModule],
  controllers: [ParcelasController, SectoresParcelaController],
  providers: [
    ListarParcelasCasoUso,
    ObtenerParcelaPorIdCasoUso,
    RegistrarParcelaCasoUso,
    ActualizarParcelaCasoUso,
    ActualizarEstadoParcelaCasoUso,
    EliminarParcelaCasoUso,
    ListarSectoresParcelaCasoUso,
    RegistrarSectorParcelaCasoUso,
    ActualizarSectorParcelaCasoUso,
    EliminarSectorParcelaCasoUso,
    {
      provide: PARCELA_REPOSITORIO_PORT,
      useClass: PrismaParcelaRepository,
    },
    {
      provide: SECTOR_PARCELA_REPOSITORIO_PORT,
      useClass: PrismaSectorParcelaRepository,
    },
  ],
  exports: [
    PARCELA_REPOSITORIO_PORT,
    SECTOR_PARCELA_REPOSITORIO_PORT,
    ListarParcelasCasoUso,
    ObtenerParcelaPorIdCasoUso,
    ListarSectoresParcelaCasoUso,
  ],
})
export class ParcelasModule {}

