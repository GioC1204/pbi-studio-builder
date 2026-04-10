# API Specification — Power BI Studio Builder

Base URL: `http://localhost:3000`

---

## Auth

### POST /auth/register
**Body:** `{ email, password, name }`  
**Response:** `{ user: { id, email, name }, token }`

### POST /auth/login
**Body:** `{ email, password }`  
**Response:** `{ user: { id, email, name }, token }`

### GET /auth/me
**Headers:** `Authorization: Bearer <token>`  
**Response:** `{ id, email, name, created_at }`

---

## Projects

All project routes require `Authorization: Bearer <token>`.

### GET /projects
**Response:** `[ { id, name, status, created_at, updated_at } ]`

### POST /projects
**Body:** `{ name }`  
**Response:** `{ id, name, status: "draft", modules: {...} }`

### GET /projects/:id
**Response:** Full project object with modules JSONB

### PATCH /projects/:id
**Body:** `{ name }`  
**Response:** Updated project

### DELETE /projects/:id
**Response:** 204 No Content

---

## Modules

### POST /projects/:projectId/modules/:moduleNum
Save module data (moduleNum: 1–6)  
**Body:** `{ data: { ...module_specific_data } }`  
**Response:** Updated full project object (module marked completed: true)

### GET /projects/:projectId/modules/:moduleNum
**Response:** `{ completed: boolean, data: {...} }`

---

## Generation

### POST /projects/:id/generate
Start generation pipeline. All modules 1–4 and 6 must be complete.  
**Response:** `{ message: "Generación iniciada", project_id }`

### GET /projects/:id/status
**Response:** `{ id, status: "draft|generating|completed|error", updated_at }`

### GET /projects/:id/status/stream
Server-Sent Events stream.  
**Events:**
```
data: { "step": "semantic_model", "percent": 10, "message": "Generando modelo semántico..." }
data: { "step": "report", "percent": 35, "message": "Creando páginas..." }
data: { "step": "theme_security", "percent": 55, "message": "Aplicando tema y seguridad..." }
data: { "step": "pbip_ready", "percent": 75, "message": "Generando .pbip..." }
data: { "step": "documentation", "percent": 88, "message": "Generando documentación técnica..." }
data: { "step": "completed", "percent": 100, "message": "¡Dashboard listo!" }
```

### GET /projects/:id/download
Returns ZIP file containing all generated files (`.pbip` + documentation).  
**Response:** `application/zip`

---

## Health

### GET /health
**Response:** `{ status: "ok" }`
