import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';

@Injectable()
export class CompletarSubActividadCasoUso {
  constructor(private readonly prisma: PrismaService) {}

  async ejecutar(subActividadId: string, operadorId: string) {
    const subActividad = await this.prisma.subActividad.findFirst({
      where: { id: subActividadId, operadorId },
    });

    if (!subActividad) {
      throw new NotFoundException('Subactividad no encontrada o no te pertenece');
    }

    return this.prisma.subActividad.update({
      where: { id: subActividadId },
      data: {
        estado: 'COMPLETADA' as any,
        fechaCompletado: new Date(),
      },
    });
  }
}