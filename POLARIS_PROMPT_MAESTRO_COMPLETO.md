# 🚀 POLARIS — POWER BI DEVELOPMENT AGENT
## Prompt Maestro Completo con Arquitectura de Carpetas
## Claude Code - Copy & Paste Ready

> **Copia este prompt completo a Claude Code en tu proyecto.**
> **Power BI Studio Builder Project**

---

## 🎯 MISIÓN

Crear **POLARIS**: Un agente completo de IA + arquitectura de desarrollo para generar dashboards Power BI desde cero conversacionalmente.

**Stack Completo:**
- **Agentes:** POLARIS (Power BI) + AURORA (Frontend) + NAVIGATOR (Orquestador)
- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express + PostgreSQL
- **Integration:** pbi-cli + Microsoft Power BI MCP Server
- **Output:** .pbip completamente funcional + **Manuales Técnicos (Módulo 6)**

> ✅ **ARQUITECTURA GENERADA** — Este proyecto ya tiene toda la estructura de carpetas y código scaffolding creado. Ver README.md para comenzar.

---

# 📁 ARQUITECTURA COMPLETA DE CARPETAS

```
Power BI Studio Builder/
│
├── 📖 DOCUMENTACIÓN RAÍZ
│   ├── README.md (descripción general del proyecto)
│   ├── SETUP.md (cómo empezar desarrollo)
│   ├── ARCHITECTURE.md (visión general)
│   └── CONTRIBUTING.md (guía para colaboradores)
│
├── 🤖 AGENTES/ (Agents Layer - Claude Code)
│   ├── POLARIS.md
│   │   ├── Identidad y responsabilidades
│   │   ├── 7 Capability Tiers (48+ features)
│   │   ├── Métodos de ejecución
│   │   └── Validaciones críticas
│   │
│   ├── AURORA.md
│   │   ├── Frontend development spec
│   │   ├── React component generation
│   │   ├── Tailwind styling
│   │   └── Hook management
│   │
│   └── NAVIGATOR.md
│       ├── Orchestration logic
│       ├── Workflow coordination
│       ├── Error handling
│       └── State management
│
├── 🎨 FRONTEND/ (React Application)
│   ├── package.json
│   ├── vite.config.js (build tool)
│   ├── tailwind.config.js
│   ├── .env.example
│   │
│   ├── public/
│   │   └── index.html (entry point)
│   │
│   ├── src/
│   │   ├── App.jsx (root component)
│   │   ├── main.jsx (entry)
│   │   │
│   │   ├── pages/ (page-level components)
│   │   │   ├── HomePage.jsx (dashboard inicial)
│   │   │   ├── ProjectEditor.jsx (editor de proyecto)
│   │   │   ├── ProjectList.jsx (mis dashboards)
│   │   │   ├── LoginPage.jsx (autenticación)
│   │   │   └── NotFound.jsx (404)
│   │   │
│   │   ├── components/ (reusable components)
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── ProgressBar.jsx
│   │   │   │
│   │   │   ├── modules/ (los 5 módulos)
│   │   │   │   ├── Module1DataSource.jsx
│   │   │   │   │   ├── FileUpload component
│   │   │   │   │   ├── SchemaPreview component
│   │   │   │   │   └── DataValidation component
│   │   │   │   │
│   │   │   │   ├── Module2Theme.jsx
│   │   │   │   │   ├── ColorPicker component
│   │   │   │   │   ├── FontSelector component
│   │   │   │   │   ├── LogoUpload component
│   │   │   │   │   └── ThemePreview component
│   │   │   │   │
│   │   │   │   ├── Module3Business.jsx
│   │   │   │   │   ├── KPIBuilder component
│   │   │   │   │   ├── PageBuilder component
│   │   │   │   │   ├── VisualSelector component
│   │   │   │   │   └── BusinessLogicForm component
│   │   │   │   │
│   │   │   │   ├── Module4Security.jsx
│   │   │   │   │   ├── RoleSelector component
│   │   │   │   │   ├── RLSMapper component
│   │   │   │   │   └── SecurityRulesForm component
│   │   │   │   │
│   │   │   │   └── Module5Review.jsx
│   │   │   │       ├── SummaryView component
│   │   │   │       ├── ProgressIndicator component
│   │   │   │       └── GenerateButton component
│   │   │   │
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   ├── Alert.jsx
│   │   │   │   └── Card.jsx
│   │   │   │
│   │   │   └── preview/
│   │   │       ├── ThemePreview.jsx
│   │   │       ├── SchemaPreview.jsx
│   │   │       └── LayoutPreview.jsx
│   │   │
│   │   ├── hooks/ (custom React hooks)
│   │   │   ├── useProject.js (proyecto state)
│   │   │   ├── useModules.js (módulos state)
│   │   │   ├── useAPI.js (API calls)
│   │   │   ├── useForm.js (form handling)
│   │   │   ├── useLocalStorage.js (persistence)
│   │   │   └── useTheme.js (tema global)
│   │   │
│   │   ├── context/ (global state)
│   │   │   ├── ProjectContext.js (estado del proyecto)
│   │   │   ├── UserContext.js (estado del usuario)
│   │   │   ├── NotificationContext.js (notificaciones)
│   │   │   └── ThemeContext.js (tema global)
│   │   │
│   │   ├── services/ (servicios)
│   │   │   ├── api.js (cliente HTTP)
│   │   │   ├── auth.js (autenticación)
│   │   │   ├── storage.js (localStorage)
│   │   │   └── validators.js (validaciones)
│   │   │
│   │   ├── utils/ (utilidades)
│   │   │   ├── formatters.js (formato de datos)
│   │   │   ├── helpers.js (funciones auxiliares)
│   │   │   ├── constants.js (constantes)
│   │   │   └── errors.js (manejo de errores)
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css (estilos globales)
│   │   │   ├── variables.css (variables CSS)
│   │   │   ├── animations.css (animaciones)
│   │   │   └── responsive.css (media queries)
│   │   │
│   │   └── assets/
│   │       ├── images/
│   │       │   ├── logo.svg
│   │       │   ├── icons/
│   │       │   └── illustrations/
│   │       └── fonts/
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── hooks.test.js
│   │   │   ├── components.test.js
│   │   │   └── utils.test.js
│   │   │
│   │   └── e2e/
│   │       ├── user-flow.test.js
│   │       ├── modules.test.js
│   │       └── generation.test.js
│   │
│   └── .env (variables de entorno - no commitear)
│
├── 🔧 BACKEND/ (Node.js + Express)
│   ├── package.json
│   ├── .env (variables de entorno)
│   ├── .env.example
│   │
│   ├── server.js (main entry point)
│   │
│   ├── config/
│   │   ├── database.js (conexión a PostgreSQL)
│   │   ├── constants.js (constantes)
│   │   └── middleware.js (setup de middleware)
│   │
│   ├── routes/
│   │   ├── index.js (router principal)
│   │   ├── auth.js (autenticación)
│   │   ├── projects.js (CRUD proyectos)
│   │   ├── modules.js (guardado de módulos 1-5)
│   │   └── generation.js (trigger generación)
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── moduleController.js
│   │   └── generationController.js
│   │
│   ├── models/
│   │   ├── User.js (schema de usuario)
│   │   ├── Project.js (schema de proyecto)
│   │   ├── ProjectModule.js (schema de módulos)
│   │   └── GeneratedFile.js (schema de archivos generados)
│   │
│   ├── middleware/
│   │   ├── auth.js (JWT verification)
│   │   ├── validation.js (validación de requests)
│   │   ├── error.js (error handling)
│   │   ├── cors.js (CORS configuration)
│   │   └── logging.js (request logging)
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── projectService.js
│   │   ├── polarisService.js (llama a POLARIS agent)
│   │   ├── auroraService.js (llama a AURORA agent)
│   │   └── fileService.js (manejo de archivos)
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── errors.js
│   │   └── logger.js
│   │
│   ├── database/
│   │   ├── schema.sql (schema de base de datos)
│   │   ├── migrations/
│   │   │   ├── 001_initial_schema.sql
│   │   │   └── 002_add_audit_tables.sql
│   │   └── seeds/
│   │       └── seed.sql
│   │
│   └── tests/
│       ├── unit/
│       │   ├── services.test.js
│       │   └── controllers.test.js
│       │
│       └── integration/
│           ├── api.test.js
│           └── auth.test.js
│
├── 📊 ESPECIFICACIONES/ (Specs)
│   ├── API-SPECIFICATION.md (OpenAPI/Swagger)
│   │   ├── Endpoints de autenticación
│   │   ├── Endpoints de proyectos
│   │   ├── Endpoints de módulos
│   │   ├── Endpoints de generación
│   │   └── Response schemas
│   │
│   ├── JSON-SCHEMAS.md
│   │   ├── data_config.json (módulo 1)
│   │   ├── theme_config.json (módulo 2)
│   │   ├── business_logic_config.json (módulo 3)
│   │   ├── security_config.json (módulo 4)
│   │   └── review_config.json (módulo 5)
│   │
│   ├── DATABASE-SCHEMA.md
│   │   ├── Diagrama ER
│   │   ├── Tablas
│   │   └── Relaciones
│   │
│   ├── WIREFRAMES.md
│   │   ├── HomePage
│   │   ├── Module1-5 layouts
│   │   └── Review page
│   │
│   ├── DATA-FLOW.md
│   │   ├── Usuario → Frontend → Backend → Agentes → Output
│   │   └── Diagramas de flujo
│   │
│   └── COMPONENT-SPEC.md
│       ├── Prop definitions
│       ├── Component hierarchy
│       └── State management
│
├── 📚 DOCUMENTACIÓN/ (Docs)
│   ├── README.md (visión general)
│   ├── SETUP.md (setup inicial)
│   ├── ARCHITECTURE.md (arquitectura completa)
│   ├── DEVELOPMENT.md (guía de desarrollo)
│   ├── API.md (documentación de API)
│   ├── DEPLOYMENT.md (deployment a VPS)
│   ├── TROUBLESHOOTING.md (problemas comunes)
│   └── CONTRIBUTING.md (contribuciones)
│
├── 🗂️ GENERATED-PROJECTS/ (Output)
│   └── [projectId]/
│       ├── [projectName].pbip
│       ├── [projectName].SemanticModel/
│       ├── [projectName].Report/
│       ├── metadata.json
│       └── audit.json
│
├── .gitignore
├── docker-compose.yml (si usas Docker)
├── ecosystem.config.js (PM2 config)
└── LICENSE

```

