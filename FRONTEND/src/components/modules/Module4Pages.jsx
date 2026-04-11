import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import {
  BarChart2, TrendingUp, PieChart, Table, CreditCard, LayoutGrid,
  TrendingDown, Gauge, Plus, X, Layout, BarChart, Check, Star,
  Filter, Layers,
} from 'lucide-react';

const VISUALS = [
  { type: 'bar',    Icon: BarChart2,    label: 'Barras' },
  { type: 'line',   Icon: TrendingUp,   label: 'Líneas' },
  { type: 'pie',    Icon: PieChart,     label: 'Torta' },
  { type: 'table',  Icon: Table,        label: 'Tabla' },
  { type: 'card',   Icon: CreditCard,   label: 'KPI Card' },
  { type: 'matrix', Icon: LayoutGrid,   label: 'Matriz' },
  { type: 'area',   Icon: TrendingDown, label: 'Área' },
  { type: 'gauge',  Icon: Gauge,        label: 'Gauge' },
];

const LAYOUTS = [
  { id: 'executive', name: 'Executive',   desc: '3 KPIs + gráfico principal',      thumb: [{ fixed: true, blocks: [{ c: 'kpi' }, { c: 'kpi' }, { c: 'kpi' }] }, { blocks: [{ c: 'chart' }] }] },
  { id: 'trend',     name: 'Tendencia',   desc: 'KPI lateral + gráfico ancho',     thumb: [{ blocks: [{ c: 'kpi', w: '30%' }, { c: 'chart' }] }] },
  { id: 'overview',  name: 'Overview',    desc: '2 KPIs + 2 gráficos',             thumb: [{ fixed: true, blocks: [{ c: 'kpi' }, { c: 'kpi' }] }, { blocks: [{ c: 'chart' }, { c: 'chart' }] }] },
  { id: 'detail',    name: 'Detalle',     desc: 'KPI compacto + tabla grande',     thumb: [{ fixed: true, blocks: [{ c: 'kpi', w: '40%' }] }, { blocks: [{ c: 'table' }] }] },
  { id: 'split',     name: 'Split 50/50', desc: 'Dos gráficos lado a lado',        thumb: [{ blocks: [{ c: 'chart' }, { c: 'chart' }] }] },
  { id: 'fullchart', name: 'Full Chart',  desc: 'KPIs compactos + gráfico ancho',  thumb: [{ fixed: true, blocks: [{ c: 'kpi' }, { c: 'kpi' }, { c: 'kpi' }] }, { blocks: [{ c: 'chart' }] }] },
];

// FILTER_OPTIONS is now derived dynamically from model columns in the component

const PAGE_TEMPLATES = [
  { id: 'resumen',     label: 'Resumen Ejecutivo',  desc: 'KPIs + gráfico de barras',     Icon: BarChart,   visual_type: 'bar',   layout: 'executive', filters: [] },
  { id: 'tendencia',   label: 'Análisis Tendencia', desc: 'Serie de tiempo + tendencias', Icon: TrendingUp, visual_type: 'line',  layout: 'trend',     filters: [] },
  { id: 'detalle',     label: 'Detalle Operativo',  desc: 'Tabla detallada con filtros',  Icon: Table,      visual_type: 'table', layout: 'detail',    filters: [] },
  { id: 'comparativo', label: 'Comparativo',        desc: 'Distribución y comparación',   Icon: PieChart,   visual_type: 'pie',   layout: 'overview',  filters: [] },
];

const suggestLayout = (visualType) => {
  if (['table', 'matrix'].includes(visualType)) return 'detail';
  if (['line', 'area'].includes(visualType)) return 'trend';
  if (['pie'].includes(visualType)) return 'overview';
  return 'executive';
};

