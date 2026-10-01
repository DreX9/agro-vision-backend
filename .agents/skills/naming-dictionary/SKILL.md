---
name: naming-dictionary
description: "Trigger: naming, verbos, nomenclatura, caso de uso name, lenguaje ubicuo. Diccionario canónico de verbos y nomenclatura estándar para Agro Vision Backend."
license: Apache-2.0
metadata:
  author: "agro-vision-team"
  version: "1.0"
---

# Diccionario Canónico de Nomenclatura

## Activation Contract
Activar siempre que se deba nombrar clases, archivos, casos de uso, tablas, entidades o métodos en Agro Vision Backend.

## Reglas Inviolables
* **Solo los 20 verbos canónicos** listados a continuación.
* **Fórmula de casos de uso:** `{VerboCanónico}{Entidad}.caso-uso.ts` (clase `{VerboCanónico}{Entidad}CasoUso`).
* **Lenguaje Ubicuo en Español:** Todo módulo, entidad, controlador, repositorio o DTO debe nombrarse en español técnico canónico (`cultivos`, `parcelas`, `monitoreo`, `diagnosticos`, `usuarios`). Prohibidos los anglicismos (`crop`, `plot`, `auth`, `login`, `user`).
* **Método estándar:** Los casos de uso implementan siempre el método público `ejecutar()`, nunca `execute()` ni `handle()`.

## Verbos Prohibidos
`get`, `create`, `save`, `update`, `delete`, `handle`, `process`, `make`, `do`, `execute`, `fetch`, `find`, `remove`, `set`, `put`, `post`, `patch`, `download`, `export`, `generate`.

## Diccionario Oficial (20 Verbos Canónicos)

### 1. Escritura y Persistencia
* `Registrar` — Crear nueva entidad en el sistema (`RegistrarParcela`, `RegistrarCultivo`, `RegistrarSensor`).
* `Actualizar` — Modificar datos de una entidad existente (`ActualizarDatosCultivo`, `ActualizarEstadoParcela`).
* `Eliminar` — Eliminación lógica o baja (`EliminarDiagnostico`).

### 2. Ciclo de Vida y Estados
* `Activar` — Habilitar entidad o sensor (`ActivarSensorMonitoreo`).
* `Suspender` — Inhabilitar temporalmente (`SuspenderUsuario`).
* `Anular` — Cancelación con trazabilidad (`AnularDiagnostico`).
* `Finalizar` — Completar un ciclo o cosecha (`FinalizarCicloCultivo`).

### 3. Negocio y Análisis Agrícola
* `Analizar` — Procesar datos para obtener métricas (`AnalizarLecturasSensores`).
* `Diagnosticar` — Procesamiento con IA / Visión computacional (`DiagnosticarPlagaImagen`).
* `Asignar` — Vincular recursos (`AsignarSensorAParcela`).
* `Aprobar` — Validar acción agronómica (`AprobarTratamiento`).
* `Rechazar` — Denegar propuesta o acción (`RechazarSolicitud`).

### 4. Lectura y Consultas
* `ObtenerPorId` — Obtener una entidad específica por su identificador (`ObtenerParcelaPorId`).
* `Listar` — Obtener lista paginada y filtrada (`ListarCultivosActivos`).
* `Consultar` — Consulta avanzada con agregaciones o métricas (`ConsultarMetricasHumedadPeriodo`).
* `Calcular` — Algoritmos agronómicos (`CalcularIndiceVegetacion`).

### 5. Documentos y Exportación
* `Generar` — Crear reportes o diagnósticos en formato final (`GenerarReporteSaludCultivo`).
* `Descargar` — Obtener archivos adjuntos o imágenes (`DescargarImagenProcesada`).
* `Exportar` — Exportar conjunto de datos (`ExportarHistoricoLecturasExcel`).
* `Sincronizar` — Alinear datos con dispositivos IoT (`SincronizarLecturasEstacion`).