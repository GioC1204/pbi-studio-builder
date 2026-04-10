# Architecture — Power BI Studio Builder

## Overview

```
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
│  React + Vite + Tailwind CSS                        │
│  6 Modules → Context API → Axios → Backend API      │
└─────────────────────────┬───────────────────────────┘
                           │ HTTP / SSE
┌─────────────────────────▼───────────────────────────┐
│                   BACKEND (Node.js)                 │
│  Express REST API + JWT Auth + PostgreSQL           │
│  polarisService.js ← NAVIGATOR orchestration        │
└──────────┬──────────────────────────────────────────┘
           │ File system ops
┌──────────▼──────────────────────────────────────────┐
│              GENERATED-PROJECTS/                    │
│  [projectId]/                                       │
│    ├── [name].pbip                                  │
│    ├── [name].SemanticModel/ (TMDL)                 │
│    ├── [name].Report/ (PBIR)                        │
│    ├── metadata.json                                │
│    ├── audit.json                                   │
│    └── documentation/ ← Módulo 6                   │
└─────────────────────────────────────────────────────┘
```

## Layers

| Layer | Technology | Responsibility |
|-------|-----------|----------------|
| Frontend | React 18 + Vite + Tailwind | UI, form capture, progress tracking |
| Backend | Node.js + Express | API, auth, orchestration |
| Database | PostgreSQL | User data, project state, module configs |
| Generation | polarisService.js | TMDL/PBIR/PBIP file generation |
| Documentation | polarisService.js | Markdown manual generation (Module 6) |

## AI Agents

| Agent | File | Role |
|-------|------|------|
| POLARIS | AGENTES/POLARIS.md | Power BI generation spec |
| AURORA | AGENTES/AURORA.md | Frontend development spec |
| NAVIGATOR | AGENTES/NAVIGATOR.md | Orchestration logic |

## Key Decisions

- **JSONB for modules**: Flexible schema, easy to extend with new modules without migrations
- **SSE for progress**: Server-Sent Events over WebSockets for simplicity (unidirectional)
- **ZIP download**: All output files bundled in one download for ease of use
- **Module 6 post-generation**: Documentation generated last, after .pbip is ready, so it can reference actual generated content
