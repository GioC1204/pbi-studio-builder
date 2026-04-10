import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../services/api';
import { BarChart2, TrendingUp, PieChart, Table, CreditCard, LayoutGrid, TrendingDown, Gauge, Calendar } from 'lucide-react';

const FORMATS = ['$ Moneda', '% Porcentaje', '# Número', 'Fecha'];

const VISUALS = [
  { type: 'bar',    Icon: BarChart2,    label: 'Barras' },
  { type: 'line',   Icon: TrendingUp,   label: 'Líneas' },
  { type: 'pie',    Icon: PieChart,     label: 'Torta' },
  { type: 'table',  Icon: Table,        label: 'Tabla' },
  { type: 'card',   Icon: CreditCard,   label: 'Tarjeta KPI' },
  { type: 'matrix', Icon: LayoutGrid,   label: 'Matriz' },
  { type: 'area',   Icon: TrendingDown, label: 'Área' },
  { type: 'gauge',  Icon: Gauge,        label: 'Gauge' },
];

const FILTER_OPTIONS = ['Fecha', 'Región', 'Categoría', 'Vendedor', 'Canal', 'Año'];

const AGGREGATIONS = [
  { value: 'SUM',    label: 'SUM — Suma total' },
  { value: 'AVG',    label: 'AVG — Promedio' },
  { value: 'COUNT',  label: 'COUNT — Conteo' },
  { value: 'COUNTD', label: 'COUNTD — Únicos' },
  { value: 'MAX',    label: 'MAX — Máximo' },
  { value: 'MIN',    label: 'MIN — Mínimo' },
  { value: 'DIVIDE', label: 'DIVIDE — Porcentaje del total' },
];

const LAYOUTS = [
  { id: 'executive', name: 'Executive', desc: '3 KPIs arriba + gráfico grande abajo', thumb: [{ type: 'row', fixed: true, blocks: [{ c: 'kpi' }, { c: 'kpi' }, { c: 'kpi' }] }, { type: 'row', blocks: [{ c: 'chart' }] }], bestFor: ['bar', 'line', 'area'] },
  { id: 'trend', name: 'Tendencia', desc: 'KPI a la izquierda + gráfico a la derecha', thumb: [{ type: 'row', blocks: [{ c: 'kpi', w: '30%' }, { c: 'chart' }] }], bestFor: ['line', 'area', 'bar'] },
  { id: 'overview', name: 'Overview', desc: '2 KPIs + 2 gráficos en cuadrícula', thumb: [{ type: 'row', fixed: true, blocks: [{ c: 'kpi' }, { c: 'kpi' }] }, { type: 'row', blocks: [{ c: 'chart' }, { c: 'chart' }] }], bestFor: ['bar', 'pie', 'gauge'] },
  { id: 'detail', name: 'Detalle', desc: 'KPI pequeño + tabla/matriz grande', thumb: [{ type: 'row', fixed: true, blocks: [{ c: 'kpi', w: '40%' }] }, { type: 'row', blocks: [{ c: 'table' }] }], bestFor: ['table', 'matrix'] },
  { id: 'split', name: 'Split 50/50', desc: 'Dos gráficos lado a lado', thumb: [{ type: 'row', blocks: [{ c: 'chart' }, { c: 'chart' }] }], bestFor: ['bar', 'pie', 'line'] },
  { id: 'fullchart', name: 'Full Chart', desc: 'KPIs compactos + gráfico ancho', thumb: [{ type: 'row', fixed: true, blocks: [{ c: 'kpi' }, { c: 'kpi' }, { c: 'kpi' }] }, { type: 'row', blocks: [{ c: 'chart' }] }], bestFor: ['bar', 'line', 'area', 'gauge'] },
];

const suggestLayout = (visualType) => {
  if (['table', 'matrix'].includes(visualType)) return 'detail';
  if (['line', 'area'].includes(visualType)) return 'trend';
  if (['pie'].includes(visualType)) return 'overview';
  return 'executive';
};

// Suggest aggregation based on column type
const suggestAggregation = (type) => {
  if (['decimal', 'integer'].includes(type)) return 'SUM';
  if (type === 'date') return 'COUNT';
  return 'COUNTD';
};

const SECTOR_LABELS = { retail: '🛍️ Retail', finanzas: '💰 Finanzas', logistica: '🚚 Logística' };
const SECTOR_KEYS = ['retail', 'finanzas', 'logistica'];

