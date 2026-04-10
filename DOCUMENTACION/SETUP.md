# Setup — Power BI Studio Builder

## Requisitos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node.js | 18+ |
| PostgreSQL | 15+ |
| npm | 9+ |
| Python (opcional, pbi-cli) | 3.10+ |

---

## 1. Clonar el repositorio

```bash
git clone <repo-url>
cd "Power BI Studio Builder"
```

---

## 2. Configurar Backend

```bash
cd BACKEND
cp .env.example .env
# Edita .env con tu DATABASE_URL y JWT_SECRET

npm install
```

### Crear base de datos

```bash
psql -U postgres -c "CREATE DATABASE pbi_studio;"
psql -U postgres -d pbi_studio -f database/schema.sql
```

### Iniciar backend

```bash
npm run dev       # Con hot-reload (nodemon)
# o
npm start         # Producción
```

Backend disponible en `http://localhost:3000`

---

## 3. Configurar Frontend

```bash
cd FRONTEND
cp .env.example .env

npm install
npm run dev
```

Frontend disponible en `http://localhost:5173`

---

## 4. Con Docker (alternativa)

```bash
# En raíz del proyecto
docker-compose up --build
```

Servicios:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- PostgreSQL: `localhost:5432`

---

## 5. Verificar instalación

```bash
curl http://localhost:3000/health
# → { "status": "ok" }
```

---

## 6. Primer usuario

Registra tu cuenta en `http://localhost:5173/login` o via API:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"tu@email.com","password":"tuPassword","name":"Tu Nombre"}'
```

---

## Troubleshooting

Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
