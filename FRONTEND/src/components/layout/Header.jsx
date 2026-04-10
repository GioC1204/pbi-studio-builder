import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const Header = ({ projectName }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  return (
    <header className="bg-white border-b border-surface-100 px-6 h-13 flex items-center justify-between sticky top-0 z-30">
      {/* Left: logo + breadcrumb */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none"
        onClick={() => navigate('/')}
      >
        <span className="text-brand-400 font-bold text-lg leading-none">⭐</span>
        <span className="font-semibold text-surface-900 text-sm">PBI Studio</span>
        {projectName && (
          <>
            <span className="text-surface-200 text-sm">/</span>
            <span className="text-surface-500 text-sm truncate max-w-[180px]">{projectName}</span>
          </>
        )}
      </div>

      {/* Right: user */}
      {user && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-surface-400 hidden sm:block">{user.email}</span>
          <div className="w-px h-4 bg-surface-100" />
          <button
            onClick={logout}
            className="btn-ghost text-xs py-1 px-2"
          >
            Salir
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
