import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';

const FONTS = ['Inter', 'Segoe UI', 'Arial', 'Calibri', 'DM Sans'];

const ColorField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-14 rounded border border-gray-200 cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
      />
    </div>
  </div>
);

const Module2Theme = () => {
  const { project, saveModule, goBack } = useProject();
  const defaults = project?.modules?.[2]?.data || {};

  const [theme, setTheme] = useState({
    primary_color: defaults.primary_color || '#F2C811',
    secondary_color: defaults.secondary_color || '#1A1A2E',
    accent_color: defaults.accent_color || '#E74C3C',
    background_color: defaults.background_color || '#FFFFFF',
    font_family: defaults.font_family || 'Segoe UI',
    logo_path: defaults.logo_path || null,
  });

  const update = (key) => (val) => setTheme((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Módulo 2 — Tema Visual</h2>
      <p className="text-sm text-gray-500 mb-6">Define la identidad visual de tu dashboard.</p>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <ColorField label="Color Primario" value={theme.primary_color} onChange={update('primary_color')} />
          <ColorField label="Color Secundario" value={theme.secondary_color} onChange={update('secondary_color')} />
          <ColorField label="Color de Acento" value={theme.accent_color} onChange={update('accent_color')} />
          <ColorField label="Fondo" value={theme.background_color} onChange={update('background_color')} />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Tipografía</label>
          <select
            value={theme.font_family}
            onChange={(e) => update('font_family')(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
          >
            {FONTS.map((f) => <option key={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Logo (opcional)</label>
          <input type="file" accept="image/*" className="text-sm text-gray-500" />
        </div>
      </div>

      {/* Preview — mini dashboard mockup */}
      <div
        className="rounded-xl mb-6 border overflow-hidden"
        style={{ backgroundColor: theme.background_color, borderColor: theme.primary_color, fontFamily: theme.font_family }}
      >
        {/* Header bar */}
        <div style={{ backgroundColor: theme.secondary_color, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: theme.primary_color, fontWeight: 800, fontSize: 13 }}>Mi Dashboard</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1,2,3].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: `${theme.primary_color}60` }} />)}
          </div>
        </div>
        {/* KPI cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '12px 16px 8px' }}>
          {['Total Ventas', 'Clientes', 'Margen'].map((label, i) => (
            <div key={i} style={{ backgroundColor: theme.background_color, border: `1.5px solid ${theme.primary_color}30`, borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 9, color: theme.secondary_color, opacity: 0.6, fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: theme.secondary_color, marginTop: 2 }}>
                {i === 0 ? '$3.4M' : i === 1 ? '1,240' : '28%'}
              </div>
              <div style={{ width: '60%', height: 3, borderRadius: 2, backgroundColor: theme.primary_color, marginTop: 4 }} />
            </div>
          ))}
        </div>
        {/* Bar chart mock */}
        <div style={{ padding: '4px 16px 14px' }}>
          <div style={{ fontSize: 9, color: theme.secondary_color, opacity: 0.5, fontWeight: 700, marginBottom: 6 }}>INGRESOS POR PRODUCTO</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 48 }}>
            {[80, 45, 65, 30, 55, 70].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0',
                backgroundColor: i % 2 === 0 ? theme.primary_color : theme.accent_color,
                opacity: 0.85 }} />
            ))}
          </div>
          <div style={{ height: 1, backgroundColor: theme.secondary_color, opacity: 0.1, marginTop: 4 }} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 bg-white transition-colors"
        >
          ← Anterior
        </button>
        <button
          onClick={() => saveModule(2, theme)}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2.5 rounded-lg text-sm"
        >
          Guardar y continuar →
        </button>
      </div>
    </div>
  );
};

export default Module2Theme;
