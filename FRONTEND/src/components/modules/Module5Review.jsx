import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../services/api';

const STEPS = [
  { key: 'semantic_model', label: 'Generando modelo semántico...' },
  { key: 'report', label: 'Creando páginas del report...' },
  { key: 'theme_security', label: 'Aplicando tema y seguridad...' },
  { key: 'pbip_ready', label: 'Generando archivo .pbip...' },
  { key: 'documentation', label: 'Generando documentación técnica...' },
  { key: 'completed', label: '¡Dashboard listo!' },
];

const Module5Review = () => {
  const { project, saveModule } = useProject();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [completed, setCompleted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const eventSource = useRef(null);

  const modules = project?.modules || {};
  const allCompleted = [1, 2, 3, 4].every((i) => modules[i]?.completed);

  const startGeneration = async () => {
    setGenerating(true);
    await saveModule(5, { confirmed: true, notes: '' });
    await api.post(`/projects/${project.id}/generate`);

    eventSource.current = new EventSource(`/api/projects/${project.id}/status/stream`);
    eventSource.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setProgress(data.percent);
      setCurrentStep(data.message);
      if (data.step === 'completed') {
        setCompleted(true);
        setDownloadUrl(`/api/projects/${project.id}/download`);
        eventSource.current.close();
      }
    };
  };

  useEffect(() => () => eventSource.current?.close(), []);

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Módulo 5 — Revisión y Generación</h2>
      <p className="text-sm text-gray-500 mb-6">Revisa el resumen y genera tu dashboard.</p>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 space-y-3">
        {[1, 2, 3, 4, 6].map((i) => {
          const mod = modules[i];
          return (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Módulo {i}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${mod?.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                {mod?.completed ? '✓ Completo' : 'Pendiente'}
              </span>
            </div>
          );
        })}
      </div>

      {!generating && !completed && (
        <button
          onClick={startGeneration}
          disabled={!allCompleted}
          className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-gray-900 font-bold px-8 py-3 rounded-xl text-sm"
        >
          Generar Dashboard
        </button>
      )}

      {generating && !completed && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-600 mb-3">{currentStep}</p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{progress}%</p>
        </div>
      )}

      {completed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="font-bold text-green-800 mb-2">¡Dashboard generado con éxito!</h3>
          <p className="text-sm text-green-600 mb-4">Tu archivo .pbip está listo para descargar.</p>
          <a
            href={downloadUrl}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm inline-block"
          >
            Descargar .pbip
          </a>
        </div>
      )}
    </div>
  );
};

export default Module5Review;
