const fs = require('fs');
const path = require('path');

const GENERATED_PATH = process.env.GENERATED_PROJECTS_PATH || '../GENERATED-PROJECTS';

/**
 * Main generation pipeline (NAVIGATOR orchestration).
 * @param {Object} project - Full project record with modules JSONB
 * @param {Function} emit - SSE callback: emit({ step, percent, message })
 */
exports.generate = async (project, emit) => {
  const projectDir = path.join(GENERATED_PATH, project.id);
  fs.mkdirSync(projectDir, { recursive: true });

  const config = buildConfig(project);

  emit({ step: 'semantic_model', percent: 10, message: 'Generando modelo semántico (TMDL)...' });
  await generateSemanticModel(config, projectDir);

  emit({ step: 'report', percent: 35, message: 'Creando páginas del report (PBIR)...' });
  await generateReport(config, projectDir);

  emit({ step: 'theme_security', percent: 55, message: 'Aplicando tema y seguridad RLS...' });
  await applyThemeAndSecurity(config, projectDir);

  emit({ step: 'pbip_ready', percent: 75, message: 'Generando archivo .pbip...' });
  await generatePbip(config, projectDir);
  await generateMetadata(config, projectDir);
  await generateAudit(config, projectDir);

  if (config.module6?.generate_data_dictionary ||
      config.module6?.generate_measures_guide ||
      config.module6?.generate_technical_spec ||
      config.module6?.generate_user_manual ||
      config.module6?.generate_rls_docs ||
      config.module6?.generate_deployment_guide) {
    emit({ step: 'documentation', percent: 88, message: 'Generando documentación técnica...' });
    await generateDocumentation(config, projectDir);
  }

  emit({ step: 'completed', percent: 100, message: '¡Dashboard listo para descargar!' });
};

function buildConfig(project) {
  const m = project.modules || {};
  const dashboardName = m[3]?.data?.dashboard_name || project.name || 'Nuevo Proyecto';
  // Sanitize name for use as file/folder name (no special chars)
  const safeName = dashboardName.replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'Dashboard';
  return {
    project_id: project.id,
    project_name: safeName,
    module1: m[1]?.data || {},
    module2: m[2]?.data || {},
    module3: m[3]?.data || {},
    module4: m[4]?.data || {},
    module6: m[6]?.data || {},
  };
}

// ---- Generation functions ----

function buildDaxFormula(kpi) {
  if (kpi.source_field && kpi.aggregation && kpi.source_table) {
    const col = `'${kpi.source_table}'[${kpi.source_field}]`;
    switch (kpi.aggregation) {
      case 'SUM':    return `SUM(${col})`;
      case 'AVG':    return `AVERAGE(${col})`;
      case 'COUNT':  return `COUNT(${col})`;
      case 'COUNTD': return `DISTINCTCOUNT(${col})`;
      case 'MAX':    return `MAX(${col})`;
      case 'MIN':    return `MIN(${col})`;
      case 'DIVIDE': return `DIVIDE(SUM(${col}), CALCULATE(SUM(${col}), ALL('${kpi.source_table}')))`;
      default:       return `SUM(${col})`;
    }
  }
  if (kpi.dax_formula) return kpi.dax_formula;
  return '0';
}

