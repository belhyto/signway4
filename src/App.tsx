import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider } from './components/LanguageProvider';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthPage } from './components/AuthPage';
import { AppContent } from './components/AppContent';
import type { Language } from './components/LanguageProvider';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [userEnvironment, setUserEnvironment] = useState<'school' | 'work' | 'home' | null>(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('signway_onboarding_completed');
    const savedAuth = localStorage.getItem('signway_authenticated');
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    const savedEnvironment = localStorage.getItem('signway_environment') as 'school' | 'work' | 'home';

    if (hasCompletedOnboarding === 'true') {
      // User has completed onboarding before
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
        if (savedLanguage) setSelectedLanguage(savedLanguage);
        if (savedEnvironment) setUserEnvironment(savedEnvironment);
      } else {
        // Show auth page directly for returning users
        setShowAuth(true);
        if (savedLanguage) setSelectedLanguage(savedLanguage);
      }
    } else {
      // First-time user - show welcome after splash
      setShowWelcome(true);
    }
  }, []);

  const handleWelcomeComplete = (language: Language, environment?: 'school' | 'work' | 'home') => {
    setSelectedLanguage(language);
    if (environment) {
      setUserEnvironment(environment);
      localStorage.setItem('signway_environment', environment);
    }
    localStorage.setItem('preferred-language', language);
    localStorage.setItem('signway_onboarding_completed', 'true');
    setShowWelcome(false);
    setShowAuth(true);
  };

  const handleShowAuth = () => {
    setShowWelcome(false);
    setShowAuth(true);
  };

  const handleAuthSuccess = () => {
    localStorage.setItem('signway_authenticated', 'true');
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleEnvironmentChange = (environment: 'school' | 'work' | 'home') => {
    setUserEnvironment(environment);
    localStorage.setItem('signway_environment', environment);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} onSignIn={handleShowAuth} />;
  }

  if (showAuth || !isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent 
          environment={userEnvironment} 
          onEnvironmentChange={handleEnvironmentChange}
        />
      </ThemeProvider>
    </LanguageProvider>
  );
}
