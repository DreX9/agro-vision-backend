-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "actividades";

-- CreateEnum
CREATE TYPE "actividades"."tipos_actividad" AS ENUM ('FERTILIZACION', 'CONTROL_PLAGAS', 'RIEGO', 'PODA', 'SIEMBRA', 'COSECHA', 'DESHIERBE', 'MANTENIMIENTO', 'OTRO');

-- CreateEnum
CREATE TYPE "actividades"."estados_actividad" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "actividades"."categorias_insumo" AS ENUM ('FERTILIZANTE', 'FITOSANITARIO', 'MAQUINARIA_EQUIPO', 'HERRAMIENTA', 'OTRO');

-- CreateTable
CREATE TABLE "actividades"."insumos" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "categoria" "actividades"."categorias_insumo" NOT NULL DEFAULT 'FERTILIZANTE',
    "unidad_medida" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "insumos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades"."actividades_agricolas" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "tipo" "actividades"."tipos_actividad" NOT NULL DEFAULT 'FERTILIZACION',
    "descripcion" TEXT,
    "observaciones" TEXT,
    "parcela_id" UUID NOT NULL,
    "usuario_responsable_id" UUID,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3),
    "estado" "actividades"."estados_actividad" NOT NULL DEFAULT 'PENDIENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "actividades_agricolas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades"."actividades_trabajadores" (
    "id" UUID NOT NULL,
    "actividad_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "rol_en_actividad" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actividades_trabajadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actividades"."actividades_recursos" (
    "id" UUID NOT NULL,
    "actividad_id" UUID NOT NULL,
    "insumo_id" UUID NOT NULL,
    "cantidad_estimada" DECIMAL(10,2) NOT NULL,
    "unidad_medida" VARCHAR(50) NOT NULL,
    "notas" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actividades_recursos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "insumos_codigo_key" ON "actividades"."insumos"("codigo");

-- CreateIndex
CREATE INDEX "insumos_nombre_idx" ON "actividades"."insumos"("nombre");

-- CreateIndex
CREATE INDEX "insumos_categoria_idx" ON "actividades"."insumos"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "actividades_agricolas_codigo_key" ON "actividades"."actividades_agricolas"("codigo");

-- CreateIndex
CREATE INDEX "actividades_agricolas_parcela_id_idx" ON "actividades"."actividades_agricolas"("parcela_id");

-- CreateIndex
CREATE INDEX "actividades_agricolas_usuario_responsable_id_idx" ON "actividades"."actividades_agricolas"("usuario_responsable_id");

-- CreateIndex
CREATE INDEX "actividades_agricolas_estado_idx" ON "actividades"."actividades_agricolas"("estado");

-- CreateIndex
CREATE INDEX "actividades_agricolas_fecha_inicio_idx" ON "actividades"."actividades_agricolas"("fecha_inicio");

-- CreateIndex
CREATE INDEX "actividades_trabajadores_actividad_id_idx" ON "actividades"."actividades_trabajadores"("actividad_id");

-- CreateIndex
CREATE INDEX "actividades_trabajadores_usuario_id_idx" ON "actividades"."actividades_trabajadores"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "actividades_trabajadores_actividad_id_usuario_id_key" ON "actividades"."actividades_trabajadores"("actividad_id", "usuario_id");

-- CreateIndex
CREATE INDEX "actividades_recursos_actividad_id_idx" ON "actividades"."actividades_recursos"("actividad_id");

-- CreateIndex
CREATE INDEX "actividades_recursos_insumo_id_idx" ON "actividades"."actividades_recursos"("insumo_id");

-- AddForeignKey
ALTER TABLE "actividades"."actividades_agricolas" ADD CONSTRAINT "actividades_agricolas_parcela_id_fkey" FOREIGN KEY ("parcela_id") REFERENCES "parcelas"."parcelas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades"."actividades_agricolas" ADD CONSTRAINT "actividades_agricolas_usuario_responsable_id_fkey" FOREIGN KEY ("usuario_responsable_id") REFERENCES "seguridad"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades"."actividades_trabajadores" ADD CONSTRAINT "actividades_trabajadores_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "actividades"."actividades_agricolas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades"."actividades_trabajadores" ADD CONSTRAINT "actividades_trabajadores_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seguridad"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades"."actividades_recursos" ADD CONSTRAINT "actividades_recursos_actividad_id_fkey" FOREIGN KEY ("actividad_id") REFERENCES "actividades"."actividades_agricolas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividades"."actividades_recursos" ADD CONSTRAINT "actividades_recursos_insumo_id_fkey" FOREIGN KEY ("insumo_id") REFERENCES "actividades"."insumos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
