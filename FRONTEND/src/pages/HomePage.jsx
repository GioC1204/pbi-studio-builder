import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import api from '../services/api';
import { Database, Palette, BarChart2, Lock, BookOpen, Zap, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    iconColor: '#F2C811',
    iconBg: '#FEF3C7',
    title: 'Fuente de datos',
    desc: 'Importa CSV, Excel o JSON. El modelo detecta tablas y relaciones automáticamente.',
    Icon: Database,
  },
  {
    iconColor: '#3B82F6',
    iconBg: '#DBEAFE',
    title: 'Tema visual',
    desc: 'Aplica tu paleta de colores, tipografía y logo corporativo en un clic.',
    Icon: Palette,
  },
  {
    iconColor: '#8B5CF6',
    iconBg: '#EDE9FE',
    title: 'Medidas DAX',
    desc: 'Define KPIs y el agente POLARIS genera las fórmulas DAX correctas.',
    Icon: BarChart2,
  },
  {
    iconColor: '#EF4444',
    iconBg: '#FEE2E2',
    title: 'Seguridad RLS',
    desc: 'Configura roles de Row-Level Security sin escribir una línea de código.',
    Icon: Lock,
  },
  {
    iconColor: '#10B981',
    iconBg: '#D1FAE5',
    title: 'Documentación técnica',
    desc: 'Genera diccionario de datos, guía DAX, manual de usuario y más automáticamente.',
    Icon: BookOpen,
  },
  {
    iconColor: '#F59E0B',
    iconBg: '#FEF3C7',
    title: 'Listo para Desktop',
    desc: 'Descarga un .pbip que abre directamente en Power BI Desktop sin errores.',
    Icon: Zap,
  },
];

const STAGGER_CLASSES = [
  'animate-stagger-1', 'animate-stagger-2', 'animate-stagger-3',
  'animate-stagger-4', 'animate-stagger-5', 'animate-stagger-6',
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
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Radial glow backdrop */}
        <div style={{
          position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 700, height: 350, borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(242,200,17,0.07) 0%, rgba(59,130,246,0.05) 45%, transparent 70%)',
          filter: 'blur(48px)',
        }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(242, 200, 17, 0.12)',
          border: '1px solid rgba(242, 200, 17, 0.3)',
          borderRadius: 999, padding: '5px 14px',
          fontSize: 12, fontWeight: 600, color: '#F2C811',
          marginBottom: 24, position: 'relative',
        }}>
          <Sparkles size={12} />
          Powered by POLARIS Agent
        </div>

        <h1 style={{
          fontSize: 48, fontWeight: 800, color: '#FFFFFF',
          lineHeight: 1.15, margin: '0 0 16px',
          letterSpacing: '-0.025em', position: 'relative',
        }}>
          Dashboards Power BI<br />
          <span className="text-gradient-shimmer">en minutos, no horas</span>
        </h1>

        <p style={{
          fontSize: 17, color: '#94A3B8', maxWidth: 520,
          margin: '0 auto 36px', lineHeight: 1.65, position: 'relative',
        }}>
          Completa 6 módulos guiados y obtén un archivo .pbip completamente funcional
          con documentación técnica incluida.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, position: 'relative' }}>
          <button
            onClick={handleNewProject}
            className="btn-shimmer"
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
        <p className="section-title-accent" style={{ textAlign: 'center', marginBottom: 40 }}>
          Qué incluye cada generación
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`card-premium ${STAGGER_CLASSES[i]}`}
              style={{ padding: '20px', cursor: 'default' }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: f.iconBg, color: f.iconColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
                boxShadow: `inset 0 0 0 1px ${f.iconColor}20`,
              }}>
                <f.Icon size={20} strokeWidth={1.75} />
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
