import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../services/api';
import { BarChart2, Check } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.user, data.token);
      navigate('/');
    } catch {
      setError('Email o contraseña incorrectos.');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Panel izquierdo — dark brand */}
      <div
        className="flex-1 flex flex-col justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #0F172A 0%, #080E1A 100%)' }}
      >
        {/* glow decorativo */}
        <div
          className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(242,200,17,.1) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 max-w-md">
          <div className="mb-3">
            <BarChart2 size={32} color="#F2C811" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-3">
            PBI Studio<br />Builder
          </h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#94A3B8' }}>
            Genera dashboards Power BI profesionales con la ayuda de agentes de IA en minutos, no horas.
          </p>

          {/* divider brand */}
          <div
            className="w-10 h-0.5 rounded mb-8"
            style={{ background: 'linear-gradient(90deg, #F2C811, #A855F7)' }}
          />

          <div className="flex flex-col gap-3.5">
            {[
              'Conecta cualquier fuente de datos — CSV, Excel, SQL',
              'Define KPIs en lenguaje natural, POLARIS genera el DAX',
              'Descarga un .pbip listo para Power BI Desktop en minutos',
            ].map((text) => (
              <div key={text} className="flex items-center gap-3.5">
                <div
                  className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #F2C811, #FCD34D)', color: '#09090B' }}
                >
                  <Check size={13} strokeWidth={2.5} />
                </div>
                <span className="text-sm leading-snug" style={{ color: '#94A3B8' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario blanco */}
      <div className="w-[420px] flex-shrink-0 bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-xs">
          <h2 className="text-[22px] font-extrabold text-gray-950 mb-1">Bienvenido de vuelta</h2>
          <p className="text-[13px] text-gray-500 mb-8">Inicia sesión para continuar con tu proyecto</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-bold text-sm text-gray-950 transition-all hover:-translate-y-px"
              style={{
                background: 'linear-gradient(90deg, #F2C811 0%, #FCD34D 50%, #F2C811 100%)',
                backgroundSize: '200% 100%',
                boxShadow: '0 2px 8px rgba(242,200,17,.3)',
              }}
            >
              Iniciar sesión →
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            ¿Sin cuenta?{' '}
            <span className="text-yellow-600 font-semibold cursor-pointer hover:underline">
              Regístrate gratis
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
