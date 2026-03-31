import { useEffect, useState } from 'react';
import ResearchEvalForm from './ResearchEvalForm';
import ResearchDatabase from './ResearchDatabase';
import EvaluationDashboard from './EvaluationDashboard';
import DatabaseDashboard from './DatabaseDashboard';
import EvaluationTracking from './EvaluationTracking';
import { PORTAL_PAGE_STORAGE_KEY } from '../constants';
import './ResearchPortal.css';

export function ResearchPortal({ onExit, initialPage = 'eval' }) {
  const normalizePage = (value) => {
    const key = String(value || '').toLowerCase();

    if (key === 'db' || key === 'db-form' || key === 'database') return 'db-form';
    if (key === 'eval' || key === 'eval-form' || key === 'evaluation') return 'eval-form';
    if (key === 'eval-dashboard') return 'eval-dashboard';
    if (key === 'db-dashboard') return 'db-dashboard';
    if (key === 'tracking') return 'tracking';

    return 'eval-form';
  };

  const resolveInitialPage = () => {
    const normalizedInitial = normalizePage(initialPage);
    const savedPage = normalizePage(localStorage.getItem(PORTAL_PAGE_STORAGE_KEY));

    const isEvalContext = normalizedInitial.startsWith('eval') || normalizedInitial === 'tracking';
    const isDbContext = normalizedInitial.startsWith('db');

    if (isEvalContext && (savedPage.startsWith('eval') || savedPage === 'tracking')) {
      return savedPage;
    }

    if (isDbContext && savedPage.startsWith('db')) {
      return savedPage;
    }

    return normalizedInitial;
  };

  const [page, setPage] = useState(resolveInitialPage);

  useEffect(() => {
    setPage(resolveInitialPage());
  }, [initialPage]);

  useEffect(() => {
    localStorage.setItem(PORTAL_PAGE_STORAGE_KEY, page);
  }, [page]);

  const handleNavigate = (targetPage) => {
    if (targetPage === 'home') {
      onExit?.();
      return;
    }
    setPage(normalizePage(targetPage));
  };

  if (page === 'eval-dashboard') return <EvaluationDashboard onNavigate={handleNavigate} />;
  if (page === 'db-dashboard') return <DatabaseDashboard onNavigate={handleNavigate} />;
  if (page === 'tracking') return <EvaluationTracking onNavigate={handleNavigate} />;
  if (page === 'db-form') return <ResearchDatabase onNavigate={handleNavigate} />;
  return <ResearchEvalForm onNavigate={handleNavigate} />;
}
