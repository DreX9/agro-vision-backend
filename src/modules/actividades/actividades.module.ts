import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module.js';
import { ActividadesController } from './presentation/controllers/actividades.controller.js';
import { InsumosController } from './presentation/controllers/insumos.controller.js';
import { ListarActividadesCasoUso } from './application/use-cases/listar-actividades.caso-uso.js';
import { ObtenerActividadPorIdCasoUso } from './application/use-cases/obtener-actividad-por-id.caso-uso.js';
import { RegistrarActividadCasoUso } from './application/use-cases/registrar-actividad.caso-uso.js';
import { ActualizarActividadCasoUso } from './application/use-cases/actualizar-actividad.caso-uso.js';
import { ActualizarEstadoActividadCasoUso } from './application/use-cases/actualizar-estado-actividad.caso-uso.js';
import { EliminarActividadCasoUso } from './application/use-cases/eliminar-actividad.caso-uso.js';
import { ListarInsumosCasoUso } from './application/use-cases/listar-insumos.caso-uso.js';
import { ACTIVIDAD_REPOSITORIO_PORT } from './domain/ports/actividad-repositorio.port.js';
import { INSUMO_REPOSITORIO_PORT } from './domain/ports/insumo-repositorio.port.js';
import { PrismaActividadRepository } from './infrastructure/repositories/prisma-actividad.repository.js';
import { PrismaInsumoRepository } from './infrastructure/repositories/prisma-insumo.repository.js';

/**
 * @description Módulo de actividades agrícolas, cuadrillas e insumos para Agro Vision.
 */
@Module({
  imports: [PrismaModule],
  controllers: [ActividadesController, InsumosController],
  providers: [
    ListarActividadesCasoUso,
    ObtenerActividadPorIdCasoUso,
    RegistrarActividadCasoUso,
    ActualizarActividadCasoUso,
    ActualizarEstadoActividadCasoUso,
    EliminarActividadCasoUso,
    ListarInsumosCasoUso,
    {
      provide: ACTIVIDAD_REPOSITORIO_PORT,
      useClass: PrismaActividadRepository,
    },
    {
      provide: INSUMO_REPOSITORIO_PORT,
      useClass: PrismaInsumoRepository,
    },
  ],
  exports: [
    ACTIVIDAD_REPOSITORIO_PORT,
    INSUMO_REPOSITORIO_PORT,
    ListarActividadesCasoUso,
  ],
})
export class ActividadesModule {}
