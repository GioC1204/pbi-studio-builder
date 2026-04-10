import React from 'react';
import { useProject } from '../../context/ProjectContext';

const MODULE_LIST = [
  { id: 1, icon: '🗄️', label: 'Fuente de Datos' },
  { id: 2, icon: '🎨', label: 'Tema Visual' },
  { id: 3, icon: '📊', label: 'Lógica de Negocio' },
  { id: 4, icon: '🔒', label: 'Seguridad' },
  { id: 5, icon: '✅', label: 'Revisión' },
  { id: 6, icon: '📚', label: 'Documentación' },
];

const Sidebar = () => {
  const { project, currentModule, setCurrentModule } = useProject();
  const modules = project?.modules || {};

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-surface-100 py-6 px-3 flex flex-col">
      <p className="section-title px-3 mb-3">Módulos</p>

      <nav className="space-y-0.5 flex-1">
        {MODULE_LIST.map((m) => {
          const completed = modules[m.id]?.completed;
          const active    = currentModule === m.id;

          return (
            <button
              key={m.id}
              onClick={() => setCurrentModule(m.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                active
                  ? 'bg-brand-50 text-surface-900 font-semibold'
                  : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
              }`}
            >
              {/* Step indicator */}
              <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold transition-colors ${
                completed
                  ? 'bg-success text-white'
                  : active
                    ? 'bg-brand-400 text-surface-950'
                    : 'bg-surface-100 text-surface-400 group-hover:bg-surface-200'
              }`}>
                {completed ? '✓' : m.id}
              </span>

              <span className="flex-1 text-left truncate">{m.label}</span>

              {/* Active dot */}
              {active && <span className="w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />}
            </button>
          );
        })}
      </nav>

      {/* Footer info */}
      {project && (
        <div className="px-3 pt-4 border-t border-surface-100">
          <p className="text-2xs text-surface-400 truncate" title={project.name}>
            {project.name}
          </p>
          <span className={`badge mt-1 ${
            project.status === 'completed' ? 'badge-success' :
            project.status === 'generating' ? 'badge-warning' :
            project.status === 'error' ? 'badge-error' : 'badge-neutral'
          }`}>
            {project.status === 'completed' ? 'Completado' :
             project.status === 'generating' ? 'Generando...' :
             project.status === 'error' ? 'Error' : 'Borrador'}
          </span>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
