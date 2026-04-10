import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectEditor from './pages/ProjectEditor';
import ProjectList from './pages/ProjectList';
import LoginPage from './pages/LoginPage';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import { useUser } from './context/UserContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useUser();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><ProjectList /></PrivateRoute>} />
      <Route path="/projects/:id" element={<PrivateRoute><ProjectEditor /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
