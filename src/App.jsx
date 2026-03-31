import { useState, useEffect } from 'react';
import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/LoginPage';
import { SignupPage } from './components/pages/SignupPage';
import { HomePage } from './components/pages/HomePage';
import { VIEW_STORAGE_KEY, PROTECTED_VIEWS, BACKGROUND_IMAGES } from './components/constants';
import { initializeGlobalStyles } from './components/utils';

// Initialize global styles
initializeGlobalStyles();

export default function App() {
  const [view, setView] = useState(() => {
    const token = localStorage.getItem('authToken');
    const savedView = localStorage.getItem(VIEW_STORAGE_KEY);

    if (savedView) {
      if (PROTECTED_VIEWS.has(savedView)) {
        return token ? savedView : 'landing';
      }
      return savedView;
    }

    return token ? 'home' : 'landing';
  });

  useEffect(() => {
    localStorage.setItem(VIEW_STORAGE_KEY, view);
  }, [view]);

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
      />
    );
  }

  return null;
}