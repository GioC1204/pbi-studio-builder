import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { BarChart2, ChevronRight, LogOut } from 'lucide-react';

const Header = ({ projectName }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      boxShadow: 'inset 0 -1px 0 rgba(242,200,17,0.12)',
      padding: '0 24px',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      zIndex: 30,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}
        onClick={() => navigate('/')}
      >
        <BarChart2 size={16} color="#F2C811" strokeWidth={2} />
        <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 14, letterSpacing: '-0.01em' }}>PBI Studio</span>
        {projectName && (
          <>
            <ChevronRight size={14} color="rgba(255,255,255,0.25)" />
            <span style={{
              color: 'rgba(255,255,255,0.55)', fontSize: 14,
              maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              transition: 'color 0.2s ease',
            }}>
              {projectName}
            </span>
          </>
        )}
      </div>

      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{user.email}</span>
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
          <button
            onClick={logout}
            className="btn-ghost"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
              fontSize: 12, color: 'rgba(255,255,255,0.45)',
              padding: '4px 8px', borderRadius: 6,
              fontFamily: 'inherit',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
          >
            <LogOut size={13} />
            Salir
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
