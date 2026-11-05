import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';

@Injectable()
export class ListarSubActividadesOperadorCasoUso {
  constructor(private readonly prisma: PrismaService) {}

  async ejecutar(operadorId: string) {
    return this.prisma.subActividad.findMany({
      where: { operadorId },
      include: {
        actividad: {
          select: {
            titulo: true,
            codigo: true,
            tipo: true,
            estado: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}