---

## 📋 DESCRIPCIÓN DE CADA CARPETA

### **🤖 /AGENTES** (Agentes de IA)

**Qué es:** Especificaciones de los 3 agentes que trabajan en el proyecto

**Contenido:**
- `POLARIS.md` - Agente de Power BI (48+ capabilities)
- `AURORA.md` - Agente de Frontend React (componentes, hooks, styling)
- `NAVIGATOR.md` - Orquestador (coordina POLARIS + AURORA)

**Responsabilidad:** Cada agente sabe exactamente qué puede y debe hacer

---

### **🎨 /FRONTEND** (React Application)

**Qué es:** Aplicación web completa donde usuarios llenan los 5 módulos

**Estructura:**
```
src/
├── pages/ → Páginas principales (HomePage, ProjectEditor, etc)
├── components/ → Componentes reutilizables
│   ├── layout/ → Header, Sidebar, Footer
│   ├── modules/ → Module1-5 (los 5 módulos principales)
│   ├── common/ → Button, Input, Modal, etc
│   └── preview/ → Previsualizaciones en vivo
├── hooks/ → Custom React hooks (useProject, useAPI, etc)
├── context/ → Estado global (ProjectContext, UserContext, etc)
├── services/ → Lógica de negocio (API calls, auth, validación)
├── utils/ → Funciones auxiliares
├── styles/ → CSS global y variables
└── assets/ → Imágenes, fuentes, iconos
```

