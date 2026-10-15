-- DropForeignKey
ALTER TABLE "parcelas"."parcelas" DROP CONSTRAINT "parcelas_cultivo_id_fkey";

-- DropIndex
DROP INDEX "parcelas"."parcelas_codigo_idx";

-- AlterTable
ALTER TABLE "parcelas"."parcelas" ADD COLUMN     "color_hex" VARCHAR(7) DEFAULT '#15803D',
ALTER COLUMN "cultivo_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "parcelas"."sectores_parcela" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "area_hectareas" DECIMAL(10,4) NOT NULL,
    "color_hex" VARCHAR(7),
    "parcela_id" UUID NOT NULL,
    "cultivo_id" UUID NOT NULL,
    "variedad" VARCHAR(100),
    "delimitacion_geo_json" JSONB NOT NULL,
    "latitud_centro" DECIMAL(11,8),
    "longitud_centro" DECIMAL(11,8),
    "fecha_siembra" TIMESTAMP(3),
    "fecha_cosecha_estimada" TIMESTAMP(3),
    "estado" "parcelas"."estados_parcela" NOT NULL DEFAULT 'ACTIVA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" UUID,
    "deleted_at" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "sectores_parcela_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sectores_parcela_parcela_id_idx" ON "parcelas"."sectores_parcela"("parcela_id");

-- CreateIndex
CREATE INDEX "sectores_parcela_cultivo_id_idx" ON "parcelas"."sectores_parcela"("cultivo_id");

-- CreateIndex
CREATE UNIQUE INDEX "sectores_parcela_parcela_id_codigo_key" ON "parcelas"."sectores_parcela"("parcela_id", "codigo");

-- AddForeignKey
ALTER TABLE "parcelas"."parcelas" ADD CONSTRAINT "parcelas_cultivo_id_fkey" FOREIGN KEY ("cultivo_id") REFERENCES "cultivos"."cultivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcelas"."sectores_parcela" ADD CONSTRAINT "sectores_parcela_parcela_id_fkey" FOREIGN KEY ("parcela_id") REFERENCES "parcelas"."parcelas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcelas"."sectores_parcela" ADD CONSTRAINT "sectores_parcela_cultivo_id_fkey" FOREIGN KEY ("cultivo_id") REFERENCES "cultivos"."cultivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
