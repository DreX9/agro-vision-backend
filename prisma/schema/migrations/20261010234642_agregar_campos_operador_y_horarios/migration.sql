/*
  Warnings:

  - A unique constraint covering the columns `[codigo_empleado]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[numero_documento]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "especialidades_agricola" AS ENUM ('GENERAL', 'PODADOR', 'FUMIGADOR_APLICADOR', 'REGADOR', 'TRACTORISTA_MAQUINISTA', 'COSECHADOR', 'INJERTADOR');

-- AlterTable
ALTER TABLE "actividades"."actividades_trabajadores" ADD COLUMN     "hora_fin" TIMESTAMP(3),
ADD COLUMN     "hora_inicio" TIMESTAMP(3),
ADD COLUMN     "horas_asignadas" DECIMAL(5,2);

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "codigo_empleado" VARCHAR(50),
ADD COLUMN     "cuadrilla" VARCHAR(100),
ADD COLUMN     "especialidad" "especialidades_agricola" DEFAULT 'GENERAL',
ADD COLUMN     "numero_documento" VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_codigo_empleado_key" ON "usuarios"("codigo_empleado");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_numero_documento_key" ON "usuarios"("numero_documento");
