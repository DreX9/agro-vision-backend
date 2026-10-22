import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { SeguridadModule } from './modules/seguridad/seguridad.module.js';
import { CultivosModule } from './modules/cultivos/cultivos.module.js';
import { ParcelasModule } from './modules/parcelas/parcelas.module.js';
import { ActividadesModule } from './modules/actividades/actividades.module.js';
import { DiagnosticosModule } from './modules/diagnosticos/diagnosticos.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SeguridadModule,
    CultivosModule,
    ParcelasModule,
    ActividadesModule,
    DiagnosticosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}