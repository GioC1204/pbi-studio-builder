import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import ProgressBar from '../components/layout/ProgressBar';
import Module1DataSource from '../components/modules/Module1DataSource';
import Module2Theme from '../components/modules/Module2Theme';
import Module3Business from '../components/modules/Module3Business';
import Module4Security from '../components/modules/Module4Security';
import Module5Review from '../components/modules/Module5Review';
import Module6Documentation from '../components/modules/Module6Documentation';
import { useProject } from '../context/ProjectContext';

const MODULES = {
  1: Module1DataSource,
  2: Module2Theme,
  3: Module3Business,
  4: Module4Security,
  5: Module5Review,
  6: Module6Documentation,
};

const ProjectEditor = () => {
  const { id } = useParams();
  const { project, loadProject, currentModule } = useProject();

  useEffect(() => {
    loadProject(id);
  }, [id]);

  const ActiveModule = MODULES[currentModule];

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAFA' }}>
        <div className="w-10 h-10 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#F4F4F5' }}>
      <Header projectName={project.name} />

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-6">
          <ProgressBar modules={project.modules} current={currentModule} />
          <div className="mt-5">
            <ActiveModule />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectEditor;
