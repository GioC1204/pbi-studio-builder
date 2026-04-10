# Database Schema — Power BI Studio Builder

PostgreSQL 15+

---

## Diagrama ER

```
users
 └──< projects (user_id FK)
```

---

## Tabla: users

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | Identificador único |
| email | VARCHAR(255) UNIQUE | Email del usuario |
| password_hash | VARCHAR(255) | Contraseña hasheada (bcrypt) |
| name | VARCHAR(255) | Nombre completo |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Última actualización |

---

## Tabla: projects

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | UUID PK | Identificador único |
| user_id | UUID FK → users.id | Propietario |
| name | VARCHAR(255) | Nombre del proyecto |
| status | VARCHAR(50) | `draft` / `generating` / `completed` / `error` |
| modules | JSONB | Estado y datos de los 6 módulos |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Última actualización |

### Structure of `modules` JSONB:

```json
{
  "1": { "completed": true, "data": { ...module1_data } },
  "2": { "completed": true, "data": { ...module2_data } },
  "3": { "completed": false, "data": {} },
  "4": { "completed": false, "data": {} },
  "5": { "completed": false, "data": {} },
  "6": { "completed": true, "data": { ...module6_data } }
}
```

---

## Índices

```sql
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_updated ON projects(updated_at DESC);
```

---

## Schema SQL completo

Ver [../BACKEND/database/schema.sql](../BACKEND/database/schema.sql)