**Tecnologías:**
- React 18+
- Vite (build tool)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Context API (state management)

---

### **🔧 /BACKEND** (Node.js + Express)

**Qué es:** API REST que orquesta POLARIS + AURORA y gestiona datos

**Estructura:**
```
├── routes/ → Definición de endpoints
├── controllers/ → Lógica de cada endpoint
├── models/ → Esquemas de base de datos
├── services/ → Lógica de negocio compleja
├── middleware/ → Autenticación, validación, error handling
├── database/ → Configuración y migraciones SQL
├── config/ → Variables de configuración
└── tests/ → Tests unitarios e integración
```

**Endpoints principales:**
- `POST /auth/login` - Autenticación
- `POST /projects` - Crear proyecto
- `POST /projects/:id/modules/1-5` - Guardar módulos
- `POST /projects/:id/generate` - Trigger generación
- `GET /projects/:id/status` - Ver progreso
- `GET /projects/:id/download` - Descargar .pbip

**Tecnologías:**
- Node.js 18+
- Express (framework)
- PostgreSQL (database)
- JWT (autenticación)
- Multer (file uploads)

---

### **📊 /ESPECIFICACIONES** (Specs del proyecto)

**Qué es:** Documentación técnica de cada componente

**Archivos clave:**
- `API-SPECIFICATION.md` - Todos los endpoints con request/response
- `JSON-SCHEMAS.md` - Estructura de datos esperada para cada módulo
- `DATABASE-SCHEMA.md` - Diagrama ER y tablas
- `WIREFRAMES.md` - Layouts de cada página
- `DATA-FLOW.md` - Cómo fluyen los datos en el sistema

