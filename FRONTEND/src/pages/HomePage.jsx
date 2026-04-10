import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import api from '../services/api';

const FEATURES = [
  { icon: '🗄️', title: 'Fuente de datos',       desc: 'Importa CSV, Excel o JSON. El modelo detecta tablas y relaciones automáticamente.' },
  { icon: '🎨', title: 'Tema visual',             desc: 'Aplica tu paleta de colores, tipografía y logo corporativo en un clic.' },
  { icon: '📐', title: 'Medidas DAX',             desc: 'Define KPIs y el agente POLARIS genera las fórmulas DAX correctas.' },
  { icon: '🔒', title: 'Seguridad RLS',           desc: 'Configura roles de Row-Level Security sin escribir una línea de código.' },
  { icon: '📚', title: 'Documentación técnica',   desc: 'Genera diccionario de datos, guía DAX, manual de usuario y más automáticamente.' },
  { icon: '⚡', title: 'Listo para Desktop',      desc: 'Descarga un .pbip que abre directamente en Power BI Desktop sin errores.' },
];

const HomePage = () => {
  const navigate = useNavigate();

  const handleNewProject = async () => {
    const { data } = await api.post('/projects', { name: 'Nuevo Proyecto' });
    navigate(`/projects/${data.id}`);
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <Header />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-600 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          ⭐ Powered by POLARIS Agent
        </div>

        <h1 className="text-5xl font-bold text-surface-950 tracking-tight mb-4 leading-tight">
          Dashboards Power BI<br />
          <span className="text-brand-500">en minutos, no horas</span>
        </h1>

        <p className="text-lg text-surface-500 max-w-xl mx-auto mb-10">
          Completa 6 módulos guiados y obtén un archivo .pbip completamente funcional
          con documentación técnica incluida.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button onClick={handleNewProject} className="btn-primary px-6 py-3 text-base shadow-elevated">
            Crear proyecto →
          </button>
          <button onClick={() => navigate('/projects')} className="btn-secondary px-6 py-3 text-base">
            Ver mis proyectos
          </button>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <p className="section-title text-center mb-8">Qué incluye cada generación</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-5 animate-fade-in">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold text-surface-900 mb-1">{f.title}</h3>
              <p className="text-xs text-surface-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Output preview */}
      <section className="max-w-3xl mx-auto px-6 pb-24">
        <div className="card p-6">
          <p className="section-title mb-4">Output por proyecto</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { file: '[nombre].pbip',          desc: 'Archivo Power BI funcional',   badge: 'Principal' },
              { file: 'metadata.json',           desc: 'Referencias del modelo',        badge: '' },
              { file: 'audit.json',              desc: 'Diagnóstico y salud',            badge: '' },
              { file: 'documentation/',          desc: 'Manuales técnicos (Módulo 6)',   badge: 'Nuevo' },
            ].map((o) => (
              <div key={o.file} className="flex items-start gap-3 p-3 bg-surface-50 rounded-lg border border-surface-100">
                <span className="text-surface-400 text-xs mt-0.5">📄</span>
                <div>
                  <p className="text-xs font-mono font-medium text-surface-800">{o.file}</p>
                  <p className="text-2xs text-surface-400 mt-0.5">{o.desc}</p>
                </div>
                {o.badge && <span className="ml-auto badge-brand">{o.badge}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
