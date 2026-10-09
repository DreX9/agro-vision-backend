-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "actividades"."tipos_actividad" ADD VALUE 'MONITOREO_FITOSANITARIO';
ALTER TYPE "actividades"."tipos_actividad" ADD VALUE 'AUDITORIA_CALIDAD';
ALTER TYPE "actividades"."tipos_actividad" ADD VALUE 'SUPERVISION_TECNICA';
ALTER TYPE "actividades"."tipos_actividad" ADD VALUE 'GESTION_ADMINISTRATIVA';
