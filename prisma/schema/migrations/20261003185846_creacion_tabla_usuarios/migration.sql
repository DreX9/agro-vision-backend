-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "seguridad";

-- CreateEnum
CREATE TYPE "seguridad"."roles_usuario" AS ENUM ('ADMINISTRADOR', 'AGRONOMO', 'SUPERVISOR', 'OPERADOR');

-- CreateTable
CREATE TABLE "seguridad"."usuarios" (
    "id" UUID NOT NULL,
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "telefono" VARCHAR(20),
    "password_hash" VARCHAR(255) NOT NULL,
    "rol" "seguridad"."roles_usuario" NOT NULL DEFAULT 'ADMINISTRADOR',
    "direccion" VARCHAR(255),
    "departamento" VARCHAR(100),
    "provincia" VARCHAR(100),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "seguridad"."usuarios"("correo");

-- CreateIndex
CREATE INDEX "usuarios_correo_idx" ON "seguridad"."usuarios"("correo");
