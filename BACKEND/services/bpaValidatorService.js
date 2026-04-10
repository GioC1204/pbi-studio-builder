'use strict';

/**
 * BPA Validator Service
 * Implements a subset of Microsoft's Best Practice Analyzer rules
 * for Power BI / Analysis Services tabular models.
 *
 * Source: https://github.com/microsoft/Analysis-Services/blob/master/BestPracticeRules/BPARules.json
 *
 * Severity:
 *   2 = Error   → blocks generation
 *   1 = Warning → added to audit.json warnings
 *   0 = Info    → added to audit.json recommendations
 */

// ── Helpers ───────────────────────────────────────

const VALID_NAME_RE = /^[a-zA-ZÀ-ÿ0-9 _\-()\u00C0-\u024F]+$/;

function violation(ruleId, severity, message, object) {
  return { ruleId, severity, message, object: object || null };
}

// ── Pre-generation validation (runs on user config) ───

/**
 * Validate config extracted from project modules before generation starts.
 * @param {Object} config - { module1, module2, module3, module4, module6 }
 * @returns {Array} violations[]
 */
exports.validateConfig = (config) => {
  const violations = [];
  const tables = config.module1?.tables || [];
  const kpis = config.module3?.kpis || [];
  const relationships = config.module1?.relationships || [];

  // ── TRIM_OBJECT_NAMES ─────────────────────────────
  // Severity: Error — object names must not have leading/trailing spaces
  tables.forEach((t) => {
    if (typeof t.name === 'string' && t.name !== t.name.trim()) {
      violations.push(violation(
        'TRIM_OBJECT_NAMES', 2,
        `La tabla "${t.name}" tiene espacios al inicio o al final del nombre.`,
        t.name
      ));
    }
    (t.columns || []).forEach((c) => {
      if (typeof c.name === 'string' && c.name !== c.name.trim()) {
        violations.push(violation(
          'TRIM_OBJECT_NAMES', 2,
          `La columna "${c.name}" en tabla "${t.name}" tiene espacios al inicio o al final.`,
          `${t.name}.${c.name}`
        ));
      }
    });
  });
  kpis.forEach((k) => {
    if (typeof k.name === 'string' && k.name !== k.name.trim()) {
      violations.push(violation(
        'TRIM_OBJECT_NAMES', 2,
        `El KPI "${k.name}" tiene espacios al inicio o al final del nombre.`,
        k.name
      ));
    }
  });

  // ── SPECIAL_CHARS_IN_OBJECT_NAMES ─────────────────
  // Severity: Warning — avoid special characters in names
  tables.forEach((t) => {
    if (t.name && !VALID_NAME_RE.test(t.name)) {
      violations.push(violation(
        'SPECIAL_CHARS_IN_OBJECT_NAMES', 1,
        `La tabla "${t.name}" contiene caracteres especiales no recomendados.`,
        t.name
      ));
    }
  });

  // ── AVOID_DUPLICATE_MEASURES ──────────────────────
  // Severity: Error — no two KPIs should have the same name
  const kpiNamesLower = kpis.map((k) => (k.name || '').trim().toLowerCase());
  const seenNames = new Set();
  kpiNamesLower.forEach((name, i) => {
    if (!name) return;
    if (seenNames.has(name)) {
      violations.push(violation(
        'AVOID_DUPLICATE_MEASURES', 2,
        `KPI duplicado: "${kpis[i].name}". Cada medida debe tener un nombre único.`,
        kpis[i].name
      ));
    }
    seenNames.add(name);
  });

  // ── PROVIDE_FORMAT_STRING_FOR_MEASURES ────────────
  // Severity: Warning — all measures should have a format string
  kpis.forEach((k) => {
    if (!k.format) {
      violations.push(violation(
        'PROVIDE_FORMAT_STRING_FOR_MEASURES', 1,
        `El KPI "${k.name || `#${k.id}`}" no tiene formato definido. Selecciona Moneda, Porcentaje, Número o Fecha.`,
        k.name || `KPI #${k.id}`
      ));
    }
  });

  // ── RELATIONSHIP_COLUMNS_SAME_DATA_TYPE ───────────
  // Severity: Error — relationship columns must have matching data types
  const tableMap = Object.fromEntries(tables.map((t) => [t.name, t.columns || []]));
  relationships.forEach((r) => {
    const fromCols = tableMap[r.from_table] || [];
    const toCols = tableMap[r.to_table] || [];
    const fromCol = fromCols.find((c) => c.name === r.from_column);
    const toCol = toCols.find((c) => c.name === r.to_column);
    if (fromCol && toCol && fromCol.type !== toCol.type) {
      violations.push(violation(
        'RELATIONSHIP_COLUMNS_SAME_DATA_TYPE', 2,
        `Relación ${r.from_table}[${r.from_column}] (${fromCol.type}) ↔ ${r.to_table}[${r.to_column}] (${toCol.type}): los tipos no coinciden. Power BI puede rechazar este modelo.`,
        `${r.from_table}.${r.from_column}`
      ));
    }
  });

  // ── AVOID_FLOATING_POINT_DATA_TYPES ───────────────
  // Severity: Warning — prefer fixed decimal over floating point
  tables.forEach((t) => {
    (t.columns || []).forEach((c) => {
      if (c.type === 'decimal' && /float|double/i.test(c.name)) {
        violations.push(violation(
          'AVOID_FLOATING_POINT_DATA_TYPES', 1,
          `La columna "${c.name}" puede usar punto flotante. Considera tipo Decimal fijo para mayor precisión.`,
          `${t.name}.${c.name}`
        ));
      }
    });
  });

  // ── ENSURE_TABLES_HAVE_RELATIONSHIPS ─────────────
  // Severity: Info — tables with no relationships may be disconnected
  if (tables.length > 1 && relationships.length === 0) {
    violations.push(violation(
      'ENSURE_TABLES_HAVE_RELATIONSHIPS', 0,
      `Tienes ${tables.length} tablas pero ninguna relación definida. Considera relacionar las tablas para aprovechar el modelo dimensional.`,
      null
    ));
  }

  return violations;
};