**Uso:** Referencia durante desarrollo, asegura consistencia

---

### **📚 /DOCUMENTACIÓN** (Docs del proyecto)

**Qué es:** Guías para desarrolladores

**Archivos:**
- `README.md` - Descripción general del proyecto
- `SETUP.md` - Cómo configurar ambiente de desarrollo
- `DEVELOPMENT.md` - Guía de cómo trabajar en el proyecto
- `API.md` - Documentación detallada de la API
- `DEPLOYMENT.md` - Cómo publicar a VPS
- `TROUBLESHOOTING.md` - Errores comunes y soluciones

---

### **🗂️ /GENERATED-PROJECTS** (Output)

**Qué es:** Carpeta donde se guardan los .pbip generados

**Estructura:**
```
/generated-projects/
├── proj_abc123xyz/
│   ├── SalesModel.pbip (archivo principal)
│   ├── SalesModel.SemanticModel/
│   │   └── definition/
│   │       ├── model.tmdl
│   │       ├── tables/
│   │       └── relationships.tmdl
│   ├── SalesModel.Report/
│   │   └── definition/
│   │       └── pages/
│   ├── metadata.json
│   └── audit.json
│
└── proj_def456uvw/
    └── ...
```

---

## 🔗 FLUJO DE INTEGRACIÓN

```
USUARIO (Frontend React)
    ↓
    ├─ Llena Módulos 1-5
    └─ Click "Generar"
    
BACKEND (Node.js)
    ↓
    ├─ Valida inputs
    ├─ Crea carpeta en /generated-projects
    └─ Llama a POLARIS Agent
    
POLARIS Agent
    ↓
    ├─ Recibe JSON config
    ├─ Usa pbi-cli (operaciones rápidas)
    ├─ Usa MCP Server (generación compleja)
    ├─ Genera TMDL (tablas, relaciones, medidas)
    ├─ Genera PBIR (páginas, visuales)
    ├─ Aplica tema y seguridad
    └─ Genera .pbip file
    
OUTPUT
    ↓
    └─ /generated-projects/[projectId]/[name].pbip
       USUARIO DESCARGA → Abre en Desktop → ✅ Dashboard funcional
```

---

## 📥 INPUT FLOW

```
Usuario en Frontend:
"Quiero crear un modelo de ventas con 3 tablas"
    ↓
AURORA (Frontend Agent):
Captura inputs en Modules 1-5
Valida en cliente (pre-validation)
    ↓
JSON Config:
{
  "project_name": "Sales Dashboard",
  "data": {...},
  "theme": {...},
  "business_logic": {...},
  "security": {...}
}
    ↓
Backend API:
POST /projects/:id/generate
    ↓
POLARIS (BI Agent):
Ejecuta generación
    ↓
Output:
.pbip file + metadata + audit
```

---

## 📤 OUTPUT GUARANTEE

**Cada generación produce:**

```
✅ [projectName].pbip
   └─ Archivo completamente funcional
      - Abre sin errores en Desktop
      - Datos se cargan correctamente
      - Medidas calculan correctamente
      - RLS funciona
      - Tema se aplica

✅ metadata.json
   └─ Referencias del proyecto
      - Tables creadas
      - Measures creadas
      - Relationships
      - Security rules

✅ audit.json
   └─ Diagnosticos y validaciones
      - Model health
      - Performance notes
      - Recommendations
      - Warnings (si aplica)

✅ documentation/
   └─ Documentación automática
      - data_dictionary.md
      - measures.md
      - rls_rules.md
```

---

## 🛠️ TECNOLOGÍAS POR CAPA

