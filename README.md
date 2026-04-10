# Power BI Studio Builder

AI-powered platform for generating complete Power BI dashboards (.pbip) from a conversational web interface.

## What It Does

Users fill 6 modules through a React web app → Backend orchestrates AI agents → Generates a fully functional `.pbip` file + technical documentation.

## The 6 Modules

| Module | Description |
|--------|-------------|
| 1. Data Source | Upload files, define tables and schema |
| 2. Theme | Colors, fonts, logo, visual style |
| 3. Business Logic | KPIs, pages, visuals, DAX measures |
| 4. Security | Row-Level Security (RLS) roles and rules |
| 5. Review | Final confirmation before generation |
| 6. Documentation | Configure technical manuals to generate |

## Output

Each generation produces:
- `[ProjectName].pbip` — Fully functional Power BI file
- `metadata.json` — Model references
- `audit.json` — Diagnostics and health check
- `documentation/` — Technical manuals (configured in Module 6)
  - `data_dictionary.md`
  - `measures_guide.md`
  - `rls_documentation.md`
  - `user_manual.md`
  - `technical_spec.md`

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express + PostgreSQL
- **Agents:** POLARIS (BI) + AURORA (Frontend) + NAVIGATOR (Orchestrator)
- **Integration:** pbi-cli + Microsoft Power BI MCP Server

## Quick Start

See [DOCUMENTACION/SETUP.md](DOCUMENTACION/SETUP.md)

---

**POLARIS — Guiding your Power BI journey like the North Star** ⭐  
Power BI Studio Builder
