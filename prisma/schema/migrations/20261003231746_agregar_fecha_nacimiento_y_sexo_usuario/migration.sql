-- CreateEnum
CREATE TYPE "seguridad"."sexos_usuario" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- AlterTable
ALTER TABLE "seguridad"."usuarios" ADD COLUMN     "fecha_nacimiento" DATE,
ADD COLUMN     "sexo" "seguridad"."sexos_usuario";
