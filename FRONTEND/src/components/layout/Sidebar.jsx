import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Database, Palette, BarChart2, Shield, ClipboardCheck, BookOpen, Check } from 'lucide-react';

const MODULE_LIST = [
  { id: 1, label: 'Fuente de Datos',   Icon: Database },
  { id: 2, label: 'Tema Visual',        Icon: Palette },
  { id: 3, label: 'Lógica de Negocio', Icon: BarChart2 },
  { id: 4, label: 'Seguridad',          Icon: Shield },
  { id: 5, label: 'Revisión',           Icon: ClipboardCheck },
  { id: 6, label: 'Documentación',      Icon: BookOpen },
];

const Sidebar = () => {
  const { project, currentModule, setCurrentModule } = useProject();
  const modules = project?.modules || {};

  return (
    <aside style={{
      width: 200,
      flexShrink: 0,
      background: 'linear-gradient(180deg, #0F172A 0%, #0B111E 100%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      fontFamily: 'Inter, system-ui, sans-serif',
      overflowY: 'auto',
    }}>
      <p className="section-title-accent" style={{ padding: '0 8px', marginBottom: 14 }}>
        Módulos
      </p>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {MODULE_LIST.map((m) => {
          const completed = modules[m.id]?.completed;
          const active = currentModule === m.id;

          return (
            <button
              key={m.id}
              onClick={() => setCurrentModule(m.id)}
              className={active ? 'sidebar-item-active' : ''}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: active ? '8px 10px 8px 8px' : '8px 10px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                background: active ? undefined : 'transparent',
                textAlign: 'left',
                fontFamily: 'inherit',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Badge */}
              <span style={{
                flexShrink: 0,
                width: 22, height: 22,
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
                background: completed
                  ? '#10B981'
                  : active
                  ? 'linear-gradient(135deg, #F2C811, #FCD34D)'
                  : 'rgba(255,255,255,0.08)',
                color: completed ? '#FFFFFF' : active ? '#0F172A' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.2s ease',
              }}>
                {completed ? <Check size={11} /> : m.id}
              </span>

              {/* Icon */}
              <span style={{
                flexShrink: 0,
                color: active ? '#F2C811' : completed ? '#10B981' : 'rgba(255,255,255,0.35)',
                display: 'flex', alignItems: 'center',
                transition: 'color 0.2s ease',
              }}>
                <m.Icon size={16} strokeWidth={1.75} />
              </span>

              {/* Label */}
              <span style={{
                flex: 1,
                fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? '#F2C811' : completed ? '#E2E8F0' : 'rgba(255,255,255,0.45)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                transition: 'color 0.2s ease',
              }}>
                {m.label}
              </span>

              {/* Active dot */}
              {active && (
                <span style={{
                  flexShrink: 0,
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#F2C811',
                  boxShadow: '0 0 4px rgba(242,200,17,0.6)',
                }} />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
