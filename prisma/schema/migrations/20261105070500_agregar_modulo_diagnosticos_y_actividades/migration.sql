-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "diagnosticos";

-- CreateEnum
CREATE TYPE "diagnosticos"."estados_salud_foliar" AS ENUM ('OPTIMO', 'ALERTA', 'CRITICO', 'SIN_DETECCION');

-- AlterTable
ALTER TABLE "actividades"."actividades_agricolas" ADD COLUMN     "blanco_biologico" VARCHAR(150),
ADD COLUMN     "dias_carencia" INTEGER,
ADD COLUMN     "horas_reingreso" INTEGER,
ADD COLUMN     "metodo_aplicacion" VARCHAR(100),
ADD COLUMN     "sector_id" UUID;

-- AlterTable
ALTER TABLE "actividades"."actividades_recursos" ADD COLUMN     "cantidad_real" DECIMAL(10,2),
ADD COLUMN     "dosis" VARCHAR(100);

-- CreateTable
CREATE TABLE "diagnosticos"."diagnosticos_campo" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "parcela_id" UUID NOT NULL,
    "sector_id" UUID,
    "usuario_id" UUID,
    "latitud" DECIMAL(11,8) NOT NULL,
    "longitud" DECIMAL(11,8) NOT NULL,
    "estado_general" "diagnosticos"."estados_salud_foliar" NOT NULL DEFAULT 'OPTIMO',
    "salud_porcentaje" INTEGER NOT NULL DEFAULT 100,
    "total_plagas_detectadas" INTEGER NOT NULL DEFAULT 0,
    "es_alerta" BOOLEAN NOT NULL DEFAULT false,
    "detecciones" JSONB NOT NULL DEFAULT '[]',
    "recomendaciones" JSONB NOT NULL DEFAULT '[]',
    "tiempo_procesamiento_ms" INTEGER,
    "imagen_url" TEXT,
    "origen_captura" VARCHAR(50) DEFAULT 'DRON_SIMULADO',
    "observaciones" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnosticos_campo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "diagnosticos_campo_codigo_key" ON "diagnosticos"."diagnosticos_campo"("codigo");

-- CreateIndex
CREATE INDEX "diagnosticos_campo_parcela_id_idx" ON "diagnosticos"."diagnosticos_campo"("parcela_id");

-- CreateIndex
CREATE INDEX "diagnosticos_campo_sector_id_idx" ON "diagnosticos"."diagnosticos_campo"("sector_id");

-- CreateIndex
CREATE INDEX "diagnosticos_campo_usuario_id_idx" ON "diagnosticos"."diagnosticos_campo"("usuario_id");

-- CreateIndex
CREATE INDEX "diagnosticos_campo_es_alerta_idx" ON "diagnosticos"."diagnosticos_campo"("es_alerta");

-- CreateIndex
CREATE INDEX "diagnosticos_campo_created_at_idx" ON "diagnosticos"."diagnosticos_campo"("created_at");

-- CreateIndex
CREATE INDEX "actividades_agricolas_sector_id_idx" ON "actividades"."actividades_agricolas"("sector_id");

-- AddForeignKey
ALTER TABLE "actividades"."actividades_agricolas" ADD CONSTRAINT "actividades_agricolas_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "parcelas"."sectores_parcela"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticos"."diagnosticos_campo" ADD CONSTRAINT "diagnosticos_campo_parcela_id_fkey" FOREIGN KEY ("parcela_id") REFERENCES "parcelas"."parcelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticos"."diagnosticos_campo" ADD CONSTRAINT "diagnosticos_campo_sector_id_fkey" FOREIGN KEY ("sector_id") REFERENCES "parcelas"."sectores_parcela"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticos"."diagnosticos_campo" ADD CONSTRAINT "diagnosticos_campo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "seguridad"."usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