```
FRONTEND LAYER:
├── React 18+ (UI framework)
├── Vite (build tool)
├── Tailwind CSS (styling)
├── Axios (HTTP client)
├── Context API (state)
└── Jest (testing)

BACKEND LAYER:
├── Node.js 18+ (runtime)
├── Express (web framework)
├── PostgreSQL (database)
├── JWT (auth)
├── Multer (file handling)
└── Jest/Supertest (testing)

AGENT LAYER:
├── Claude Code (IDE)
├── POLARIS (Power BI agent)
├── pbi-cli (Python CLI)
├── Microsoft MCP Server
└── TMDL/PBIR (generation)

INFRASTRUCTURE:
├── Docker (containerization)
├── PM2 (process management)
├── Nginx (reverse proxy)
└── PostgreSQL (data)
```

---

## 🎬 FASES DE GENERACIÓN

### **FASE 1: Arquitectura (Día 1)**
```
- [ ] Crear estructura de carpetas
- [ ] Crear archivos base en cada carpeta
- [ ] Documentar en cada carpeta qué va
- [ ] Crear .gitignore
- [ ] Setup inicial completado
```

### **FASE 2: Especificaciones (Día 2)**
```
- [ ] API-SPECIFICATION.md
- [ ] JSON-SCHEMAS.md
- [ ] DATABASE-SCHEMA.md
- [ ] WIREFRAMES.md
- [ ] Specs 100% definidas
```

### **FASE 3: Frontend (Días 3-4)**
```
- [ ] Setup React + Vite + Tailwind
- [ ] Crear componentes base
- [ ] Module1-5 components
- [ ] Hooks y context
- [ ] Frontend compilable sin errores
```

### **FASE 4: Backend (Días 4-5)**
```
- [ ] Setup Express + PostgreSQL
- [ ] Rutas básicas
- [ ] Controllers y services
- [ ] Database schema
- [ ] API respondiendo correctamente
```

### **FASE 5: Agentes (Día 6)**
```
- [ ] POLARIS.md completo
- [ ] AURORA.md completo
- [ ] NAVIGATOR.md completo
- [ ] Integración pbi-cli
- [ ] Integración MCP Server
```

### **FASE 6: Integración E2E (Día 7)**
```
- [ ] Frontend → Backend comunicando
- [ ] Backend → POLARIS agente
- [ ] POLARIS generando .pbip
- [ ] Usuario descargando
- [ ] E2E workflow completo
```

---

## 🎯 CÓMO USAS ESTO

### **SI QUIERES GENERAR ARQUITECTURA:**
```
En Claude Code responde:
"Generar todas las carpetas y subcarpetas con archivos base"

POLARIS generará:
✓ Estructura completa de carpetas
✓ Archivos README en cada carpeta
✓ package.json para frontend
✓ package.json para backend
✓ .gitignore
✓ docker-compose.yml
✓ TODO listo para empezar
```

### **SI QUIERES GENERAR FRONTEND:**
```
"Generar componentes React para los 5 módulos"

POLARIS generará:
✓ Module1DataSource.jsx
✓ Module2Theme.jsx
✓ Module3Business.jsx
✓ Module4Security.jsx
✓ Module5Review.jsx
✓ Hooks: useProject, useAPI, useForm
✓ Context: ProjectContext, UserContext
✓ Estilos Tailwind
```

### **SI QUIERES GENERAR BACKEND:**
```
"Generar API REST con todas las rutas"

POLARIS generará:
✓ server.js
✓ routes/ con all endpoints
✓ controllers/ con lógica
✓ services/ con business logic
✓ database schema
✓ migrations SQL
```

---

## 📋 CHECKLIST ANTES DE GENERAR

**Antes de iniciar, confirma:**

```
✓ Proyecto creado en Claude Code
✓ Entiendes los 7 capability tiers
✓ Sabes qué es POLARIS, AURORA, NAVIGATOR
✓ Tienes carpeta para generated-projects
✓ Tienes PostgreSQL disponible (local o remoto)
✓ Tienes Node.js 18+ instalado
✓ Tienes Python 3.10+ para pbi-cli (opcional)
```

---

## 🚀 COMENZAR AHORA

