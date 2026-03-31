import { useEffect, useState } from 'react';
import ResearchEvalForm from './ResearchEvalForm';
import ResearchDatabase from './ResearchDatabase';
import './ResearchPortal.css';

export function ResearchPortal({ onExit, initialPage = 'eval' }) {
  const [page, setPage] = useState(initialPage === 'db' ? 'db' : 'eval');

  useEffect(() => {
    setPage(initialPage === 'db' ? 'db' : 'eval');
  }, [initialPage]);

  const handleNavigate = (targetPage) => {
    if (targetPage === 'home') {
      onExit?.();
      return;
    }
    setPage(targetPage === 'db' ? 'db' : 'eval');
  };

  if (page === 'db') return <ResearchDatabase onNavigate={handleNavigate} />;
  return <ResearchEvalForm onNavigate={handleNavigate} />;
}
