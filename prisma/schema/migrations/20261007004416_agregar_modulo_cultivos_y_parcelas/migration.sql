-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "cultivos";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "parcelas";

-- CreateEnum
CREATE TYPE "parcelas"."estados_parcela" AS ENUM ('ACTIVA', 'EN_PREPARACION', 'EN_DESCANSO', 'COSECHADA', 'INACTIVA');

-- CreateTable
CREATE TABLE "cultivos"."cultivos" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "nombre_cientifico" VARCHAR(150),
    "variedades_default" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "color_hex" VARCHAR(7) DEFAULT '#546B41',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "cultivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcelas"."parcelas" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "area_hectareas" DECIMAL(10,4) NOT NULL,
    "cultivo_id" UUID NOT NULL,
    "variedad" VARCHAR(100),
    "usuario_responsable_id" UUID,
    "ubicacion" VARCHAR(255),
    "departamento" VARCHAR(100),
    "provincia" VARCHAR(100),
    "distrito" VARCHAR(100),
    "estado" "parcelas"."estados_parcela" NOT NULL DEFAULT 'ACTIVA',
    "delimitacion_geo_json" JSONB,
    "latitud_centro" DECIMAL(11,8),
    "longitud_centro" DECIMAL(11,8),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "parcelas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cultivos_nombre_key" ON "cultivos"."cultivos"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "parcelas_codigo_key" ON "parcelas"."parcelas"("codigo");

-- CreateIndex
CREATE INDEX "parcelas_cultivo_id_idx" ON "parcelas"."parcelas"("cultivo_id");

-- CreateIndex
CREATE INDEX "parcelas_usuario_responsable_id_idx" ON "parcelas"."parcelas"("usuario_responsable_id");

-- CreateIndex
CREATE INDEX "parcelas_codigo_idx" ON "parcelas"."parcelas"("codigo");

-- AddForeignKey
ALTER TABLE "parcelas"."parcelas" ADD CONSTRAINT "parcelas_cultivo_id_fkey" FOREIGN KEY ("cultivo_id") REFERENCES "cultivos"."cultivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcelas"."parcelas" ADD CONSTRAINT "parcelas_usuario_responsable_id_fkey" FOREIGN KEY ("usuario_responsable_id") REFERENCES "seguridad"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