// ── Layout Thumbnail ───────────────────────────────
const LayoutThumb = ({ layout, selected, suggested, onClick }) => {
  const colors = selected
    ? { kpi: '#FEF3C7', chart: 'rgba(242,200,17,0.5)', table: 'rgba(242,200,17,0.35)' }
    : { kpi: '#E4E4E7', chart: '#D4D4D8', table: '#D1D5DB' };
  return (
    <button
      onClick={onClick}
      style={{
        position: 'relative', display: 'flex', flexDirection: 'column', gap: 3,
        padding: 8, borderRadius: 10, minHeight: 60,
        border: selected ? '2px solid #F2C811' : '2px solid #E4E4E7',
        background: selected ? 'rgba(242,200,17,0.04)' : '#FFFFFF',
        cursor: 'pointer', transition: 'all 0.15s ease',
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = '#D4D4D8'; } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = '#E4E4E7'; } }}
    >
      {suggested && (
        <span style={{
          position: 'absolute', top: -8, right: 4,
          background: '#F2C811', color: '#09090B',
          fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 20,
          display: 'flex', alignItems: 'center', gap: 2,
        }}>
          <Star size={8} fill="currentColor" strokeWidth={0} />Sugerido
        </span>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {layout.thumb.map((row, i) => (
          <div key={i} style={{ display: 'flex', gap: 2, flex: row.fixed ? 'none' : 1, height: row.fixed ? 10 : undefined }}>
            {row.blocks.map((b, j) => (
              <div key={j} style={{
                borderRadius: 3, flex: b.w ? 'none' : 1, flexBasis: b.w,
                background: colors[b.c],
              }} />
            ))}
          </div>
        ))}
      </div>
      <p style={{ fontSize: 9, fontWeight: 700, textAlign: 'center', margin: 0, color: selected ? '#B45309' : '#71717A' }}>
        {layout.name}
      </p>
    </button>
  );
};

// ── Page List Item ─────────────────────────────────
const PageListItem = ({ page, index, active, onClick, onRemove }) => {
  const Visual = VISUALS.find(v => v.type === page.visual_type)?.Icon || BarChart2;
  const layoutName = LAYOUTS.find(l => l.id === page.layout)?.name || '—';

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
        marginBottom: 4, transition: 'all 0.15s ease',
        background: active ? 'rgba(242,200,17,0.06)' : 'transparent',
        borderLeft: active ? '3px solid #F2C811' : '3px solid transparent',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
    >
      {/* Page number */}
      <div style={{
        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
        background: active ? 'linear-gradient(135deg, #F2C811, #FCD34D)' : 'rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 800, color: active ? '#0F172A' : 'rgba(255,255,255,0.4)',
      }}>
        {index + 1}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: active ? '#F2C811' : 'rgba(255,255,255,0.75)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {page.name || `Página ${index + 1}`}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <Visual size={9} color="rgba(255,255,255,0.3)" />
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{layoutName}</span>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={e => { e.stopPropagation(); onRemove(); }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4,
          color: '#F87171', display: 'flex', padding: 2, borderRadius: 4, transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = 1; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = 0.4; }}
      >
        <X size={12} />
      </button>
    </div>
  );
};