async function generateSemanticModel(config, dir) {
  const modelDir = path.join(dir, `${config.project_name}.SemanticModel`, 'definition');
  fs.mkdirSync(modelDir, { recursive: true });
  fs.mkdirSync(path.join(modelDir, 'tables'), { recursive: true });

  const tables = config.module1?.tables || [];
  const kpis = config.module3?.kpis || [];

  // Identify the fact table (first one marked as fact, or first table)
  const factTable = tables.find((t) => t.is_fact_table) || tables[0];

  // model.tmdl
  const culture = config.module6?.language === 'en' ? 'en-US' : 'es-ES';
  const modelTmdl = `model Model\n\tculture: ${culture}\n\tdataAccessOptions\n\t\tlegacyRedirects: true\n\t\treturnErrorValuesAsNull: true\n`;
  fs.writeFileSync(path.join(modelDir, 'model.tmdl'), modelTmdl);

  // One .tmdl per table
  for (const table of tables) {
    const columns = (table.columns || [])
      .map((c) => `\tcolumn ${c.name}\n\t\tdataType: ${mapType(c.type)}`)
      .join('\n');

    // Attach all measures to the fact table only
    let measuresBlock = '';
    if (factTable && table.name === factTable.name) {
      const measureLines = kpis
        .map((kpi) => {
          const formula = buildDaxFormula(kpi);
          const formatStr = kpi.format === '$ Moneda' ? '\n\t\tformatString: "$ #,0.00"'
            : kpi.format === '% Porcentaje' ? '\n\t\tformatString: "0.00%"'
            : kpi.format === '# Número' ? '\n\t\tformatString: "#,0"'
            : '';
          return `\tmeasure ${kpi.name} = ${formula}${formatStr}`;
        })
        .join('\n');
      measuresBlock = measureLines ? `\n${measureLines}` : '';
    }

    const tmdl = `table ${table.name}\n${columns}${measuresBlock}\n`;
    fs.writeFileSync(path.join(modelDir, 'tables', `${table.name}.tmdl`), tmdl);
  }
}

async function generateReport(config, dir) {
  const definitionDir = path.join(dir, `${config.project_name}.Report`, 'definition');
  fs.mkdirSync(definitionDir, { recursive: true });

  // report.json — required by Power BI Desktop to link report → semantic model
  const reportJson = {
    id: require('crypto').randomUUID(),
    themeCollection: {
      baseTheme: { name: 'CY24SU10', version: '5.65', type: 2 },
    },
    datasetReference: {
      byPath: { path: `../${config.project_name}.SemanticModel` },
    },
  };
  fs.writeFileSync(path.join(definitionDir, 'report.json'), JSON.stringify(reportJson, null, 2));

  const pagesDir = path.join(definitionDir, 'pages');
  fs.mkdirSync(pagesDir, { recursive: true });

  const kpis   = config.module3?.kpis   || [];
  const tables = config.module1?.tables || [];
  const factTable = tables.find((t) => t.is_fact_table) || tables[0];
  const catCol = factTable
    ? (factTable.columns || []).find((c) => ['text', 'string'].includes(c.type)) || factTable.columns?.[1] || { name: 'categoria' }
    : { name: 'categoria' };

  const pages = config.module4?.pages || config.module3?.pages || [
    { name: 'Resumen', layout: 'executive', chart_type: 'barChart' },
  ];

  for (const page of pages) {
    const safeName = page.name.replace(/[^a-zA-Z0-9]/g, '_');
    const pageDir  = path.join(pagesDir, safeName);
    fs.mkdirSync(pageDir, { recursive: true });

    // page.json — metadata only, no visuals array
    fs.writeFileSync(path.join(pageDir, 'page.json'), JSON.stringify({
      name: safeName,
      displayName: page.name,
      width: 1280,
      height: 720,
      background: {},
      wallpaper: {},
    }, null, 2));

    if (!factTable || kpis.length === 0) continue;

    // KPI card visuals (up to 3 across the top)
    const kpiCount = Math.min(kpis.length, 3);
    for (let i = 0; i < kpiCount; i++) {
      const kpi = kpis[i];
      const visual = {
        name: `kpi_card_${i}`,
        position: { x: 20 + i * 300, y: 20, z: 1000, height: 100, width: 280, tabOrder: i * 1000 },
        visual: {
          visualType: 'card',
          query: {
            queryState: {
              Values: {
                projections: [{
                  field: {
                    Measure: {
                      Expression: { SourceRef: { Entity: factTable.name } },
                      Property: kpi.name,
                    },
                  },
                  queryRef: `${factTable.name}.${kpi.name}`,
                }],
              },
            },
          },
          title: { show: true, text: kpi.name },
        },
      };
      fs.writeFileSync(path.join(pageDir, `kpi_card_${i}.json`), JSON.stringify(visual, null, 2));
    }

    // Main chart visual (bar chart below the KPI cards)
    const chartType = page.chart_type || 'barChart';
    const chart = {
      name: 'main_chart',
      position: { x: 20, y: 140, z: 1000, height: 540, width: 1240, tabOrder: 10000 },
      visual: {
        visualType: chartType,
        query: {
          queryState: {
            Category: {
              projections: [{
                field: {
                  Column: {
                    Expression: { SourceRef: { Entity: factTable.name } },
                    Property: catCol.name,
                  },
                },
                queryRef: `${factTable.name}.${catCol.name}`,
              }],
            },
            Y: {
              projections: kpis.map((kpi) => ({
                field: {
                  Measure: {
                    Expression: { SourceRef: { Entity: factTable.name } },
                    Property: kpi.name,
                  },
                },
                queryRef: `${factTable.name}.${kpi.name}`,
              })),
            },
          },
        },
        title: { show: true, text: page.name },
      },
    };
    fs.writeFileSync(path.join(pageDir, 'main_chart.json'), JSON.stringify(chart, null, 2));
  }
}