// Fuzzy match: find best column for a KPI template based on keywords
function fuzzyMatchColumn(keywords, availableColumns) {
  if (!keywords || keywords.length === 0 || availableColumns.length === 0) return null;
  let bestMatch = null;
  let bestScore = 0;
  availableColumns.forEach((col) => {
    const colNameLower = col.column.toLowerCase();
    let score = 0;
    keywords.forEach((kw) => {
      if (colNameLower.includes(kw.toLowerCase())) score += 2;
      else if (kw.toLowerCase().split('').every((ch) => colNameLower.includes(ch))) score += 1;
    });
    if (score > bestScore) { bestScore = score; bestMatch = col; }
  });
  return bestScore > 0 ? { column: bestMatch, confidence: bestScore >= 4 ? 'Alta' : bestScore >= 2 ? 'Media' : 'Baja' } : null;
}

// ── KPI Library Modal ─────────────────────────────
const KpiLibraryModal = ({ onClose, onAdd, availableColumns }) => {
  const [activeSector, setActiveSector] = useState('retail');
  const [templates, setTemplates] = useState({});
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    if (templates[activeSector]) return;
    setLoading(true);
    api.get(`/kpi-templates?sector=${activeSector}`)
      .then((res) => setTemplates((prev) => ({ ...prev, [activeSector]: res.data })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeSector]);

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    const allTemplates = Object.values(templates).flat();
    const chosen = allTemplates.filter((t) => selected.has(t.id));
    onAdd(chosen, availableColumns);
    onClose();
  };

  const currentTemplates = templates[activeSector] || [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <div>
            <h3 className="text-lg font-bold text-surface-900">Biblioteca de KPIs</h3>
            <p className="text-xs text-surface-500 mt-0.5">Selecciona plantillas para agregar a tu proyecto</p>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-700 text-2xl leading-none">×</button>
        </div>

        {/* Sector tabs */}
        <div className="flex border-b border-surface-200 px-6">
          {SECTOR_KEYS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSector(s)}
              className={`text-sm font-medium px-4 py-3 border-b-2 transition-colors ${activeSector === s ? 'border-brand-400 text-brand-600' : 'border-transparent text-surface-500 hover:text-surface-700'}`}
            >
              {SECTOR_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Templates grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center text-sm text-surface-400 py-8">Cargando plantillas...</div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {currentTemplates.map((t) => {
                const match = fuzzyMatchColumn(t.keywords, availableColumns);
                const isSelected = selected.has(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleSelect(t.id)}
                    className={`text-left p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-brand-400 bg-brand-50' : 'border-surface-100 bg-white hover:border-surface-300'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-surface-900">{t.name}</span>
                          <span className="text-2xs bg-surface-100 text-surface-500 px-1.5 py-px rounded font-medium">{t.format}</span>
                          {t.default_target && <span className="text-2xs text-surface-400">Meta: {t.default_target}</span>}
                        </div>
                        <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">{t.description_template}</p>
                        {match && (
                          <p className="text-2xs mt-1 text-brand-600 font-medium">
                            ✓ Campo sugerido: <span className="font-bold">{match.column.column}</span> en {match.column.table} — confianza {match.confidence}
                          </p>
                        )}
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${isSelected ? 'border-brand-400 bg-brand-400' : 'border-surface-300'}`}>
                        {isSelected && <span className="text-white text-xs font-bold">✓</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200">
          <span className="text-sm text-surface-500">{selected.size} KPI{selected.size !== 1 ? 's' : ''} seleccionado{selected.size !== 1 ? 's' : ''}</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary text-sm">Cancelar</button>
            <button onClick={handleAdd} disabled={selected.size === 0} className="btn-primary text-sm">
              Agregar {selected.size > 0 ? `${selected.size} KPI${selected.size !== 1 ? 's' : ''}` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Layout thumbnail ──────────────────────────────
const LayoutThumb = ({ layout, selected, suggested, onClick }) => {
  const colors = selected
    ? { kpi: '#FEF3C7', chart: 'rgba(242,200,17,0.5)', table: 'rgba(242,200,17,0.35)' }
    : { kpi: '#E4E4E7', chart: '#D4D4D8', table: '#D1D5DB' };
  return (
    <button onClick={onClick} className={`relative flex flex-col gap-1 p-2.5 rounded-xl border-2 transition-all ${selected ? 'border-brand-400 bg-brand-50' : 'border-surface-100 bg-white hover:border-surface-300'}`} style={{ minHeight: '72px' }}>
      {suggested && <span className="absolute -top-2 right-1 bg-brand-400 text-surface-950 text-2xs font-bold px-1.5 py-px rounded-full whitespace-nowrap">⭐ Recomendado</span>}
      <div className="flex flex-col gap-1 flex-1">
        {layout.thumb.map((row, i) => (
          <div key={i} className={`flex gap-1 ${row.fixed ? 'flex-none' : 'flex-1'}`} style={row.fixed ? { height: '14px' } : {}}>
            {row.blocks.map((b, j) => <div key={j} className="rounded-sm flex-1" style={{ background: colors[b.c], flexBasis: b.w || undefined, flexGrow: b.w ? 0 : 1 }} />)}
          </div>
        ))}
      </div>
      <p className={`text-2xs font-semibold text-center mt-1 ${selected ? 'text-brand-600' : 'text-surface-600'}`}>{layout.name}</p>
    </button>
  );
};

// ── Available Fields Panel ────────────────────────
const FieldsPanel = ({ availableColumns }) => {
  const [open, setOpen] = useState(false);
  if (availableColumns.length === 0) return null;

  const byTable = availableColumns.reduce((acc, col) => {
    if (!acc[col.table]) acc[col.table] = [];
    acc[col.table].push(col);
    return acc;
  }, {});

  const typeBadgeColor = { integer: 'text-blue-600', decimal: 'text-purple-600', date: 'text-green-600', text: 'text-gray-400' };

  return (
    <div className="mb-4 rounded-xl border border-surface-200 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-50 text-sm font-semibold text-surface-700 hover:bg-surface-100">
        <span>📋 Campos disponibles de tus datos</span>
        <span className="text-surface-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="p-3 flex flex-wrap gap-4">
          {Object.entries(byTable).map(([table, cols]) => (
            <div key={table}>
              <p className="text-xs font-semibold text-surface-600 mb-1">{table}</p>
              <div className="flex flex-wrap gap-1">
                {cols.map((col) => (
                  <span key={col.column} className="inline-flex items-center gap-1 bg-white border border-surface-200 rounded px-1.5 py-0.5 text-xs text-surface-700">
                    {col.column}
                    <span className={`text-2xs font-bold ${typeBadgeColor[col.type] || 'text-gray-400'}`}>{col.type.substring(0, 3).toUpperCase()}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── KPI Card ──────────────────────────────────────
const KpiCard = ({ kpi, kpiNames, availableColumns, onChange, onRemove }) => {
  const tableOptions = [...new Set(availableColumns.map((c) => c.table))];
  const columnOptions = availableColumns.filter((c) => c.table === kpi.source_table);

  const handleColumnChange = (colName) => {
    onChange('source_field', colName);
    const col = availableColumns.find((c) => c.table === kpi.source_table && c.column === colName);
    if (col) onChange('aggregation', suggestAggregation(col.type));
  };

  const daxPreview = kpi.source_field && kpi.aggregation && kpi.source_table
    ? `${kpi.aggregation}('${kpi.source_table}'[${kpi.source_field}])`
    : null;

  return (
    <div className="card p-4 mb-3">
      <div className="flex justify-between items-start mb-3">
        <label className="label mb-0">KPI #{kpi.id}</label>
        <button onClick={onRemove} className="text-xs text-surface-400 hover:text-error">Eliminar</button>
      </div>

      <div className="mb-3">
        <label className="label">Nombre del indicador</label>
        <input className="input" placeholder="Ej: Total de Ventas" value={kpi.name} onChange={e => onChange('name', e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="label">¿Qué quieres ver? <span className="text-surface-400 font-normal">en tus palabras</span></label>
        <textarea className="input resize-none" rows={2} placeholder="Ej: Quiero ver el total de ventas del período seleccionado, comparado con el mes anterior" value={kpi.description} onChange={e => onChange('description', e.target.value)} />
        <p className="text-2xs text-brand-600 mt-1 font-medium">✨ POLARIS generará el DAX automáticamente a partir de tu descripción</p>
      </div>

      {/* Field Selector */}
      {availableColumns.length > 0 && (
        <div className="mb-3 pt-3 border-t border-surface-100">
          <label className="label">Campo para el cálculo</label>
          <div className="flex gap-2 flex-wrap">
            {/* Table */}
            <select
              className="input"
              style={{ maxWidth: '160px' }}
              value={kpi.source_table || ''}
              onChange={e => { onChange('source_table', e.target.value); onChange('source_field', ''); onChange('aggregation', ''); }}
            >
              <option value="">Tabla...</option>
              {tableOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {/* Column */}
            <select
              className="input"
              style={{ maxWidth: '180px' }}
              value={kpi.source_field || ''}
              onChange={e => handleColumnChange(e.target.value)}
              disabled={!kpi.source_table}
            >
              <option value="">Campo...</option>
              {columnOptions.map(c => (
                <option key={c.column} value={c.column}>{c.column} ({c.type})</option>
              ))}
            </select>

            {/* Aggregation */}
            <select
              className="input"
              style={{ maxWidth: '200px' }}
              value={kpi.aggregation || ''}
              onChange={e => onChange('aggregation', e.target.value)}
              disabled={!kpi.source_field}
            >
              <option value="">Agregación...</option>
              {AGGREGATIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>

          {/* Live DAX preview */}
          {daxPreview && (
            <div className="mt-2 bg-surface-50 border border-surface-200 rounded-lg px-3 py-2">
              <p className="text-2xs text-surface-500 mb-0.5">Vista previa de la fórmula DAX</p>
              <code className="text-xs text-surface-800 font-mono">
                {kpi.name || 'KPI'} = <span className="text-brand-600">{daxPreview}</span>
              </code>
            </div>
          )}
        </div>
      )}

      <div className="mb-3">
        <label className="label">Formato del resultado</label>
        <div className="flex gap-1.5 flex-wrap">
          {FORMATS.map(f => (
            <button key={f} onClick={() => onChange('format', f)} className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${kpi.format === f ? 'bg-brand-50 border-brand-400 text-brand-600' : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Target (opcional)</label>
        <input className="input" style={{ maxWidth: '180px' }} placeholder="Ej: 1,000,000" value={kpi.target || ''} onChange={e => onChange('target', e.target.value)} />
      </div>
    </div>
  );
};

// ── Page Block ────────────────────────────────────
const PageBlock = ({ page, kpiNames, onChange, onRemove }) => {
  const [filterInput, setFilterInput] = useState('');
  const addFilter = () => { if (!filterInput || page.filters.includes(filterInput)) return; onChange('filters', [...page.filters, filterInput]); setFilterInput(''); };
  const removeFilter = (f) => onChange('filters', page.filters.filter(x => x !== f));

  return (
    <div className="border border-surface-200 rounded-xl mb-3 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-surface-50 border-b border-surface-100">
        <input className="font-semibold text-sm text-surface-900 bg-transparent border-none outline-none" value={page.name} onChange={e => onChange('name', e.target.value)} placeholder="Nombre de la página" />
        <button onClick={onRemove} className="text-surface-300 hover:text-surface-600 text-lg leading-none">×</button>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <label className="label">KPI principal de esta página</label>
          <select className="input" style={{ maxWidth: '260px' }} value={page.kpi_name || ''} onChange={e => onChange('kpi_name', e.target.value)}>
            <option value="">Seleccionar KPI...</option>
            {kpiNames.map(k => <option key={k}>{k}</option>)}
          </select>
        </div>

        <div className="mb-4">
          <label className="label">¿Cómo quieres visualizar los datos?</label>
          <div className="grid grid-cols-4 gap-2 mt-1">
            {VISUALS.map(v => (
              <button key={v.type} onClick={() => onChange('visual_type', v.type)} className={`flex flex-col items-center justify-center gap-1 py-2.5 px-1 rounded-xl border-2 transition-all ${page.visual_type === v.type ? 'border-brand-400 bg-brand-50' : 'border-surface-100 bg-white hover:border-surface-300'}`}>
                <v.Icon size={20} strokeWidth={1.75} />
                <span className={`text-2xs font-medium ${page.visual_type === v.type ? 'text-brand-600' : 'text-surface-500'}`}>{v.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Filtros disponibles en esta página</label>
          <div className="flex gap-1.5 flex-wrap mb-2">
            {page.filters.map(f => (
              <span key={f} className="inline-flex items-center gap-1.5 bg-surface-100 border border-surface-200 text-surface-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {f}
                <button onClick={() => removeFilter(f)} className="text-surface-400 hover:text-surface-700 leading-none">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <select className="input text-xs" style={{ maxWidth: '200px' }} value={filterInput} onChange={e => setFilterInput(e.target.value)}>
              <option value="">Agregar filtro...</option>
              {FILTER_OPTIONS.filter(f => !page.filters.includes(f)).map(f => <option key={f}>{f}</option>)}
            </select>
            <button onClick={addFilter} className="btn-secondary text-xs py-1.5 px-3 whitespace-nowrap">+ Agregar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────
const Module3Business = () => {
  const { project, saveModule } = useProject();
  const defaults = project?.modules?.[3]?.data || {};

  const [kpis, setKpis] = useState(defaults.kpis || []);
  const [pages, setPages] = useState(defaults.pages || []);
  const [nextId, setNextId] = useState(defaults.kpis?.length + 1 || 1);
  const [showLibrary, setShowLibrary] = useState(false);

  // Load schema from Module 1
  const availableColumns = useMemo(() => {
    const module1Data = project?.modules?.[1]?.data || {};
    return (module1Data.tables || []).flatMap((t) =>
      (t.columns || []).map((c) => ({ table: t.name, column: c.name, type: c.type }))
    );
  }, [project?.modules?.[1]?.data]);

  const addKpi = () => {
    setKpis(prev => [...prev, { id: nextId, name: '', description: '', format: '# Número', target: '', source_table: '', source_field: '', aggregation: '' }]);
    setNextId(n => n + 1);
  };

  const addFromTemplates = useCallback((templates, columns) => {
    let currentId = nextId;
    const newKpis = templates.map((t) => {
      const match = fuzzyMatchColumn(t.keywords, columns);
      return {
        id: currentId++,
        name: t.name,
        description: t.description_template,
        format: t.format,
        target: t.default_target ? String(t.default_target) : '',
        source_table: match?.column?.table || '',
        source_field: match?.column?.column || '',
        aggregation: t.aggregation || 'SUM',
      };
    });
    setKpis((prev) => [...prev, ...newKpis]);
    setNextId(currentId);
  }, [nextId]);

  const updateKpi = (id, field, val) => setKpis(prev => prev.map(k => k.id === id ? { ...k, [field]: val } : k));
  const removeKpi = (id) => setKpis(prev => prev.filter(k => k.id !== id));

  const addPage = () => setPages(prev => [...prev, { name: 'Nueva Página', kpi_name: '', visual_type: 'bar', filters: [] }]);
  const updatePage = (idx, field, val) => setPages(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p));
  const removePage = (idx) => setPages(prev => prev.filter((_, i) => i !== idx));

  const kpiNames = kpis.map(k => k.name).filter(Boolean);

  return (
    <div style={{ maxWidth: '660px' }}>
      {showLibrary && (
        <KpiLibraryModal
          onClose={() => setShowLibrary(false)}
          onAdd={addFromTemplates}
          availableColumns={availableColumns}
        />
      )}

      <div className="mb-6">
        <h2 className="text-xl font-bold text-surface-950">Módulo 3 — Lógica de Negocio</h2>
        <p className="text-sm text-surface-500 mt-1">Describe qué quieres medir y cómo visualizarlo. POLARIS genera el DAX automáticamente.</p>
      </div>

      {/* Available Fields Panel */}
      <FieldsPanel availableColumns={availableColumns} />

      {/* KPIs */}
      <div className="flex justify-between items-center mb-3">
        <p className="section-title">¿Qué quieres medir?</p>
        <div className="flex gap-2">
          <button onClick={() => setShowLibrary(true)} className="btn-secondary text-xs py-1 px-3">📚 Explorar plantillas</button>
          <button onClick={addKpi} className="btn-secondary text-xs py-1 px-3">+ Agregar KPI</button>
        </div>
      </div>

      {kpis.length === 0 && (
        <div className="card p-8 text-center mb-4">
          <p className="text-sm text-surface-400">Agrega tu primer KPI para comenzar.</p>
          <button onClick={addKpi} className="btn-primary mt-3 text-sm">+ Agregar KPI</button>
        </div>
      )}

      {kpis.map(kpi => (
        <KpiCard
          key={kpi.id}
          kpi={kpi}
          kpiNames={kpiNames}
          availableColumns={availableColumns}
          onChange={(f, v) => updateKpi(kpi.id, f, v)}
          onRemove={() => removeKpi(kpi.id)}
        />
      ))}

      {/* Pages */}
      <div className="flex justify-between items-center mt-6 mb-3">
        <p className="section-title">Páginas del Report</p>
        <button onClick={addPage} className="btn-secondary text-xs py-1 px-3">+ Agregar Página</button>
      </div>

      {pages.length === 0 && (
        <div className="card p-8 text-center mb-4">
          <p className="text-sm text-surface-400">Agrega tu primera página.</p>
          <button onClick={addPage} className="btn-primary mt-3 text-sm">+ Agregar Página</button>
        </div>
      )}

      {pages.map((page, idx) => (
        <PageBlock key={idx} page={page} kpiNames={kpiNames} onChange={(f, v) => updatePage(idx, f, v)} onRemove={() => removePage(idx)} />
      ))}

      <button
        onClick={() => saveModule(3, { kpis, pages })}
        disabled={kpis.length === 0 || pages.length === 0}
        className="btn-primary mt-4"
      >
        Guardar y continuar →
      </button>
    </div>
  );
};

export default Module3Business;
