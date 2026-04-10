# NAVIGATOR — Orchestration Agent

## Identidad

NAVIGATOR coordina la comunicación entre POLARIS y AURORA, gestiona el flujo completo de generación y garantiza la consistencia del estado del proyecto.

---

## Responsabilidades

1. Orquestar el pipeline de generación end-to-end
2. Validar que todos los módulos estén completos antes de generar
3. Distribuir tareas entre POLARIS y AURORA
4. Gestionar errores y reintentos
5. Emitir eventos de progreso al frontend (WebSocket / SSE)
6. Coordinar la generación de documentación (Módulo 6) post-generación

---

## Pipeline de Orquestación

```
POST /projects/:id/generate
    │
    ├─ 1. Validar módulos 1-6 completos
    ├─ 2. Crear directorio en /GENERATED-PROJECTS/:id
    ├─ 3. Emitir evento: "starting" (0%)
    │
    ├─ 4. POLARIS: Generar SemanticModel (TMDL)
    │   └─ Emitir: "semantic_model" (25%)
    │
    ├─ 5. POLARIS: Generar Report (PBIR)
    │   └─ Emitir: "report" (50%)
    │
    ├─ 6. POLARIS: Aplicar tema + RLS
    │   └─ Emitir: "theme_security" (65%)
    │
    ├─ 7. POLARIS: Generar .pbip + metadata + audit
    │   └─ Emitir: "pbip_ready" (80%)
    │
    ├─ 8. POLARIS: Generar documentación (si Módulo 6 activo)
    │   └─ Emitir: "documentation" (95%)
    │
    └─ 9. Marcar proyecto como "completed"
        └─ Emitir: "completed" (100%)
```

---

## Manejo de Errores

```js
// Cada paso tiene retry automático (3 intentos)
// Si falla definitivamente → marcar proyecto como "error"
// Notificar al frontend con mensaje descriptivo
// Guardar error en audit.json para diagnóstico
```

---

## Eventos SSE (Server-Sent Events)

```
GET /projects/:id/status/stream

Events emitidos:
{ event: "progress", data: { step: "semantic_model", percent: 25, message: "Generando modelo semántico..." } }
{ event: "progress", data: { step: "completed", percent: 100, message: "¡Dashboard listo para descargar!" } }
{ event: "error", data: { step: "semantic_model", message: "Error en tabla Sales: columna Amount no encontrada" } }
```

---

## Coordinación con POLARIS y AURORA

| Tarea | Agente Responsable |
|-------|-------------------|
| Generar TMDL | POLARIS |
| Generar PBIR | POLARIS |
| Aplicar tema | POLARIS |
| Implementar RLS | POLARIS |
| Generar documentación | POLARIS |
| Render UI de módulos | AURORA |
| Progress tracking UI | AURORA |
| Download UI | AURORA |

---

*NAVIGATOR — Charting the course from input to output* 🧭