async function applyThemeAndSecurity(config, dir) {
  const theme = config.module2 || {};
  const themeJson = {
    name: config.project_name,
    dataColors: [theme.primary_color, theme.secondary_color, theme.accent_color].filter(Boolean),
    background: theme.background_color || '#FFFFFF',
    foreground: theme.secondary_color || '#1A1A2E',
    tableAccent: theme.primary_color || '#F2C811',
  };
  const themeDir = path.join(dir, `${config.project_name}.Report`, 'definition');
  fs.mkdirSync(themeDir, { recursive: true });
  fs.writeFileSync(path.join(themeDir, 'theme.json'), JSON.stringify(themeJson, null, 2));
}

async function generatePbip(config, dir) {
  const pbip = {
    version: '1.0',
    artifacts: [
      { report: { path: `${config.project_name}.Report` } },
      { semanticModel: { path: `${config.project_name}.SemanticModel` } },
    ],
  };
  fs.writeFileSync(
    path.join(dir, `${config.project_name}.pbip`),
    JSON.stringify(pbip, null, 2)
  );
}

async function generateMetadata(config, dir) {
  const tables = config.module1?.tables || [];
  const measures = config.module3?.kpis || [];
  fs.writeFileSync(
    path.join(dir, 'metadata.json'),
    JSON.stringify({ project: config.project_name, tables: tables.map((t) => t.name), measures: measures.map((m) => m.name), generated_at: new Date().toISOString() }, null, 2)
  );
}

async function generateAudit(config, dir) {
  const bpaValidator = require('./bpaValidatorService');
  const tables = config.module1?.tables || [];
  const kpis = config.module3?.kpis || [];

  const preViolations = bpaValidator.validateConfig(config);
  const postViolations = bpaValidator.validateModel(config);
  const allViolations = [...preViolations, ...postViolations];
  const bpaScore = bpaValidator.computeScore(allViolations);

  const warnings = allViolations.filter((v) => v.severity === 1).map((v) => v.message);
  const recommendations = allViolations.filter((v) => v.severity === 0).map((v) => v.message);
  if (tables.length === 0) recommendations.push('Considera agregar al menos una tabla de hechos.');

  const audit = {
    status: allViolations.some((v) => v.severity === 2) ? 'errors' : warnings.length > 0 ? 'warnings' : 'healthy',
    model_health: {
      tables: tables.length,
      measures: kpis.length,
      rls_enabled: config.module4?.rls_enabled || false,
    },
    bpa_score: bpaScore,
    bpa_violations: allViolations,
    bpa_passed: Math.max(0, 13 - allViolations.length),
    bpa_total: 13,
    warnings,
    recommendations,
    generated_at: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(dir, 'audit.json'), JSON.stringify(audit, null, 2));
}

// ---- Documentation generation (Module 6) ----

