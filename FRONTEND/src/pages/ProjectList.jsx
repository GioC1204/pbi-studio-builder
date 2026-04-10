import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import api from '../services/api';
import { FolderOpen, Plus } from 'lucide-react';

const STATUS_MAP = {
  draft:      { label: 'Borrador',      cls: 'badge-neutral' },
  generating: { label: 'Generando...',  cls: 'badge-warning' },
  completed:  { label: 'Completado',    cls: 'badge-success' },
  error:      { label: 'Error',         cls: 'badge-error' },
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/projects').then(({ data }) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gradient" style={{ letterSpacing: '-0.02em' }}>
            Mis Proyectos
          </h1>
          <button
            onClick={() => navigate('/')}
            className="btn-shimmer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'linear-gradient(90deg, #F2C811, #FCD34D)',
              color: '#09090B', fontWeight: 700, fontSize: 13,
              padding: '8px 18px', borderRadius: 8, border: 'none',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(242,200,17,0.3)',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            <Plus size={14} />
            Nuevo Proyecto
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No tienes proyectos aún.
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => {
              const status = STATUS_MAP[p.status] || STATUS_MAP.draft;
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/projects/${p.id}`)}
                  className="card-premium cursor-pointer"
                  style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FolderOpen size={16} color="#A1A1AA" />
                    <div>
                      <h3 style={{ fontWeight: 600, color: '#18181B', fontSize: 14, margin: 0 }}>{p.name}</h3>
                      <p style={{ fontSize: 12, color: '#A1A1AA', margin: '3px 0 0' }}>
                        Creado: {new Date(p.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={status.cls}>{status.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectList;
