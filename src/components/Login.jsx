import { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HomePage } from './pages/HomePage';
import { ResearchPortal } from './researchPortal/ResearchPortal';
import { VIEW_STORAGE_KEY, PROTECTED_VIEWS, BACKGROUND_IMAGES } from './constants';
import { initializeGlobalStyles } from './utils';

// Initialize global styles
initializeGlobalStyles();

export default function App() {
  const [view, setView] = useState(() => {
    const token = localStorage.getItem('authToken');
    const savedView = localStorage.getItem(VIEW_STORAGE_KEY);

    if (savedView === 'researchPortal') {
      return token ? 'researchEvaluation' : 'landing';
    }

    if (savedView) {
      if (PROTECTED_VIEWS.has(savedView)) {
        return token ? savedView : 'landing';
      }
      return savedView;
    }

    return token ? 'home' : 'landing';
  });

  // Save view to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(VIEW_STORAGE_KEY, view);
  }, [view]);

  useEffect(() => {
    const handleAuthExpired = () => {
      localStorage.setItem(VIEW_STORAGE_KEY, 'landing');
      setView('landing');
    };

    window.addEventListener('scholarSphere:authExpired', handleAuthExpired);
    return () => window.removeEventListener('scholarSphere:authExpired', handleAuthExpired);
  }, []);

  // Navigation handlers
  const handleLogoNavigation = () => {
    const token = localStorage.getItem('authToken');
    setView(token ? 'home' : 'landing');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.setItem(VIEW_STORAGE_KEY, 'landing');
    setView('landing');
  };

  const handleLoginSuccess = () => {
    setView('home');
  };

  const handleSignupSuccess = () => {
    setView('login');
  };

  // Render views
  if (view === 'landing') {
    return (
      <LandingPage
        onLogoClick={handleLogoNavigation}
        onLoginClick={() => setView('login')}
        logo={BACKGROUND_IMAGES.logo}
      />
    );
  }

  if (view === 'login') {
    return (
      <LoginPage
        onLogoClick={handleLogoNavigation}
        onSignupClick={() => setView('signup')}
        onLoginSuccess={handleLoginSuccess}
        logo={BACKGROUND_IMAGES.logo}
      />
    );
  }

  if (view === 'signup') {
    return (
      <SignupPage
        onLogoClick={handleLogoNavigation}
        onLoginClick={() => setView('login')}
        onSignupSuccess={handleSignupSuccess}
        logo={BACKGROUND_IMAGES.logo}
      />
    );
  }

  if (view === 'home') {
    return (
      <HomePage
        onLogout={handleLogout}
        logo={BACKGROUND_IMAGES.logo}
        onLogoClick={handleLogoNavigation}
        onOpenResearchPortal={(target) => setView(target === 'db' ? 'researchDatabase' : 'researchEvaluation')}
      />
    );
  }

  if (view === 'researchEvaluation') {
    return <ResearchPortal initialPage="eval" onExit={() => setView('home')} />;
  }

  if (view === 'researchDatabase') {
    return <ResearchPortal initialPage="db" onExit={() => setView('home')} />;
  }

  if (view === 'researchPortal') {
    return <ResearchPortal initialPage="eval" onExit={() => setView('home')} />;
  }

  return null;
}
