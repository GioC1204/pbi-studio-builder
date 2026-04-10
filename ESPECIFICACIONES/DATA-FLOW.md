# Data Flow — Power BI Studio Builder

## Flujo Completo End-to-End

```
USUARIO (Browser)
    │
    ├─ 1. Login → POST /auth/login → JWT token
    │
    ├─ 2. Crear proyecto → POST /projects
    │
    ├─ 3. Llenar Módulo 1 (Data Source)
    │   └─ POST /projects/:id/modules/1 { data: {...} }
    │
    ├─ 4. Llenar Módulo 2 (Theme)
    │   └─ POST /projects/:id/modules/2 { data: {...} }
    │
    ├─ 5. Llenar Módulo 3 (Business Logic)
    │   └─ POST /projects/:id/modules/3 { data: {...} }
    │
    ├─ 6. Llenar Módulo 4 (Security)
    │   └─ POST /projects/:id/modules/4 { data: {...} }
    │
    ├─ 7. Llenar Módulo 6 (Documentation) ← NUEVO
    │   └─ POST /projects/:id/modules/6 { data: {...} }
    │
    ├─ 8. Revisión (Módulo 5) → POST /projects/:id/generate
    │
    └─ 9. Suscribirse a SSE → GET /projects/:id/status/stream
           │
           └─ Recibir eventos de progreso (0% → 100%)

BACKEND (generationController)
    │
    ├─ Validar módulos 1-4 + 6 completos
    ├─ UPDATE projects SET status = 'generating'
    └─ polarisService.generate(project, emitSSE)

POLARIS SERVICE (Pipeline)
    │
    ├─ generateSemanticModel() → *.SemanticModel/definition/
    │   ├─ model.tmdl
    │   └─ tables/*.tmdl (uno por tabla)
    │
    ├─ generateReport() → *.Report/definition/pages/
    │   └─ [PageName]/page.json
    │
    ├─ applyThemeAndSecurity() → theme.json + RLS en TMDL
    │
    ├─ generatePbip() → [name].pbip
    ├─ generateMetadata() → metadata.json
    ├─ generateAudit() → audit.json
    │
    └─ generateDocumentation() → /documentation/
        ├─ data_dictionary.md
        ├─ measures_guide.md
        ├─ rls_documentation.md
        ├─ user_manual.md
        ├─ technical_spec.md
        ├─ deployment_guide.md
        └─ changelog.md

OUTPUT
    │
    └─ GENERATED-PROJECTS/:projectId/
        ├─ [name].pbip ← Abre en Power BI Desktop
        ├─ metadata.json
        ├─ audit.json
        └─ documentation/ ← Manuales técnicos (Módulo 6)

USUARIO DESCARGA
    └─ GET /projects/:id/download → ZIP con todo
```

---

## Estado del Proyecto

```
draft → (llenando módulos)
     → generating → completed
                 → error
```
