# Guía de Prisma — Migraciones, Schema Modular y Semillas

Configuración de **Prisma 6** con esquema modular multi-archivo en `prisma/schema/` sobre **PostgreSQL 16**.

---

## 1. Estructura de Schemas Modulares

Para mantener la base de datos limpia y alineada a los Bounded Contexts, los modelos se dividen por dominio:

```text
prisma/
├── schema/
│   ├── base.prisma             # Generadores, datasource PostgreSQL y extensiones
│   ├── seguridad.prisma        # Usuarios, roles, permisos y auditoría de sesiones
│   ├── parcelas.prisma         # Terrenos, sectores, coordenadas
│   ├── cultivos.prisma         # Tipos de cultivo, siembras, cosechas
│   ├── monitoreo.prisma        # Sensores, lecturas ambientales
│   └── diagnosticos.prisma     # Diagnósticos de visión computacional, plagas
├── migrations/                 # Historial de migraciones SQL versionadas
└── seed.ts                     # Script de semilla inicial de datos
```

---

## 2. Comandos Esenciales

Todos los comandos se ejecutan a través de `pnpm`:

```bash
# Generar el cliente de Prisma tras cualquier modificación en los esquemas
pnpm exec prisma generate

# Validar la sintaxis de todos los archivos .prisma
pnpm exec prisma validate

# Crear y aplicar una nueva migración en desarrollo
pnpm exec prisma migrate dev --name <nombre_descriptivo_en_snake_case>

# Consultar el estado de sincronización de la base de datos
pnpm exec prisma migrate status

# Aplicar migraciones en entornos de producción o CI/CD (sin borrar datos)
pnpm exec prisma migrate deploy

# Ejecutar el script de semilla inicial
pnpm exec prisma db seed
```

---

## 3. Convenciones de Modelado de Datos

1. **Claves Primarias:** Uso de UUIDv7 `@id @default(uuid(7)) @db.Uuid`.
2. **7 Campos de Auditoría Universal:** Toda tabla persistente debe incluir:
   ```prisma
   createdAt DateTime  @default(now()) @map("created_at")
   createdBy String    @map("created_by") @db.Uuid
   updatedAt DateTime  @updatedAt @map("updated_at")
   updatedBy String    @map("updated_by") @db.Uuid
   deletedAt DateTime? @map("deleted_at")
   version   Int       @default(1) @map("version")
   ```
3. **Nomenclatura:** 
   * Modelos en **PascalCase** (`ParcelaAgricola`, `DiagnosticoCultivo`).
   * Tablas y columnas mapeadas a **snake_case** con `@@map("nombre_tabla")` y `@map("nombre_columna")`.
   * Esquema PostgreSQL asignado con `@@schema("contexto")`.
4. **Protección de Relaciones:** Relaciones hacia entidades maestras configuradas con `onDelete: Restrict`.
5. **Índices:** Índices en todas las claves foráneas con `@@index([claveForaneaId])`.

---

## 4. Plantilla de Modelo Base

```prisma
// prisma/schema/cultivos.prisma

model Cultivo {
  id          String    @id @default(uuid(7)) @db.Uuid
  nombre      String    @map("nombre") @db.VarChar(120)
  variedad    String    @map("variedad") @db.VarChar(120)
  descripcion String?   @map("descripcion") @db.Text
  activo      Boolean   @default(true) @map("activo")

  // Relaciones
  parcelaId   String    @map("parcela_id") @db.Uuid
  parcela     Parcela   @relation(fields: [parcelaId], references: [id], onDelete: Restrict)

  // Auditoría Universal
  createdAt   DateTime  @default(now()) @map("created_at")
  createdBy   String    @map("created_by") @db.Uuid
  updatedAt   DateTime  @updatedAt @map("updated_at")
  updatedBy   String    @map("updated_by") @db.Uuid
  deletedAt   DateTime? @map("deleted_at")
  version     Int       @default(1) @map("version")

  @@index([parcelaId])
  @@map("cultivos")
  @@schema("cultivos")
}
```

---

## 5. Script de Semilla (`seed.ts`)

El script `prisma/seed.ts` debe ser **idempotente** (utilizar `upsert` o validar existencia previa) para permitir múltiples ejecuciones sin duplicar roles o usuarios administradores iniciales.