// ── Page Editor (right panel) ─────────────────────
const PageEditor = ({ page, onChange, kpiOptions, filterOptions = [] }) => {
  const suggestedLayoutId = suggestLayout(page.visual_type);
  const selectedLayout = LAYOUTS.find(l => l.id === page.layout);

  const toggleKpi = (name) => {
    const current = page.kpi_names || [];
    onChange('kpi_names', current.includes(name) ? current.filter(k => k !== name) : [...current, name]);
  };

  const toggleFilter = (f) => {
    const current = page.filters || [];
    onChange('filters', current.includes(f) ? current.filter(x => x !== f) : [...current, f]);
  };

  const SectionHeader = ({ label, gradient }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
      <div style={{ width: 3, height: 14, background: gradient, borderRadius: 2 }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: '#52525B', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </span>
    </div>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
      {/* Page name */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
          Nombre de la página
        </label>
        <input
          value={page.name}
          onChange={e => onChange('name', e.target.value)}
          placeholder="Ej: Dashboard Ejecutivo"
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#FAFAFA', border: '1.5px solid #E4E4E7',
            borderRadius: 10, padding: '10px 14px',
            fontSize: 15, fontWeight: 700, color: '#0F172A',
            fontFamily: 'Inter, system-ui, sans-serif', outline: 'none',
          }}
          onFocus={e => { e.target.style.borderColor = '#F2C811'; e.target.style.background = '#FFFBEB'; }}
          onBlur={e => { e.target.style.borderColor = '#E4E4E7'; e.target.style.background = '#FAFAFA'; }}
        />
      </div>

      {/* Layout */}
      <div style={{ marginBottom: 24 }}>
        <SectionHeader label="Layout de página" gradient="linear-gradient(180deg, #F2C811, #3B82F6)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {LAYOUTS.map(l => (
            <LayoutThumb
              key={l.id}
              layout={l}
              selected={page.layout === l.id}
              suggested={l.id === suggestedLayoutId && !page.layout}
              onClick={() => onChange('layout', l.id)}
            />
          ))}
        </div>
        {selectedLayout && (
          <p style={{ fontSize: 11, color: '#71717A', marginTop: 6 }}>
            <span style={{ fontWeight: 700, color: '#3B82F6' }}>{selectedLayout.name}:</span>{' '}
            {selectedLayout.desc}
          </p>
        )}
      </div>

      {/* Chart type */}
      <div style={{ marginBottom: 24 }}>
        <SectionHeader label="Tipo de gráfico" gradient="linear-gradient(180deg, #3B82F6, #8B5CF6)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {VISUALS.map(v => {
            const active = page.visual_type === v.type;
            return (
              <button
                key={v.type}
                onClick={() => { onChange('visual_type', v.type); onChange('layout', suggestLayout(v.type)); }}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 6, padding: '10px 4px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
                  background: active ? '#0F172A' : '#FFFFFF',
                  color: active ? '#F2C811' : '#A1A1AA',
                  boxShadow: active
                    ? '0 4px 12px rgba(15,23,42,0.25)'
                    : '0 1px 3px rgba(0,0,0,0.06), inset 0 0 0 1px #E4E4E7',
                }}
              >
                <v.Icon size={18} strokeWidth={1.75} />
                <span style={{ fontSize: 10, fontWeight: 600 }}>{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPIs */}
      <div style={{ marginBottom: 24 }}>
        <SectionHeader label="KPIs en esta página" gradient="linear-gradient(180deg, #10B981, #3B82F6)" />
        {kpiOptions.length === 0 ? (
          <p style={{ fontSize: 12, color: '#A1A1AA', fontStyle: 'italic' }}>
            Define KPIs en el Módulo 3 para asignarlos aquí.
          </p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {kpiOptions.map(name => {
              const active = (page.kpi_names || []).includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleKpi(name)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 8, border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 12, fontWeight: 600, transition: 'all 0.15s ease',
                    background: active ? 'linear-gradient(135deg, #F2C811, #FCD34D)' : '#FFFFFF',
                    color: active ? '#0F172A' : '#71717A',
                    boxShadow: active
                      ? '0 2px 8px rgba(242,200,17,0.35)'
                      : '0 1px 3px rgba(0,0,0,0.08), inset 0 0 0 1px #E4E4E7',
                  }}
                >
                  {active && <Check size={10} strokeWidth={3} />}
                  {name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Filters */}
      <div>
        <SectionHeader label="Filtros disponibles" gradient="linear-gradient(180deg, #F59E0B, #EF4444)" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {filterOptions.map(f => {
            const active = (page.filters || []).includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 20, border: 'none',
                  cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 11, fontWeight: 600, transition: 'all 0.15s ease',
                  background: active ? 'rgba(242,200,17,0.15)' : '#F4F4F5',
                  color: active ? '#92400E' : '#71717A',
                  boxShadow: active ? 'inset 0 0 0 1.5px #F2C811' : 'inset 0 0 0 1px #E4E4E7',
                }}
              >
                <Filter size={9} strokeWidth={2.5} />
                {f}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ── Empty State ────────────────────────────────────
const EmptyState = ({ onAddTemplate, onAddBlank }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
    <div style={{
      width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #F2C811, #FCD34D)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    }}>
      <Layers size={24} color="#0F172A" strokeWidth={2} />
    </div>
    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: '0 0 6px' }}>
      Sin páginas aún
    </h3>
    <p style={{ fontSize: 13, color: '#71717A', margin: '0 0 28px', textAlign: 'center', maxWidth: 320 }}>
      Crea páginas para organizar los KPIs y visualizaciones de tu reporte.
    </p>

    <p style={{ fontSize: 11, color: '#A1A1AA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
      Plantillas rápidas
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, width: '100%', maxWidth: 520 }}>
      {PAGE_TEMPLATES.map(t => {
        const Visual = VISUALS.find(v => v.type === t.visual_type)?.Icon;
        const layoutName = LAYOUTS.find(l => l.id === t.layout)?.name;
        return (
          <button
            key={t.id}
            onClick={() => onAddTemplate(t)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#FFFFFF', border: '1.5px solid #E4E4E7',
              borderRadius: 12, padding: '12px 16px', cursor: 'pointer',
              fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#F2C811'; e.currentTarget.style.boxShadow = '0 0 0 1px #F2C811, 0 4px 12px rgba(242,200,17,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4E4E7'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 9, flexShrink: 0,
              background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <t.Icon size={18} color="#F2C811" strokeWidth={1.75} />
            </div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#18181B', margin: 0 }}>{t.label}</p>
              <p style={{ fontSize: 10, color: '#A1A1AA', margin: '2px 0 0' }}>
                {Visual && <Visual size={9} style={{ display: 'inline', marginRight: 3 }} />}
                {VISUALS.find(v => v.type === t.visual_type)?.label} · {layoutName}
              </p>
            </div>
          </button>
        );
      })}
    </div>

    <button
      onClick={onAddBlank}
      style={{
        marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'transparent', border: '1.5px dashed #D4D4D8', borderRadius: 10,
        padding: '8px 20px', fontSize: 12, fontWeight: 600, color: '#A1A1AA',
        cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#71717A'; e.currentTarget.style.color = '#52525B'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#D4D4D8'; e.currentTarget.style.color = '#A1A1AA'; }}
    >
      <Plus size={13} /> Página en blanco
    </button>
  </div>
);

// ── Main Component ─────────────────────────────────
const Module4Pages = () => {
  const { project, saveModule, goBack } = useProject();
  const defaults = project?.modules?.[4]?.data || {};
  const kpiOptions = (project?.modules?.[3]?.data?.kpis || []).map(k => k.name).filter(Boolean);

  // Build filter options from actual model columns (Module 1 data)
  const filterOptions = React.useMemo(() => {
    const tables = project?.modules?.[1]?.data?.tables || [];
    const cols = tables.flatMap(t => t.columns || []).map(c => c.name).filter(Boolean);
    return cols.length > 0 ? cols : ['Fecha', 'Región', 'Categoría', 'Vendedor'];
  }, [project?.modules?.[1]?.data?.tables]);

  const [pages, setPages] = useState(defaults.pages || []);
  const [activePage, setActivePage] = useState(0);

  const addPage = (template = null) => {
    const newPage = template
      ? { name: template.label, visual_type: template.visual_type, layout: template.layout, filters: template.filters, kpi_names: [] }
      : { name: `Página ${pages.length + 1}`, visual_type: 'bar', layout: 'executive', filters: [], kpi_names: [] };
    setPages(prev => { const updated = [...prev, newPage]; setActivePage(updated.length - 1); return updated; });
  };

  const updatePage = (idx, field, val) =>
    setPages(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p));

  const removePage = (idx) => {
    setPages(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      setActivePage(i => Math.min(i, Math.max(0, updated.length - 1)));
      return updated;
    });
  };

  const currentPage = pages[activePage];
  const canSave = pages.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Module header ── */}
      <div style={{ padding: '0 0 20px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          Módulo 4 — Páginas del Reporte
        </h2>
        <p style={{ fontSize: 13, color: '#71717A', margin: 0 }}>
          Diseña cada página: asigna KPIs, elige el gráfico y el layout.
        </p>
      </div>

      {/* ── Two-panel layout ── */}
      <div style={{
        display: 'flex', flex: 1, borderRadius: 16, overflow: 'hidden',
        border: '1px solid #E4E4E7',
        boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        minHeight: 540,
      }}>

        {/* LEFT PANEL — page list */}
        <div style={{
          width: 220, flexShrink: 0,
          background: 'linear-gradient(180deg, #0F172A 0%, #0B111E 100%)',
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Panel header */}
          <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Layout size={13} color="rgba(255,255,255,0.4)" />
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Páginas
                </span>
              </div>
              {pages.length > 0 && (
                <span style={{ background: 'rgba(242,200,17,0.15)', color: '#F2C811', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20 }}>
                  {pages.length}
                </span>
              )}
            </div>
          </div>

          {/* Page list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
            {pages.map((page, idx) => (
              <PageListItem
                key={idx}
                page={page}
                index={idx}
                active={activePage === idx}
                onClick={() => setActivePage(idx)}
                onRemove={() => removePage(idx)}
              />
            ))}
          </div>

          {/* Add button */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => addPage()}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: 'rgba(242,200,17,0.1)', border: '1px solid rgba(242,200,17,0.2)',
                borderRadius: 8, padding: '8px', cursor: 'pointer',
                fontSize: 11, fontWeight: 700, color: '#F2C811',
                fontFamily: 'inherit', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(242,200,17,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(242,200,17,0.1)'; }}
            >
              <Plus size={12} /> Nueva página
            </button>
          </div>
        </div>

        {/* RIGHT PANEL — editor or empty state */}
        <div style={{ flex: 1, background: '#FFFFFF', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          {pages.length === 0 ? (
            <EmptyState onAddTemplate={addPage} onAddBlank={() => addPage()} />
          ) : currentPage ? (
            <PageEditor
              key={activePage}
              page={currentPage}
              onChange={(f, v) => updatePage(activePage, f, v)}
              kpiOptions={kpiOptions}
              filterOptions={filterOptions}
            />
          ) : null}
        </div>
      </div>

      {/* Nav buttons */}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={goBack}
          style={{
            background: '#FFFFFF', border: '1.5px solid #E4E4E7', borderRadius: 10,
            padding: '10px 18px', fontSize: 13, fontWeight: 600, color: '#71717A',
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#A1A1AA'; e.currentTarget.style.color = '#18181B'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#E4E4E7'; e.currentTarget.style.color = '#71717A'; }}
        >
          ← Anterior
        </button>
        <button
          onClick={() => saveModule(4, { pages })}
          disabled={!canSave}
          style={{
            background: canSave ? 'linear-gradient(135deg, #F2C811, #FCD34D)' : '#E4E4E7',
            color: canSave ? '#09090B' : '#A1A1AA',
            border: 'none', borderRadius: 10, padding: '10px 22px',
            fontSize: 14, fontWeight: 700, cursor: canSave ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit', transition: 'all 0.15s',
            boxShadow: canSave ? '0 2px 12px rgba(242,200,17,0.35)' : 'none',
          }}
        >
          Guardar y continuar →
        </button>
      </div>
    </div>
  );
};

export default Module4Pages;
