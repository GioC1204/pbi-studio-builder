import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import api from '../services/api';

const FEATURES = [
  {
    iconColor: '#F2C811',
    iconBg: '#FEF3C7',
    title: 'Fuente de datos',
    desc: 'Importa CSV, Excel o JSON. El modelo detecta tablas y relaciones automáticamente.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
        <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>
      </svg>
    ),
  },
  {
    iconColor: '#3B82F6',
    iconBg: '#DBEAFE',
    title: 'Tema visual',
    desc: 'Aplica tu paleta de colores, tipografía y logo corporativo en un clic.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125A1.64 1.64 0 0 1 14.441 17.5h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        <circle cx="7.5" cy="10" r="1" fill="currentColor"/>
        <circle cx="14" cy="7" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    iconColor: '#8B5CF6',
    iconBg: '#EDE9FE',
    title: 'Medidas DAX',
    desc: 'Define KPIs y el agente POLARIS genera las fórmulas DAX correctas.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    iconColor: '#EF4444',
    iconBg: '#FEE2E2',
    title: 'Seguridad RLS',
    desc: 'Configura roles de Row-Level Security sin escribir una línea de código.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <rect x="3" y="11" width="18" height="11" rx="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    iconColor: '#10B981',
    iconBg: '#D1FAE5',
    title: 'Documentación técnica',
    desc: 'Genera diccionario de datos, guía DAX, manual de usuario y más automáticamente.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
  },
  {
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    title: 'Listo para Desktop',
    desc: 'Descarga un .pbip que abre directamente en Power BI Desktop sin errores.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20 }}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

export default function HomePage() {
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
    <div style={{ minHeight: '100vh', background: '#FAFAFA', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Header />

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(160deg, #0F172A 0%, #0B1120 60%, #0F172A 100%)',
        padding: '80px 24px',
        textAlign: 'center',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(242, 200, 17, 0.12)',
          border: '1px solid rgba(242, 200, 17, 0.3)',
          borderRadius: 999, padding: '5px 14px',
          fontSize: 12, fontWeight: 600, color: '#F2C811',
          marginBottom: 24,
        }}>
          ⭐ Powered by POLARIS Agent
        </div>

        <h1 style={{ fontSize: 48, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, margin: '0 0 16px' }}>
          Dashboards Power BI<br />
          <span style={{ color: '#F2C811' }}>en minutos, no horas</span>
        </h1>

        <p style={{ fontSize: 17, color: '#94A3B8', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.65 }}>
          Completa 6 módulos guiados y obtén un archivo .pbip completamente funcional
          con documentación técnica incluida.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <button
            onClick={handleNewProject}
            style={{
              background: 'linear-gradient(90deg, #F2C811, #FCD34D)',
              color: '#09090B', fontWeight: 700, fontSize: 14,
              padding: '12px 28px', borderRadius: 10, border: 'none',
              cursor: 'pointer', boxShadow: '0 4px 16px rgba(242,200,17,.35)',
              transition: 'transform .15s, box-shadow .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(242,200,17,.45)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(242,200,17,.35)'; }}
          >
            Crear proyecto →
          </button>
          <button
            onClick={() => navigate('/projects')}
            style={{
              background: 'rgba(255,255,255,.07)', color: '#E2E8F0',
              fontWeight: 600, fontSize: 14,
              padding: '12px 24px', borderRadius: 10,
              border: '1px solid rgba(255,255,255,.13)', cursor: 'pointer',
              transition: 'background .15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; }}
          >
            Ver mis proyectos
          </button>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '64px 24px' }}>
        <p style={{
          textAlign: 'center', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: '#A1A1AA', marginBottom: 40,
        }}>
          Qué incluye cada generación
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{
                background: '#FFFFFF',
                borderRadius: 14,
                border: '1px solid #E4E4E7',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,.06)',
                transition: 'box-shadow .2s, transform .2s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.1)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,.06)'; e.currentTarget.style.transform = ''; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: f.iconBg, color: f.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#18181B', margin: '0 0 6px' }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: '#71717A', lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