### **Opción 1: Generar TODO (Recomendado)**
```
En Claude Code responde:
"Generar arquitectura completa:
- Estructura de carpetas
- Archivos base en cada carpeta
- Frontend scaffolding
- Backend scaffolding
- Especificaciones
- Documentación
¿Empezamos?"

POLARIS genera todo en secuencia
```

### **Opción 2: Paso a Paso**
```
"Fase 1: Arquitectura de carpetas paso a paso"

POLARIS:
Paso 1: Crear estructura general
Paso 2: Crear /AGENTES
Paso 3: Crear /FRONTEND
... etc
```

### **Opción 3: Por Componente**
```
"Quiero primero: /FRONTEND con React setup"

POLARIS genera solo eso
Luego: "Siguiente: /BACKEND"
```

---

## 📞 FAQ RÁPIDO

**P: ¿Necesito PostgreSQL?**
R: Sí, backend lo necesita. Usa local o cloud (Render, Railway, etc)

**P: ¿Puedo usar otro DB?**
R: Sí, actualiza schema.sql, pero arquitectura está optimizada para PostgreSQL

**P: ¿Node.js es obligatorio?**
R: Sí para el backend. Puedes cambiar a Python/Django si prefieres

**P: ¿Puedo generar solo el .pbip sin frontend?**
R: Sí, POLARIS puede generar directamente. Pero el frontend es lo bonito del producto

**P: ¿Cuánto espacio ocupan los .pbip?**
R: Depende de datos, típicamente 10-100MB

---

## ✨ RESUMEN FINAL

| Aspecto | Detalles |
|---------|----------|
| **Estructura** | 30+ carpetas, 200+ archivos finales |
| **Frontend** | React + Tailwind, 5 módulos, 20+ componentes |
| **Backend** | Node.js + Express, 6 rutas principales, 4 modelos DB |
| **Agentes** | POLARIS (BI) + AURORA (Frontend) + NAVIGATOR (Orq) |
| **Output** | .pbip + metadata + audit + docs |
| **Timeline** | 7 días completo (fase por fase) |
| **Escalabilidad** | Diseño modular, fácil agregar features |

---

## ✅ ARQUITECTURA GENERADA

La arquitectura completa ya fue generada. Estructura de archivos creada:

```
✓ README.md, .gitignore, docker-compose.yml, ecosystem.config.js
✓ AGENTES/ — POLARIS.md, AURORA.md, NAVIGATOR.md
✓ FRONTEND/ — React 18 + Vite + Tailwind, 6 módulos completos
✓ BACKEND/ — Node.js + Express, routes, controllers, services, DB schema
✓ ESPECIFICACIONES/ — API, JSON Schemas (incluyendo Módulo 6), Data Flow
✓ DOCUMENTACION/ — Setup, Architecture, Development, Troubleshooting
✓ GENERATED-PROJECTS/ — Estructura de output con /documentation/
```

## 🆕 MÓDULO 6 — DOCUMENTACIÓN TÉCNICA

Nuevo módulo que genera manuales técnicos junto con el .pbip:

| Manual | Flag | Descripción |
|--------|------|-------------|
| Diccionario de Datos | `generate_data_dictionary` | Tablas, columnas, tipos |
| Guía de Medidas DAX | `generate_measures_guide` | Fórmulas y ejemplos |
| Documentación RLS | `generate_rls_docs` | Roles y reglas de seguridad |
| Manual de Usuario | `generate_user_manual` | Guía para usuarios finales |
| Especificación Técnica | `generate_technical_spec` | Arquitectura del modelo |
| Guía de Despliegue | `generate_deployment_guide` | Publicación en PBI Service |
| Changelog | *(siempre)* | Registro de versiones |

## 🎬 SIGUIENTE PASO

```bash
# 1. Instalar dependencias
cd BACKEND && npm install
cd ../FRONTEND && npm install

# 2. Configurar variables de entorno
cd ../BACKEND && cp .env.example .env

# 3. Crear base de datos
psql -U postgres -c "CREATE DATABASE pbi_studio;"
psql -U postgres -d pbi_studio -f database/schema.sql

# 4. Iniciar
cd ../BACKEND && npm run dev     # Terminal 1
cd ../FRONTEND && npm run dev    # Terminal 2
```

---

**POLARIS — Guiding your Power BI journey like the North Star** ⭐

**Power BI Studio Builder**
**Arquitectura Completa + Agentes + Frontend + Backend**
**Powered by Claude Code**
