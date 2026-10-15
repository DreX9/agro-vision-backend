import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module.js';
import { ParcelasModule } from '../parcelas/parcelas.module.js';
import { DiagnosticosController } from './presentation/controllers/diagnosticos.controller.js';
import { RegistrarDiagnosticoCasoUso } from './application/use-cases/registrar-diagnostico.caso-uso.js';
import { ListarDiagnosticosCasoUso } from './application/use-cases/listar-diagnosticos.caso-uso.js';
import { DIAGNOSTICO_CAMPO_REPOSITORIO_PORT } from './domain/ports/diagnostico-campo-repositorio.port.js';
import { PrismaDiagnosticoCampoRepository } from './infrastructure/repositories/prisma-diagnostico-campo.repository.js';

@Module({
  imports: [PrismaModule, ParcelasModule],
  controllers: [DiagnosticosController],
  providers: [
    RegistrarDiagnosticoCasoUso,
    ListarDiagnosticosCasoUso,
    {
      provide: DIAGNOSTICO_CAMPO_REPOSITORIO_PORT,
      useClass: PrismaDiagnosticoCampoRepository,
    },
  ],
  exports: [
    DIAGNOSTICO_CAMPO_REPOSITORIO_PORT,
    RegistrarDiagnosticoCasoUso,
    ListarDiagnosticosCasoUso,
  ],
})
export class DiagnosticosModule {}