async function generateDocumentation(config, dir) {
  const docDir = path.join(dir, 'documentation');
  fs.mkdirSync(docDir, { recursive: true });

  const m6 = config.module6 || {};
  const lang = m6.language || 'es';
  const author = m6.author || 'N/A';
  const company = m6.company_name || 'N/A';
  const version = m6.version || '1.0';
  const tables = config.module1?.tables || [];
  const measures = config.module3?.kpis || [];
  const roles = config.module4?.roles || [];
  const pages = config.module4?.pages || config.module3?.pages || [];

  const header = (title) =>
    `# ${title}\n\n` +
    `**Proyecto:** ${config.project_name}  \n` +
    `**Versión:** ${version}  \n` +
    `**Autor:** ${author}  \n` +
    `**Empresa:** ${company}  \n` +
    `**Generado:** ${new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US')}  \n\n---\n\n`;

  if (m6.generate_data_dictionary) {
    let content = header(lang === 'es' ? 'Diccionario de Datos' : 'Data Dictionary');
    for (const table of tables) {
      content += `## ${table.name}\n\n`;
      content += `| Columna | Tipo | Descripción |\n|---------|------|-------------|\n`;
      for (const col of (table.columns || [])) {
        content += `| ${col.name} | ${col.type} | ${col.description || '-'} |\n`;
      }
      content += '\n';
    }
    fs.writeFileSync(path.join(docDir, 'data_dictionary.md'), content);
  }

  if (m6.generate_measures_guide) {
    let content = header(lang === 'es' ? 'Guía de Medidas DAX' : 'DAX Measures Guide');
    for (const kpi of measures) {
      content += `## ${kpi.name}\n\n`;
      content += `**Fórmula DAX:**\n\`\`\`dax\n${kpi.dax_formula}\n\`\`\`\n\n`;
      if (kpi.target) content += `**Target:** ${kpi.target}\n\n`;
      content += '---\n\n';
    }
    fs.writeFileSync(path.join(docDir, 'measures_guide.md'), content);
  }

  if (m6.generate_rls_docs && config.module4?.rls_enabled) {
    let content = header(lang === 'es' ? 'Documentación de Seguridad RLS' : 'RLS Security Documentation');
    for (const role of roles) {
      content += `## Rol: ${role.name}\n\n`;
      content += `- **Tabla:** \`${role.filter_table}\`\n`;
      content += `- **Filtro DAX:** \`${role.filter_expression}\`\n\n`;
    }
    fs.writeFileSync(path.join(docDir, 'rls_documentation.md'), content);
  }

  if (m6.generate_user_manual) {
    let content = header(lang === 'es' ? 'Manual de Usuario' : 'User Manual');
    content += `## Páginas del Dashboard\n\n`;
    for (const page of pages) {
      content += `### ${page.name}\n\n`;
      content += `Esta página contiene ${(page.visuals || []).length} visual(es).\n\n`;
    }
    fs.writeFileSync(path.join(docDir, 'user_manual.md'), content);
  }

  if (m6.generate_technical_spec) {
    let content = header(lang === 'es' ? 'Especificación Técnica' : 'Technical Specification');
    content += `## Modelo de Datos\n\n`;
    content += `- **Tablas:** ${tables.length}\n`;
    content += `- **Medidas DAX:** ${measures.length}\n`;
    content += `- **Páginas:** ${pages.length}\n`;
    content += `- **RLS Activo:** ${config.module4?.rls_enabled ? 'Sí' : 'No'}\n\n`;
    content += `## Tema Visual\n\n`;
    content += `- **Color Primario:** ${config.module2?.primary_color || 'N/A'}\n`;
    content += `- **Tipografía:** ${config.module2?.font_family || 'N/A'}\n\n`;
    fs.writeFileSync(path.join(docDir, 'technical_spec.md'), content);
  }

  if (m6.generate_deployment_guide) {
    let content = header(lang === 'es' ? 'Guía de Despliegue' : 'Deployment Guide');
    content += `## Pasos para Publicar en Power BI Service\n\n`;
    content += `1. Abre \`${config.project_name}.pbip\` en Power BI Desktop\n`;
    content += `2. Verifica que el modelo carga correctamente\n`;
    content += `3. Click en **Publicar** → selecciona tu workspace\n`;
    content += `4. Configura el gateway de datos si usas fuentes locales\n`;
    content += `5. Asigna usuarios a los roles RLS en Power BI Service\n\n`;
    fs.writeFileSync(path.join(docDir, 'deployment_guide.md'), content);
  }

  // Always generate changelog
  fs.writeFileSync(
    path.join(docDir, 'changelog.md'),
    `# Changelog\n\n## v${version} — ${new Date().toLocaleDateString()}\n\n- Generación inicial del modelo\n- ${tables.length} tabla(s), ${measures.length} medida(s)\n`
  );
}

function mapType(type) {
  const map = { integer: 'int64', text: 'string', decimal: 'decimal', boolean: 'boolean', date: 'dateTime' };
  return map[type] || 'string';
}
