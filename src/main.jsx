import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ProjectsPage from './pages/ProjectsPage';
import LabPage from './pages/LabPage';
import { LangProvider } from './contexts/LangContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LangProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/lab" element={<LabPage />} />
        </Routes>
      </LangProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
