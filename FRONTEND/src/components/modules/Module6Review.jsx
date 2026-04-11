import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../../context/ProjectContext';
import api from '../../services/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Module5Review = () => {
  const { project, saveModule, goBack } = useProject();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const fakeProgressRef = useRef(null);

  const modules = project?.modules || {};
  // All 6 user modules (1=Datos, 2=Tema, 3=KPIs, 4=Páginas, 5=Seguridad, 6=Docs) must be complete
  const allCompleted = [1, 2, 3, 4, 5, 6].every((i) => modules[i]?.completed);

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    if (fakeProgressRef.current) { clearInterval(fakeProgressRef.current); fakeProgressRef.current = null; }
  };

  // Fake progress animation so the bar visually advances while backend works
  const startFakeProgress = () => {
    fakeProgressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // cap at 90% until real completion
        return prev + Math.random() * 3;
      });
    }, 1500);
  };

  // On mount: check DB status so we show download button if already completed
  useEffect(() => {
    if (!project?.id) return;
    api.get(`/projects/${project.id}/status`).then(({ data }) => {
      if (data.status === 'completed') {
        setCompleted(true);
      } else if (data.status === 'generating') {
        setGenerating(true);
        setCurrentStep('Generando tu dashboard...');
        startFakeProgress();
        startPoll();
      } else if (data.status === 'error') {
        setError('La generación anterior falló. Revisa los datos e inténtalo de nuevo.');
      }
    }).catch(() => {});
    return stopPolling;
  }, [project?.id]);

  const startPoll = () => {
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await api.get(`/projects/${project.id}/status`);
        if (data.status === 'completed') {
          stopPolling();
          setProgress(100);
          setCompleted(true);
          setGenerating(false);
        } else if (data.status === 'error') {
          stopPolling();
          setGenerating(false);
          setError('Error durante la generación. Revisa los datos e inténtalo de nuevo.');
        }
      } catch {
        stopPolling();
        setError('No se pudo verificar el estado. Revisa tu conexión e inténtalo de nuevo.');
      }
    }, 3000);
  };

  const startGeneration = async () => {
    setGenerating(true);
    setProgress(0);
    setError(null);
    setCurrentStep('Iniciando generación...');
    try {
      await saveModule(7, { confirmed: true, notes: '' });
      await api.post(`/projects/${project.id}/generate`);
      setCurrentStep('Generando tu dashboard...');
      startFakeProgress();
      startPoll();
    } catch (err) {
      setGenerating(false);
      const msg = err.response?.data?.error || err.response?.data?.violations?.[0]?.message || 'No se pudo iniciar la generación. Intenta de nuevo.';
      setError(msg);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/projects/${project.id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name || 'dashboard'}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('No se pudo descargar el archivo. Intenta de nuevo.');
    }
  };

  useEffect(() => stopPolling, []);

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Módulo 7 — Revisión y Generación</h2>
      <p className="text-sm text-gray-500 mb-6">Revisa el resumen y genera tu dashboard.</p>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 space-y-3">
        {[
          { id: 1, label: 'Fuente de Datos' },
          { id: 2, label: 'Tema Visual' },
          { id: 3, label: 'KPIs y Negocio' },
          { id: 4, label: 'Páginas del Reporte' },
          { id: 5, label: 'Control de Acceso' },
          { id: 6, label: 'Documentación' },
        ].map(({ id, label }) => {
          const mod = modules[id];
          return (
            <div key={id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 w-4">{id}</span>
                <span className="text-sm text-gray-700">{label}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${mod?.completed ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                {mod?.completed ? '✓ Completo' : 'Pendiente'}
              </span>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-red-700 font-medium">Error</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      )}

      {!generating && !completed && (
        <div className="flex items-center gap-3">
          <button
            onClick={goBack}
            className="px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 bg-white transition-colors"
          >
            ← Anterior
          </button>
          <button
            onClick={startGeneration}
            disabled={!allCompleted}
            className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-40 text-gray-900 font-bold px-8 py-3 rounded-xl text-sm"
          >
            Generar Dashboard
          </button>
        </div>
      )}

      {generating && !completed && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <p className="text-sm text-gray-600 mb-3">{currentStep}</p>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.round(progress)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">{Math.round(progress)}%</p>
        </div>
      )}

      {completed && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="font-bold text-green-800 mb-2">¡Dashboard generado con éxito!</h3>
          <p className="text-sm text-green-600 mb-4">Tu archivo .pbip está listo para descargar.</p>
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
          >
            Descargar .pbip
          </button>
        </div>
      )}
    </div>
  );
};

export default Module5Review;
