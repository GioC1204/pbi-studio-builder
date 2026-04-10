import React from 'react';
import { Database, Palette, BarChart2, Shield, ClipboardCheck, BookOpen, Check, Layout } from 'lucide-react';

const STEPS = [
  { id: 1, short: 'Datos',     Icon: Database },
  { id: 2, short: 'Tema',      Icon: Palette },
  { id: 3, short: 'Negocio',   Icon: BarChart2 },
  { id: 4, short: 'Páginas',   Icon: Layout },
  { id: 5, short: 'Seguridad', Icon: Shield },
  { id: 6, short: 'Revisión',  Icon: ClipboardCheck },
  { id: 7, short: 'Docs',      Icon: BookOpen },
];

const ProgressBar = ({ current, modules }) => {
  const completedCount = Object.values(modules || {}).filter((m) => m.completed).length;
  const pct = Math.round((completedCount / 7) * 100);

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E4E4E7',
      borderRadius: 14,
      padding: '16px 20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)',
    }}>
      {/* Steps */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, marginBottom: 14 }}>
        {STEPS.map((step, idx) => {
          const completed = modules?.[step.id]?.completed;
          const active = current === step.id;
          const isLast = idx === STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                {/* Circle */}
                <div
                  className={active ? 'step-active-glow' : ''}
                  style={{
                    width: 28, height: 28,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: completed ? '#10B981' : active ? '#F2C811' : '#F4F4F5',
                    color: completed ? '#FFFFFF' : active ? '#09090B' : '#A1A1AA',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {completed
                    ? <Check size={12} strokeWidth={2.5} />
                    : <step.Icon size={12} strokeWidth={2} />
                  }
                </div>
                {/* Label */}
                <span style={{
                  fontSize: 11,
                  fontWeight: active ? 600 : 400,
                  color: active ? '#18181B' : '#A1A1AA',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease',
                }}>
                  {step.short}
                </span>
              </div>

              {!isLast && (
                <div style={{
                  flex: 1,
                  height: 2,
                  marginTop: 13,
                  background: modules?.[step.id]?.completed
                    ? 'linear-gradient(90deg, #F2C811, #3B82F6)'
                    : '#F4F4F5',
                  borderRadius: 2,
                  transition: 'background 0.4s ease',
                }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: '#71717A' }}>
          {completedCount} de 6 módulos completados
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#18181B' }}>{pct}%</span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: '#F4F4F5', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #F2C811 0%, #60A5FA 100%)',
          backgroundSize: '200% 100%',
          borderRadius: 4,
          transition: 'width 0.5s ease',
          animation: pct > 0 ? 'shimmer 3s linear infinite' : 'none',
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
