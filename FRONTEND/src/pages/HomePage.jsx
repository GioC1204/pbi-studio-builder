import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import api from '../services/api';

const FEATURES = [
  {
    color: '#F2C811', bg: 'linear-gradient(135deg,#FEF3C7,#FDE68A)',
    title: 'Fuente de datos',
    desc: 'Importa CSV, Excel o JSON. El modelo detecta tablas y relaciones automáticamente.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
      </svg>
    ),
  },
  {
    color: '#3B82F6', bg: 'linear-gradient(135deg,#DBEAFE,#BFDBFE)',
    title: 'Tema visual',
    desc: 'Aplica tu paleta de colores, tipografía y logo corporativo en un clic.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125A1.64 1.64 0 0 1 14.441 17.5h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        <circle cx="7.5" cy="10" r="1" fill="currentColor"/><circle cx="10" cy="7" r="1" fill="currentColor"/>
        <circle cx="14" cy="7" r="1" fill="currentColor"/><circle cx="16.5" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    color: '#F2C811', bg: 'linear-gradient(135deg,#FEF3C7,#FDE68A)',
    title: 'Medidas DAX',
    desc: 'Define KPIs y el agente POLARIS genera las fórmulas DAX correctas.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    color: '#DC2626', bg: 'linear-gradient(135deg,#FEE2E2,#FECACA)',
    title: 'Seguridad RLS',
    desc: 'Configura roles de Row-Level Security sin escribir una línea de código.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    color: '#16A34A', bg: 'linear-gradient(135deg,#DCFCE7,#BBF7D0)',
    title: 'Documentación técnica',
    desc: 'Genera diccionario de datos, guía DAX, manual de usuario y más automáticamente.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    color: '#CA8A04', bg: 'linear-gradient(135deg,#FEF9C3,#FEF08A)',
    title: 'Listo para Desktop',
    desc: 'Descarga un .pbip que abre directamente en Power BI Desktop sin errores.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

const HomePage = () => {
  const navigate = useNavigate();

  const handleNewProject = async () => {
    try {
      const { data } = await api.post('/projects', { name: 'Nuevo Proyecto' });
      navigate(`/projects/${data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAFAFA' }}>
      <Header />

      {/* Hero — dark navy */}
      <section
        className="flex flex-col items-center justify-center text-center px-6 py-24"
        style={{ background: 'linear-gradient(150deg, #0F172A 0%, #080E1A 100%)' }}
      >
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-6"
          style={{ background: 'rgba(242,200,17,.15)', color: '#F2C811', border: '1px solid rgba(242,200,17,.25)' }}
        >
          ⭐ Powered by POLARIS Agent
        </div>

        <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
          Dashboards Power BI<br />
          <em className="not-italic" style={{ color: '#F2C811' }}>en minutos, no horas</em>
        </h1>

        <p className="text-lg max-w-xl mx-auto mb-10" style={{ color: '#94A3B8' }}>
          Completa 6 módulos guiados y obtén un archivo .pbip completamente funcional
          con documentación técnica incluida.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNewProject}
            className="px-6 py-3 rounded-lg font-bold text-sm transition-all hover:-translate-y-px"
            style={{ background: 'linear-gradient(90deg,#F2C811,#FCD34D)', color: '#09090B', boxShadow: '0 2px 12px rgba(242,200,17,.35)' }}
          >
            Crear proyecto →
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="px-6 py-3 rounded-lg font-semibold text-sm transition-colors"
            style={{ background: 'rgba(255,255,255,.08)', color: '#E2E8F0', border: '1px solid rgba(255,255,255,.12)' }}
          >
            Ver mis proyectos
          </button>
        </div>
      </section>

      {/* Features grid — light */}
      <section className="max-w-5xl mx-auto w-full px-6 py-20">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-400 mb-10">
          Qué incluye cada generación
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.bg, color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
