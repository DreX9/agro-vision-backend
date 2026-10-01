# Arquitectura del Sistema - Agro Vision Backend

## 1. Visión General
* **Plataforma:** Sistema de monitoreo y análisis inteligente agrícola basado en visión computacional y telemetría.
* **Framework:** NestJS 12+ con TypeScript 6.
* **Patrón de Arquitectura:** Arquitectura Hexagonal (Puertos y Adaptadores / Clean Architecture) modular.
* **Persistencia:** Prisma 6 ORM con PostgreSQL multi-schema.
* **Gestor de Paquetes:** `pnpm`.

---

## 2. Estructura de Directorios

```text
src/
├── modules/                        # Módulos de dominio (Bounded Contexts)
│   └── <contexto>/                 # Ej: usuarios, parcelas, cultivos, monitoreo, diagnosticos
│       ├── domain/                 # Capa de Dominio (Núcleo)
│       │   ├── entities/           # Entidades de negocio
│       │   ├── value-objects/      # Objetos de valor
│       │   ├── errors/             # Errores tipados de dominio
│       │   └── ports/              # Interfaces / Puertos de repositorios y servicios externos
│       ├── application/            # Capa de Aplicación (Orquestación)
│       │   ├── use-cases/          # Casos de uso (una clase por acción, método ejecutar())
│       │   ├── commands/           # DTOs de comandos (mutaciones)
│       │   ├── queries/            # DTOs de consultas (lecturas)
│       │   ├── dtos/               # DTOs de respuesta / transferencia
│       │   └── mappers/            # Mapeadores entre dominio, DTOs y persistencia
│       ├── infrastructure/         # Capa de Infraestructura (Adaptadores de salida)
│       │   ├── repositories/       # Implementaciones de repositorios con Prisma
│       │   └── adapters/           # Adaptadores para servicios externos, almacenamiento, IA
│       ├── presentation/           # Capa de Presentación (Adaptadores de entrada)
│       │   ├── controllers/        # Controladores REST con Swagger
│       │   ├── dtos/               # Request DTOs con validaciones class-validator
│       │   └── guards/             # Guards específicos del módulo
│       └── <contexto>.module.ts    # Configuración del módulo NestJS
├── prisma/                         # Módulo y servicio global de Prisma
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── shared/                         # Utilidades transversales y componentes compartidos
│   ├── domain/                     # Result Pattern, interfaces base
│   ├── infrastructure/             # Filtros de excepciones globales, interceptores
│   └── presentation/               # Decoradores globales, pipes de validación
└── main.ts                         # Punto de entrada de la aplicación
```

---

## 3. Bounded Contexts (Esquemas de Base de Datos)

El sistema se organiza en contextos delimitados modulares:

* `seguridad`: Gestión de usuarios, autenticación, roles, permisos y auditoría de accesos.
* `parcelas`: Registro y delimitación de terrenos, geolocalización, lotes y sectores agrícolas.
* `cultivos`: Variedades agrícolas, ciclos de siembra, fenología y cronogramas de cosecha.
* `monitoreo`: Registro de sensores IoT (humedad, temperatura, radiación) y lecturas climáticas.
* `diagnosticos`: Análisis de imágenes de visión computacional, detección de plagas, anomalías y recomendaciones.
* `catalogos`: Tipos de suelo, tipos de plagas, fertilizantes y parámetros agronómicos estándar.

---

## 4. Patrones de Diseño Clave

1. **Casos de Uso Unitarios:** Cada operación de negocio se implementa en una clase única con un solo método público `ejecutar()`.
2. **Result Pattern Funcional:** Uso de `Result<T, E>` para retorno de operaciones, evitando excepciones inesperadas en tiempo de ejecución.
3. **Puertos y Adaptadores:** El dominio y la aplicación solo dependen de interfaces (puertos). La infraestructura (Prisma, APIs externas) implementa dichos puertos.
4. **Auditoría Universal:** Todas las tablas maestras incorporan 7 campos de auditoría (`createdAt`, `createdBy`, `updatedAt`, `updatedBy`, `deletedAt`, `version`).
5. **Identificadores Únicos:** Uso de **UUIDv7** (ordenables cronológicamente) como identificadores primarios.
6. **Manejo de Errores Tipado:** Errores de dominio mapeados a códigos HTTP adecuados mediante filtros globales.

---

## 5. Tech Stack

| Capa / Componente | Tecnología |
| :--- | :--- |
| **Runtime** | Node.js 22 LTS |
| **Framework** | NestJS 12.x |
| **Lenguaje** | TypeScript 6.0 |
| **ORM** | Prisma 6.x (Multi-schema) |
| **Base de Datos** | PostgreSQL 16 |
| **Validación** | class-validator + class-transformer |
| **Documentación API** | Swagger / OpenAPI (`/api/docs`) |
| **Testing** | Vitest |
| **Linter / Formatter** | Oxlint / Prettier |
| **Gestor de Paquetes** | `pnpm` |