// ── Post-generation validation (runs on generated config) ─

/**
 * Validate model structure after generation.
 * @param {Object} config - same config object used during generation
 * @returns {Array} violations[]
 */
exports.validateModel = (config) => {
  const violations = [];
  const tables = config.module1?.tables || [];
  const kpis = config.module3?.kpis || [];

  // ── MODEL_SHOULD_HAVE_DATE_TABLE ──────────────────
  // Severity: Warning — time intelligence requires a date table
  const hasDateTable = tables.some(
    (t) =>
      /fecha|date|calendar|calendario/i.test(t.name) ||
      (t.columns || []).some((c) => c.type === 'date' && !t.is_fact_table)
  );
  if (!hasDateTable && tables.length > 0) {
    violations.push(violation(
      'MODEL_SHOULD_HAVE_DATE_TABLE', 1,
      'Se recomienda una tabla de calendario/fechas para usar inteligencia temporal en DAX (YTD, MTD, comparaciones de períodos).',
      null
    ));
  }

  // ── HIDE_FACT_TABLE_COLUMNS ───────────────────────
  // Severity: Info — fact table columns should be hidden, only expose measures
  const factTables = tables.filter((t) => t.is_fact_table);
  if (factTables.length > 0) {
    violations.push(violation(
      'HIDE_FACT_TABLE_COLUMNS', 0,
      `Las columnas de ${factTables.map((t) => `"${t.name}"`).join(', ')} deberían ocultarse en el modelo. Solo las medidas deben ser visibles para el usuario final.`,
      factTables.map((t) => t.name).join(', ')
    ));
  }

  // ── REMOVE_AUTO-DATE_TABLE ────────────────────────
  // Severity: Info — auto date hierarchies add noise
  violations.push(violation(
    'REMOVE_AUTO_DATE_TABLE', 0,
    'Power BI genera jerarquías de fecha automáticas. Para mayor control, usa una tabla de fechas explícita y desactiva las automáticas en configuración del modelo.',
    null
  ));

  // ── AVOID_DUPLICATE_MEASURES (post check on DAX) ──
  // Severity: Error — two KPIs with identical formulas
  const formulas = kpis.map((k) => {
    const f = k.dax_formula || (k.source_field ? `${k.aggregation}('${k.source_table}'[${k.source_field}])` : null);
    return f ? f.replace(/\s/g, '').toLowerCase() : null;
  });
  const seenFormulas = new Set();
  formulas.forEach((f, i) => {
    if (!f) return;
    if (seenFormulas.has(f)) {
      violations.push(violation(
        'AVOID_DUPLICATE_MEASURES', 2,
        `El KPI "${kpis[i].name}" tiene la misma fórmula que otra medida. Considera consolidarlos.`,
        kpis[i].name
      ));
    }
    seenFormulas.add(f);
  });

  return violations;
};

/**
 * Compute a BPA quality score (0-100) from a list of violations.
 * Errors -10 each, Warnings -3 each, Info 0 impact.
 */
exports.computeScore = (violations) => {
  const deductions = violations.reduce((sum, v) => {
    if (v.severity === 2) return sum + 10;
    if (v.severity === 1) return sum + 3;
    return sum;
  }, 0);
  return Math.max(0, 100 - deductions);
};
