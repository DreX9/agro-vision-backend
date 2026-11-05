import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service.js';
import { CrearSubActividadesDto } from '../../presentation/dtos/crear-sub-actividades.dto.js';

@Injectable()
export class RegistrarSubActividadesCasoUso {
  constructor(private readonly prisma: PrismaService) {}

  async ejecutar(actividadId: string, supervisorId: string, dto: CrearSubActividadesDto) {
    const actividad = await this.prisma.actividadAgricola.findUnique({
      where: { id: actividadId },
    });

    if (!actividad) {
      throw new NotFoundException('La actividad general no existe');
    }

    if (actividad.usuarioResponsableId !== supervisorId) {
      throw new ForbiddenException('Solo el supervisor encargado puede asignar tareas');
    }

    const data = dto.subActividades.map((sub) => ({
      actividadId,
      operadorId: sub.operadorId,
      descripcion: sub.descripcion,
      estado: 'PENDIENTE' as any,
    }));

    await this.prisma.subActividad.createMany({ data });

    return { mensaje: 'Subactividades asignadas correctamente' };
  }
}