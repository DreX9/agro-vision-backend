---
name: create-prisma-model
description: "Trigger: crear modelo prisma, nueva tabla, migración prisma, model schema, database migration. Guía para definir modelos de datos y migraciones con Prisma 6."
license: Apache-2.0
metadata:
  author: "agro-vision-team"
  version: "1.0"
---

# Procedimiento: Crear Modelo Prisma

## Activation Contract
Activar cuando se diseñe o modifique una entidad persistente en la base de datos PostgreSQL.

## Reglas Inviolables
* Cada modelo debe incluir obligatoriamente los **7 campos de auditoría universal**.
* Claves primarias con **UUIDv7**: `@id @default(uuid(7)) @db.Uuid`.
* Mapeo explícito a nombres `snake_case` con `@@map("nombre_tabla")` y `@map("nombre_columna")`.
* Relaciones hacia entidades maestras configuradas con `onDelete: Restrict`.
* Índices explícitos en todas las claves foráneas: `@@index([relacionId])`.

## Pasos de Ejecución
1. Abrir o crear el archivo del contexto en `prisma/schema/<contexto>.prisma`.
2. Definir el modelo con nombre en **PascalCase**.
3. Incorporar los 7 campos de auditoría universal.
4. Validar sintaxis con `pnpm exec prisma validate`.
5. Generar y aplicar la migración con:
   ```bash
   pnpm exec prisma migrate dev --name <descripcion_en_snake_case>
   ```
6. Verificar que el cliente se haya regenerado con `pnpm exec prisma generate`.

### Plantilla de Modelo

```prisma
// prisma/schema/parcelas.prisma

model Parcela {
  id          String   @id @default(uuid(7)) @db.Uuid
  nombre      String   @map("nombre") @db.VarChar(120)
  areaHectareas Decimal @map("area_hectareas") @db.Decimal(10, 4)
  ubicacion   String?  @map("ubicacion") @db.VarChar(255)
  activo      Boolean  @default(true) @map("activo")

  // Auditoría Universal
  createdAt   DateTime  @default(now()) @map("created_at")
  createdBy   String    @map("created_by") @db.Uuid
  updatedAt   DateTime  @updatedAt @map("updated_at")
  updatedBy   String    @map("updated_by") @db.Uuid
  deletedAt   DateTime? @map("deleted_at")
  version     Int       @default(1) @map("version")

  @@map("parcelas")
  @@schema("parcelas")
}
```