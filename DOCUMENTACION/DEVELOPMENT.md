# Development Guide — Power BI Studio Builder

## Workflow

1. Backend corre en `localhost:3000`
2. Frontend corre en `localhost:5173` (proxy `/api` → backend)
3. PostgreSQL en `localhost:5432`

## Agregar un nuevo campo a un módulo

1. Actualiza el JSON Schema en [ESPECIFICACIONES/JSON-SCHEMAS.md](ESPECIFICACIONES/JSON-SCHEMAS.md)
2. Agrega el campo al componente `Module[N].jsx` en `FRONTEND/src/components/modules/`
3. Si afecta la generación, actualiza `BACKEND/services/polarisService.js`
4. Si afecta la documentación (Módulo 6), actualiza la función `generateDocumentation()` en polarisService

## Agregar un nuevo tipo de manual (Módulo 6)

1. Agrega el flag en `ESPECIFICACIONES/JSON-SCHEMAS.md` (Módulo 6)
2. Agrega el checkbox en `FRONTEND/src/components/modules/Module6Documentation.jsx` (array `DOCUMENTS`)
3. Implementa la función de generación en `BACKEND/services/polarisService.js` (función `generateDocumentation`)
4. Actualiza `AGENTES/POLARIS.md` (Tier 7)

## Estructura de archivos clave

```
BACKEND/services/polarisService.js   ← Pipeline de generación completo
FRONTEND/src/context/ProjectContext.js ← Estado global del proyecto
FRONTEND/src/components/modules/     ← Los 6 módulos UI
BACKEND/database/schema.sql          ← Schema de base de datos
```

## Convenciones

- **Frontend:** Componentes en PascalCase, hooks con prefijo `use`
- **Backend:** camelCase para funciones, kebab-case para rutas
- **Base de datos:** snake_case para columnas
- **Commits:** `feat:`, `fix:`, `docs:` prefixes

## Tests

```bash
# Frontend
cd FRONTEND && npm test

# Backend
cd BACKEND && npm test
```
