import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../services/api';
import {
  Plus, BookOpen, ChevronDown, ChevronUp,
  Sparkles, FileText, Check
} from 'lucide-react';

const FORMATS = ['$ Moneda', '% Porcentaje', '# Número', 'Fecha'];

const AGGREGATIONS = [
  { value: 'SUM',    label: 'SUM — Suma total' },
  { value: 'AVG',    label: 'AVG — Promedio' },
  { value: 'COUNT',  label: 'COUNT — Conteo' },
  { value: 'COUNTD', label: 'COUNTD — Únicos' },
  { value: 'MAX',    label: 'MAX — Máximo' },
  { value: 'MIN',    label: 'MIN — Mínimo' },
  { value: 'DIVIDE', label: 'DIVIDE — % del total' },
];


const suggestAggregation = (type) => {
  if (['decimal', 'integer'].includes(type)) return 'SUM';
  if (type === 'date') return 'COUNT';
  return 'COUNTD';
};

const SECTOR_LABELS = { retail: '🛍️ Retail', finanzas: '💰 Finanzas', logistica: '🚚 Logística' };
const SECTOR_KEYS = ['retail', 'finanzas', 'logistica'];

function fuzzyMatchColumn(keywords, availableColumns) {
  if (!keywords || keywords.length === 0 || availableColumns.length === 0) return null;
  let bestMatch = null; let bestScore = 0;
  availableColumns.forEach((col) => {
    const colNameLower = col.column.toLowerCase(); let score = 0;
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
      .catch(() => {}).finally(() => setLoading(false));
  }, [activeSector]);

  const toggleSelect = (id) => setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const handleAdd = () => { const allTemplates = Object.values(templates).flat(); onAdd(allTemplates.filter((t) => selected.has(t.id)), availableColumns); onClose(); };
  const currentTemplates = templates[activeSector] || [];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200">
          <div>
            <h3 className="text-lg font-bold text-surface-900">Biblioteca de KPIs</h3>
            <p className="text-xs text-surface-500 mt-0.5">Selecciona plantillas para agregar</p>
          </div>
          <button onClick={onClose} className="text-surface-400 hover:text-surface-700 text-2xl leading-none">×</button>
        </div>
        <div className="flex border-b border-surface-200 px-6">
          {SECTOR_KEYS.map((s) => (
            <button key={s} onClick={() => setActiveSector(s)} className={`text-sm font-medium px-4 py-3 border-b-2 transition-colors ${activeSector === s ? 'border-brand-400 text-brand-600' : 'border-transparent text-surface-500 hover:text-surface-700'}`}>
              {SECTOR_LABELS[s]}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? <div className="text-center text-sm text-surface-400 py-8">Cargando plantillas...</div> : (
            <div className="grid grid-cols-1 gap-2">
              {currentTemplates.map((t) => {
                const match = fuzzyMatchColumn(t.keywords, availableColumns);
                const isSelected = selected.has(t.id);
                return (
                  <button key={t.id} onClick={() => toggleSelect(t.id)} className={`text-left p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-brand-400 bg-brand-50' : 'border-surface-100 bg-white hover:border-surface-300'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-surface-900">{t.name}</span>
                          <span className="text-2xs bg-surface-100 text-surface-500 px-1.5 py-px rounded font-medium">{t.format}</span>
                        </div>
                        <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">{t.description_template}</p>
                        {match && <p className="text-2xs mt-1 text-brand-600 font-medium flex items-center gap-1"><Check size={10} strokeWidth={3} />Campo: <span className="font-bold">{match.column.column}</span> — {match.confidence}</p>}
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${isSelected ? 'border-brand-400 bg-brand-400' : 'border-surface-300'}`}>
                        {isSelected && <Check size={11} strokeWidth={3} color="white" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-200">
          <span className="text-sm text-surface-500">{selected.size} KPI{selected.size !== 1 ? 's' : ''} seleccionado{selected.size !== 1 ? 's' : ''}</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary text-sm">Cancelar</button>
            <button onClick={handleAdd} disabled={selected.size === 0} className="btn-primary text-sm">Agregar {selected.size > 0 ? `${selected.size}` : ''}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Fields Panel ──────────────────────────────────
const FieldsPanel = ({ availableColumns }) => {
  const [open, setOpen] = useState(false);
  if (availableColumns.length === 0) return null;
  const byTable = availableColumns.reduce((acc, col) => { if (!acc[col.table]) acc[col.table] = []; acc[col.table].push(col); return acc; }, {});
  const typeBadgeColor = { integer: 'text-blue-600', decimal: 'text-purple-600', date: 'text-green-600', text: 'text-gray-400' };
  return (
    <div className="mb-4 rounded-xl border border-surface-200 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-2.5 bg-surface-50 text-sm font-semibold text-surface-700 hover:bg-surface-100">
        <span className="flex items-center gap-2"><FileText size={14} />Campos disponibles de tus datos</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="p-3 flex flex-wrap gap-4">
          {Object.entries(byTable).map(([table, cols]) => (
            <div key={table}>
              <p className="text-xs font-semibold text-surface-600 mb-1">{table}</p>
              <div className="flex flex-wrap gap-1">
                {cols.map((col) => (
                  <span key={col.column} className="inline-flex items-center gap-1 bg-white border border-surface-200 rounded px-1.5 py-0.5 text-xs text-surface-700">
                    {col.column}<span className={`text-2xs font-bold ${typeBadgeColor[col.type] || 'text-gray-400'}`}>{col.type.substring(0, 3).toUpperCase()}</span>
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
const KpiCard = ({ kpi, availableColumns, onChange, onRemove }) => {
  const tableOptions = [...new Set(availableColumns.map((c) => c.table))];
  const columnOptions = availableColumns.filter((c) => c.table === kpi.source_table);
  const handleColumnChange = (colName) => {
    onChange('source_field', colName);
    const col = availableColumns.find((c) => c.table === kpi.source_table && c.column === colName);
    if (col) onChange('aggregation', suggestAggregation(col.type));
  };
  const daxPreview = kpi.source_field && kpi.aggregation && kpi.source_table
    ? `${kpi.aggregation}('${kpi.source_table}'[${kpi.source_field}])` : null;

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
        <textarea className="input resize-none" rows={2} placeholder="Ej: Total de ventas del período, comparado con el mes anterior" value={kpi.description} onChange={e => onChange('description', e.target.value)} />
        <p className="text-2xs text-brand-600 mt-1 font-medium">✨ POLARIS generará el DAX automáticamente</p>
      </div>
      {availableColumns.length > 0 && (
        <div className="mb-3 pt-3 border-t border-surface-100">
          <label className="label">Campo para el cálculo</label>
          <div className="flex gap-2 flex-wrap">
            <select className="input" style={{ maxWidth: 160 }} value={kpi.source_table || ''} onChange={e => { onChange('source_table', e.target.value); onChange('source_field', ''); onChange('aggregation', ''); }}>
              <option value="">Tabla...</option>
              {tableOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="input" style={{ maxWidth: 180 }} value={kpi.source_field || ''} onChange={e => handleColumnChange(e.target.value)} disabled={!kpi.source_table}>
              <option value="">Campo...</option>
              {columnOptions.map(c => <option key={c.column} value={c.column}>{c.column} ({c.type})</option>)}
            </select>
            <select className="input" style={{ maxWidth: 200 }} value={kpi.aggregation || ''} onChange={e => onChange('aggregation', e.target.value)} disabled={!kpi.source_field}>
              <option value="">Agregación...</option>
              {AGGREGATIONS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          {daxPreview && (
            <div className="mt-2 bg-surface-50 border border-surface-200 rounded-lg px-3 py-2">
              <p className="text-2xs text-surface-500 mb-0.5">Vista previa DAX</p>
              <code className="text-xs text-surface-800 font-mono">{kpi.name || 'KPI'} = <span className="text-brand-600">{daxPreview}</span></code>
            </div>
          )}
        </div>
      )}
      <div className="mb-3">
        <label className="label">Formato</label>
        <div className="flex gap-1.5 flex-wrap">
          {FORMATS.map(f => (
            <button key={f} onClick={() => onChange('format', f)} className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${kpi.format === f ? 'bg-brand-50 border-brand-400 text-brand-600' : 'bg-white border-surface-200 text-surface-600 hover:border-surface-300'}`}>{f}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">Target (opcional)</label>
        <input className="input" style={{ maxWidth: 180 }} placeholder="Ej: 1,000,000" value={kpi.target || ''} onChange={e => onChange('target', e.target.value)} />
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────
const Module3Business = () => {
  const { project, saveModule, goBack } = useProject();
  const defaults = project?.modules?.[3]?.data || {};

  const [dashboardName, setDashboardName] = useState(defaults.dashboard_name || '');
  const [kpis, setKpis] = useState(defaults.kpis || []);
  const [nextId, setNextId] = useState(defaults.kpis?.length + 1 || 1);
  const [showLibrary, setShowLibrary] = useState(false);

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
      return { id: currentId++, name: t.name, description: t.description_template, format: t.format, target: t.default_target ? String(t.default_target) : '', source_table: match?.column?.table || '', source_field: match?.column?.column || '', aggregation: t.aggregation || 'SUM' };
    });
    setKpis((prev) => [...prev, ...newKpis]);
    setNextId(currentId);
  }, [nextId]);

  const updateKpi = (id, field, val) => setKpis(prev => prev.map(k => k.id === id ? { ...k, [field]: val } : k));
  const removeKpi = (id) => setKpis(prev => prev.filter(k => k.id !== id));


  return (
    <div style={{ maxWidth: 700 }}>
      {showLibrary && <KpiLibraryModal onClose={() => setShowLibrary(false)} onAdd={addFromTemplates} availableColumns={availableColumns} />}

      {/* Module header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-surface-950">Módulo 3 — Lógica de Negocio</h2>
        <p className="text-sm text-surface-500 mt-1">Define los KPIs e indicadores clave de tu reporte.</p>
      </div>

      {/* ── Dashboard Name ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        borderRadius: 14, padding: '18px 20px', marginBottom: 24,
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Sparkles size={14} color="#F2C811" />
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Nombre del tablero
          </span>
        </div>
        <input
          value={dashboardName}
          onChange={e => setDashboardName(e.target.value)}
          placeholder="Ej: Dashboard Comercial 2024 — Gerencia"
          style={{
            width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10, padding: '10px 14px', color: '#FFFFFF',
            fontSize: 16, fontWeight: 600, fontFamily: 'Inter, system-ui, sans-serif',
            outline: 'none', boxSizing: 'border-box',
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(242,200,17,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(242,200,17,0.1)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
        />
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>Este nombre aparecerá como título principal del reporte en Power BI.</p>
      </div>

      {/* ── KPIs ── */}
      <FieldsPanel availableColumns={availableColumns} />

      <div className="flex justify-between items-center mb-3">
        <p className="section-title">¿Qué quieres medir?</p>
        <div className="flex gap-2">
          <button onClick={() => setShowLibrary(true)} className="btn-secondary text-xs py-1 px-3 flex items-center gap-1.5"><BookOpen size={12} /> Plantillas</button>
          <button onClick={addKpi} className="btn-secondary text-xs py-1 px-3 flex items-center gap-1.5"><Plus size={12} /> KPI</button>
        </div>
      </div>

      {kpis.length === 0 && (
        <div className="card p-8 text-center mb-4">
          <p className="text-sm text-surface-400">Agrega tu primer KPI para comenzar.</p>
          <button onClick={addKpi} className="btn-primary mt-3 text-sm">+ Agregar KPI</button>
        </div>
      )}

      {kpis.map(kpi => (
        <KpiCard key={kpi.id} kpi={kpi} availableColumns={availableColumns}
          onChange={(f, v) => updateKpi(kpi.id, f, v)} onRemove={() => removeKpi(kpi.id)} />
      ))}

      <div className="flex items-center gap-3 mt-4">
        <button onClick={goBack} className="btn-secondary text-sm">
          ← Anterior
        </button>
        <button
          onClick={() => saveModule(3, { dashboard_name: dashboardName, kpis })}
          disabled={kpis.length === 0 || !dashboardName.trim()}
          className="btn-primary"
        >
          Guardar y continuar →
        </button>
      </div>
    </div>
  );
};

export default Module3Business;
