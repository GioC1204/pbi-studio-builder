import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';

const DOCUMENTS = [
  {
    key: 'generate_data_dictionary',
    icon: '🗂️',
    label: 'Diccionario de Datos',
    desc: 'Tablas, columnas, tipos y descripciones de todo el modelo.',
  },
  {
    key: 'generate_measures_guide',
    icon: '📐',
    label: 'Guía de Medidas DAX',
    desc: 'Fórmulas, descripción y ejemplos de uso de cada medida.',
  },
  {
    key: 'generate_rls_docs',
    icon: '🔒',
    label: 'Documentación de Seguridad',
    desc: 'Roles RLS, reglas de filtro y usuarios asignados.',
  },
  {
    key: 'generate_user_manual',
    icon: '📖',
    label: 'Manual de Usuario',
    desc: 'Guía de uso del dashboard para usuarios finales. No técnica.',
  },
  {
    key: 'generate_technical_spec',
    icon: '⚙️',
    label: 'Especificación Técnica',
    desc: 'Arquitectura del modelo, relaciones, supuestos y decisiones de diseño.',
  },
  {
    key: 'generate_deployment_guide',
    icon: '🚀',
    label: 'Guía de Despliegue',
    desc: 'Instrucciones para publicar en Power BI Service y configurar gateway.',
  },
];

const Module6Documentation = () => {
  const { project, saveModule } = useProject();
  const defaults = project?.modules?.[6]?.data || {};

  const [config, setConfig] = useState({
    generate_data_dictionary: defaults.generate_data_dictionary ?? true,
    generate_measures_guide: defaults.generate_measures_guide ?? true,
    generate_rls_docs: defaults.generate_rls_docs ?? false,
    generate_user_manual: defaults.generate_user_manual ?? false,
    generate_technical_spec: defaults.generate_technical_spec ?? true,
    generate_deployment_guide: defaults.generate_deployment_guide ?? false,
    language: defaults.language || 'es',
    company_name: defaults.company_name || '',
    author: defaults.author || '',
    version: defaults.version || '1.0',
  });

  const toggle = (key) => setConfig((prev) => ({ ...prev, [key]: !prev[key] }));
  const update = (key) => (e) => setConfig((prev) => ({ ...prev, [key]: e.target.value }));

  const selectedCount = DOCUMENTS.filter((d) => config[d.key]).length;

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Módulo 6 — Documentación Técnica</h2>
      <p className="text-sm text-gray-500 mb-6">
        Selecciona qué manuales se generarán junto con tu archivo .pbip.
      </p>

      {/* Document selector */}
      <div className="space-y-3 mb-6">
        {DOCUMENTS.map((doc) => (
          <label
            key={doc.key}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
              config[doc.key]
                ? 'border-yellow-400 bg-yellow-50'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <input
              type="checkbox"
              checked={config[doc.key]}
              onChange={() => toggle(doc.key)}
              className="mt-0.5 accent-yellow-400"
            />
            <div>
              <div className="flex items-center gap-2">
                <span>{doc.icon}</span>
                <span className="text-sm font-semibold text-gray-800">{doc.label}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{doc.desc}</p>
            </div>
          </label>
        ))}
      </div>

      {/* Metadata */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-700">Metadatos de la Documentación</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Idioma</label>
            <select
              value={config.language}
              onChange={update('language')}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Versión</label>
            <input
              value={config.version}
              onChange={update('version')}
              placeholder="1.0"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Empresa (opcional)</label>
            <input
              value={config.company_name}
              onChange={update('company_name')}
              placeholder="Nombre de tu empresa"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Autor (opcional)</label>
            <input
              value={config.author}
              onChange={update('author')}
              placeholder="Tu nombre"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Preview list */}
      {selectedCount > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">
            Se generarán {selectedCount} archivo(s) en /documentation/:
          </p>
          <ul className="space-y-1">
            {DOCUMENTS.filter((d) => config[d.key]).map((d) => (
              <li key={d.key} className="text-xs text-gray-600 flex items-center gap-2">
                <span className="text-green-500">✓</span>
                {d.label.toLowerCase().replace(/ /g, '_')}.md
              </li>
            ))}
            <li className="text-xs text-gray-400 flex items-center gap-2 mt-1">
              <span>+</span>
              changelog.md (siempre incluido)
            </li>
          </ul>
        </div>
      )}

      <button
        onClick={() => saveModule(6, config)}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2.5 rounded-lg text-sm"
      >
        Guardar y revisar →
      </button>
    </div>
  );
};

export default Module6Documentation;
