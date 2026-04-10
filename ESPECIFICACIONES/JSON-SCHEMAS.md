# JSON Schemas — Power BI Studio Builder

Estructura de datos esperada para cada módulo al llamar `POST /projects/:id/modules/:num`.

---

## Módulo 1 — Data Source

```json
{
  "source_type": "csv",
  "tables": [
    {
      "name": "Sales",
      "is_fact_table": true,
      "columns": [
        { "name": "SaleID", "type": "integer", "description": "Identificador único" },
        { "name": "Amount", "type": "decimal", "description": "Monto de la venta" },
        { "name": "Date", "type": "date", "description": "Fecha de la venta" },
        { "name": "RegionID", "type": "integer", "description": "FK a Region" }
      ]
    },
    {
      "name": "Region",
      "is_fact_table": false,
      "columns": [
        { "name": "RegionID", "type": "integer", "description": "" },
        { "name": "RegionName", "type": "text", "description": "" }
      ]
    }
  ],
  "relationships": [
    { "from_table": "Sales", "from_column": "RegionID", "to_table": "Region", "to_column": "RegionID" }
  ]
}
```

---

## Módulo 2 — Theme

```json
{
  "primary_color": "#F2C811",
  "secondary_color": "#1A1A2E",
  "accent_color": "#E74C3C",
  "background_color": "#FFFFFF",
  "font_family": "Segoe UI",
  "logo_path": null
}
```

---

## Módulo 3 — Business Logic

El usuario describe los KPIs en **lenguaje natural**. POLARIS traduce automáticamente a DAX.

```json
{
  "kpis": [
    {
      "id": 1,
      "name": "Total de Ventas",
      "description": "Quiero ver el total acumulado de todas mis ventas en el período seleccionado",
      "format": "$ Moneda",
      "target": "1000000"
    },
    {
      "id": 2,
      "name": "Comparación vs Año Anterior",
      "description": "Quiero comparar las ventas actuales con el mismo período del año pasado y ver la diferencia en porcentaje",
      "format": "% Porcentaje",
      "target": null
    }
  ],
  "pages": [
    {
      "name": "Overview",
      "kpi_name": "Total de Ventas",
      "visual_type": "bar",
      "filters": ["Fecha", "Región"]
    },
    {
      "name": "Detalle por Región",
      "kpi_name": "Comparación vs Año Anterior",
      "visual_type": "table",
      "filters": ["Región"]
    }
  ]
}
```

**Tipos de visual disponibles:** `bar`, `line`, `pie`, `table`, `card`, `matrix`, `area`, `gauge`
```

---

## Módulo 4 — Security

```json
{
  "rls_enabled": true,
  "roles": [
    {
      "name": "RegionManager",
      "filter_table": "Region",
      "filter_expression": "[RegionName] = USERNAME()"
    }
  ]
}
```

---

## Módulo 5 — Review

```json
{
  "confirmed": true,
  "notes": "Revisado y aprobado"
}
```

---

## Módulo 6 — Documentation *(nuevo)*

```json
{
  "generate_data_dictionary": true,
  "generate_measures_guide": true,
  "generate_rls_docs": true,
  "generate_user_manual": false,
  "generate_technical_spec": true,
  "generate_deployment_guide": false,
  "language": "es",
  "company_name": "Acme Corp",
  "author": "Tu nombre",
  "version": "1.0"
}
```

**Entregables del Módulo 6:**

| Flag | Archivo generado |
|------|-----------------|
| `generate_data_dictionary` | `documentation/data_dictionary.md` |
| `generate_measures_guide` | `documentation/measures_guide.md` |
| `generate_rls_docs` | `documentation/rls_documentation.md` |
| `generate_user_manual` | `documentation/user_manual.md` |
| `generate_technical_spec` | `documentation/technical_spec.md` |
| `generate_deployment_guide` | `documentation/deployment_guide.md` |
| *(siempre)* | `documentation/changelog.md` |
