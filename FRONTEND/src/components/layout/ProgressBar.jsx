import React from 'react';

const STEPS = [
  { id: 1, short: 'Datos' },
  { id: 2, short: 'Tema' },
  { id: 3, short: 'Negocio' },
  { id: 4, short: 'Seguridad' },
  { id: 5, short: 'Revisión' },
  { id: 6, short: 'Docs' },
];

const ProgressBar = ({ current, modules }) => {
  const completedCount = Object.values(modules || {}).filter((m) => m.completed).length;

  return (
    <div className="card p-4">
      {/* Step indicators */}
      <div className="flex items-center gap-1 mb-3">
        {STEPS.map((step, idx) => {
          const completed = modules?.[step.id]?.completed;
          const active    = current === step.id;
          const isLast    = idx === STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-2xs font-bold transition-all ${
                  completed
                    ? 'bg-success text-white'
                    : active
                      ? 'bg-brand-400 text-surface-950 shadow-focus'
                      : 'bg-surface-100 text-surface-400'
                }`}>
                  {completed ? '✓' : step.id}
                </div>
                <span className={`text-2xs hidden sm:block transition-colors ${
                  active ? 'text-surface-800 font-medium' : 'text-surface-400'
                }`}>
                  {step.short}
                </span>
              </div>
              {!isLast && (
                <div className={`flex-1 h-0.5 mb-4 rounded-full transition-colors ${
                  modules?.[step.id]?.completed ? 'bg-success' : 'bg-surface-100'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress text */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-surface-500">
          {completedCount} de 6 módulos completados
        </span>
        <span className="text-xs font-semibold text-surface-700">
          {Math.round((completedCount / 6) * 100)}%
        </span>
      </div>

      {/* Bar */}
      <div className="mt-2 h-1.5 bg-surface-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-400 rounded-full transition-all duration-500"
          style={{ width: `${Math.round((completedCount / 6) * 100)}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
