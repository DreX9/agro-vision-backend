---
name: create-use-case
description: "Trigger: crear caso de uso, nuevo caso de uso, implementar operación, caso-uso, backend feature. Procedimiento paso a paso para crear Casos de Uso con Result Pattern en NestJS."
license: Apache-2.0
metadata:
  author: "agro-vision-team"
  version: "1.0"
---

# Procedimiento: Crear Caso de Uso

## Activation Contract
Activar cuando se vaya a implementar una nueva operación o funcionalidad de negocio en la capa de aplicación del backend.

## Reglas Inviolables
* Una clase por caso de uso con un único método público `ejecutar()`.
* Uso obligatorio del patrón `Result<T, E>` para control funcional de errores.
* Validación de entrada con `class-validator` en Commands / Queries con mensajes en español.
* Documentación JSDoc explicando el propósito de negocio.

## Pasos de Ejecución
1. Identificar el contexto delimitado (Bounded Context).
2. Definir el Command o Query en `application/commands/` o `application/queries/`.
3. Definir o actualizar el puerto del repositorio en `domain/ports/`.
4. Implementar el Caso de Uso en `application/use-cases/`.
5. Exponer el endpoint en el controlador correspondiente en `presentation/controllers/` con decoradores Swagger OpenAPI.
6. Ejecutar `pnpm run build` para validar tipado estricto.

### Plantilla de Caso de Uso

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { Result } from '@/shared/domain/result';
import { RegistrarCultivoCommand } from '../commands/registrar-cultivo.command';
import { CultivoRepositoryPort } from '../../domain/ports/cultivo.repository.port';
import { CultivoRespuestaDto } from '../dtos/cultivo-respuesta.dto';
import { CultivoError } from '../../domain/errors/cultivo.error';

/**
 * @description Caso de uso para registrar un nuevo cultivo en una parcela.
 */
@Injectable()
export class RegistrarCultivoCasoUso {
  private readonly logger = new Logger(RegistrarCultivoCasoUso.name);

  constructor(private readonly cultivoRepositorio: CultivoRepositoryPort) {}

  /**
   * @description Ejecuta el registro del cultivo validando disponibilidad de la parcela.
   * @param comando Datos validados de entrada.
   * @returns Resultado con el DTO del cultivo o error tipado de dominio.
   */
  async ejecutar(comando: RegistrarCultivoCommand): Promise<Result<CultivoRespuestaDto, CultivoError>> {
    this.logger.log(`Registrando cultivo "${comando.nombre}" en parcela ${comando.parcelaId}`);

    const cultivoGuardado = await this.cultivoRepositorio.guardar(comando);
    return Result.ok(CultivoRespuestaDto.desdeEntidad(cultivoGuardado));
  }
}
```