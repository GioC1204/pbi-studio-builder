# Troubleshooting — Power BI Studio Builder

## Backend no inicia

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:5432`  
**Fix:** PostgreSQL no está corriendo. `pg_ctl start` o inicia el servicio.

---

**Error:** `JWT_SECRET is not defined`  
**Fix:** Copia `.env.example` a `.env` y configura `JWT_SECRET`.

---

## Frontend no conecta al backend

**Síntoma:** Error 502 en peticiones API  
**Fix:** Verifica que backend corra en el puerto configurado en `VITE_API_URL` (default 3000).

---

## Generación falla

**Síntoma:** Status queda en `generating`  
**Fix:** Revisa los logs del backend. El error se guarda en `audit.json` del proyecto.

---

## Módulo 6 no genera documentación

**Síntoma:** Carpeta `/documentation` vacía  
**Fix:** Verifica que al menos un flag `generate_*` esté en `true` en los datos del Módulo 6.

---

## El .pbip no abre en Power BI Desktop

**Síntoma:** Error "invalid file format"  
**Fix:** Verifica que el archivo `[name].pbip` sea JSON válido. Revisa `audit.json` para errores de modelo.

---

## Error 401 en todas las peticiones

**Fix:** El token JWT expiró. Haz logout y vuelve a iniciar sesión.
