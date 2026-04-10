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
  const { project, saveModule } = useProject();
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

      {/* Preview */}
      <div
        className="rounded-xl p-6 mb-6 border"
        style={{ backgroundColor: theme.background_color, borderColor: theme.primary_color }}
      >
        <p className="text-xs text-gray-400 mb-2">Preview</p>
        <h3 style={{ color: theme.secondary_color, fontFamily: theme.font_family }} className="text-lg font-bold">
          Mi Dashboard
        </h3>
        <div className="flex gap-2 mt-3">
          <div style={{ backgroundColor: theme.primary_color }} className="h-6 w-24 rounded" />
          <div style={{ backgroundColor: theme.accent_color }} className="h-6 w-16 rounded" />
        </div>
      </div>

      <button
        onClick={() => saveModule(2, theme)}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2.5 rounded-lg text-sm"
      >
        Guardar y continuar →
      </button>
    </div>
  );
};

export default Module2Theme;
