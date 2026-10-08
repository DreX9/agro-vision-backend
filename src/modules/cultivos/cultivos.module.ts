import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module.js';
import { CultivosController } from './presentation/controllers/cultivos.controller.js';
import { ListarCultivosActivosCasoUso } from './application/use-cases/listar-cultivos-activos.caso-uso.js';
import { RegistrarCultivoCasoUso } from './application/use-cases/registrar-cultivo.caso-uso.js';
import { ActualizarCultivoCasoUso } from './application/use-cases/actualizar-cultivo.caso-uso.js';
import { EliminarCultivoCasoUso } from './application/use-cases/eliminar-cultivo.caso-uso.js';
import { CULTIVO_REPOSITORIO_PORT } from './domain/ports/cultivo-repositorio.port.js';
import { PrismaCultivoRepository } from './infrastructure/repositories/prisma-cultivo.repository.js';

/**
 * @description Módulo de cultivos agrícolas para Agro Vision.
 */
@Module({
  imports: [PrismaModule],
  controllers: [CultivosController],
  providers: [
    ListarCultivosActivosCasoUso,
    RegistrarCultivoCasoUso,
    ActualizarCultivoCasoUso,
    EliminarCultivoCasoUso,
    {
      provide: CULTIVO_REPOSITORIO_PORT,
      useClass: PrismaCultivoRepository,
    },
  ],
  exports: [CULTIVO_REPOSITORIO_PORT, ListarCultivosActivosCasoUso],
})
export class CultivosModule {}
