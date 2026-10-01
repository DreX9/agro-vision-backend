---
name: verify-before-commit
description: "Trigger: verificar antes de commit, verify pipeline, check code, pre-commit, validación final. Checklist exhaustivo de calidad antes de cerrar una tarea."
license: Apache-2.0
metadata:
  author: "agro-vision-team"
  version: "1.0"
---

# Checklist de Verificación de Calidad

## Activation Contract
Activar antes de completar cualquier tarea o entregar código en Agro Vision Backend.

## Pipeline de Validación
Ejecutar secuencialmente los comandos de validación:

```bash
# 1. Compilación de TypeScript y verificación de tipos estricta
pnpm run build

# 2. Análisis estático de código y reglas de calidad
pnpm run lint

# 3. Pruebas unitarias y de integración
pnpm run test
```

## Checklist de Reglas de Gobierno
- [ ] **Cero `any`:** Ningún archivo introduce `any` o casteos inseguros.
- [ ] **Lenguaje Ubicuo:** Archivos, clases, métodos y endpoints en español técnico canónico.
- [ ] **Límite de líneas:** Ningún archivo supera las 300 líneas de código.
- [ ] **Swagger:** Todos los endpoints y DTOs están documentados con decoradores `@ApiProperty` y `@ApiOperation`.
- [ ] **Mensajes en español:** Todos los decoradores `class-validator` incluyen mensajes explicativos en español.
- [ ] **JSDoc:** Métodos y clases documentados con bloques `/** ... */` estructurados.