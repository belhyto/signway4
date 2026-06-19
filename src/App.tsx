import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { LanguageProvider } from './components/LanguageProvider';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthPage } from './components/AuthPage';
import { AppContent } from './components/AppContent';
import { AdminDashboard } from './components/AdminDashboard';
import { getCurrentUser, onAuthStateChange, signOut } from './utils/supabase/auth';
import type { Language } from './components/LanguageProvider';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');
  const [userEnvironment, setUserEnvironment] = useState<'school' | 'work' | 'home' | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedLanguage = localStorage.getItem('preferred-language') as Language | null;
      const savedEnvironment = localStorage.getItem('signway_environment') as 'school' | 'work' | 'home' | null;
      const hasCompletedOnboarding = localStorage.getItem('signway_onboarding_completed');

      if (savedLanguage) setSelectedLanguage(savedLanguage);
      if (savedEnvironment) setUserEnvironment(savedEnvironment);

      const { data } = await getCurrentUser();
      const signedIn = Boolean(data?.user);

      if (hasCompletedOnboarding === 'true') {
        if (signedIn) {
          setIsAuthenticated(true);
        } else {
          setShowAuth(true);
        }
      } else {
        setShowWelcome(true);
      }

      setAuthLoading(false);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    const { data: authListener } = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        setIsAuthenticated(true);
        setShowAuth(false);
      }

      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        setIsAuthenticated(false);
        setShowAuth(true);
      }
    });

    return () => authListener?.subscription?.unsubscribe?.();
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
    setIsAuthenticated(true);
    setShowAuth(false);
  };

  const handleEnvironmentChange = (environment: 'school' | 'work' | 'home') => {
    setUserEnvironment(environment);
    localStorage.setItem('signway_environment', environment);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAuth(false);
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAuth(true);
  };

  const handleLogout = async () => {
    await signOut();
    setIsAuthenticated(false);
    setShowAuth(true);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} onSignIn={handleShowAuth} />;
  }

  if (showAuth || (!isAuthenticated && !isAdmin)) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} onAdminLogin={handleAdminLogin} />;
  }

  // Show admin dashboard for admin users
  if (isAdmin) {
    return (
      <LanguageProvider>
        <ThemeProvider>
          <AdminDashboard onLogout={handleAdminLogout} />
        </ThemeProvider>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppContent
          environment={userEnvironment}
          onEnvironmentChange={handleEnvironmentChange}
          onLogout={handleLogout}
        />
      </ThemeProvider>
    </LanguageProvider>
  );
}
