import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="text-gray-500">Página no encontrada</p>
      <button onClick={() => navigate('/')} className="text-yellow-500 hover:underline text-sm">
        Volver al inicio
      </button>
    </div>
  );
};

export default NotFound;
