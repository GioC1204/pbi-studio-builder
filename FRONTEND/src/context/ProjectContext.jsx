import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState(null);
  const [currentModule, setCurrentModule] = useState(1);

  const loadProject = useCallback(async (id) => {
    const { data } = await api.get(`/projects/${id}`);
    setProject(data);
    // Navigate to first incomplete module
    const firstIncomplete = [1, 2, 3, 4, 5, 6, 7].find((i) => !data.modules?.[i]?.completed) || 7;
    setCurrentModule(firstIncomplete);
  }, []);

  const saveModule = useCallback(async (moduleNum, data) => {
    const { data: updated } = await api.post(
      `/projects/${project.id}/modules/${moduleNum}`,
      { data }
    );
    setProject(updated);
    if (moduleNum < 7) setCurrentModule(moduleNum + 1);
  }, [project]);

  return (
    <ProjectContext.Provider value={{ project, currentModule, setCurrentModule, loadProject, saveModule }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
};
