import { useState, useEffect } from 'react';
import { Settings, Download } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from './LanguageProvider';
import { LanguageSelector } from './LanguageSelector';
import { EnvironmentSwitcher } from './EnvironmentSwitcher';
import logoImage from 'figma:asset/0bac470229d92a29f0f448217f41b3da35bc5c28.png';

interface HeaderProps {
  onSettingsClick: () => void;
  title?: string;
  environment?: 'school' | 'work' | 'home' | null;
  onEnvironmentChange?: (environment: 'school' | 'work' | 'home') => void;
}

// Extend Window interface for beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Declare global window property
declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent;
  }
}

export function Header({ onSettingsClick, title, environment, onEnvironmentChange }: HeaderProps) {
  const { t } = useLanguage();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebAppiOS = (window.navigator as any).standalone === true;

    if (isStandalone || isInWebAppiOS) {
      console.log('App is already installed');
      setShowInstallButton(false);
      return;
    }

    // Handler for beforeinstallprompt event
    const handler = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      window.deferredPrompt = promptEvent;
      setShowInstallButton(true);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handler);

    // Check if the event was already fired before component mounted
    if (window.deferredPrompt) {
      console.log('Using existing deferredPrompt');
      setDeferredPrompt(window.deferredPrompt);
      setShowInstallButton(true);
    }

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return;
    }

    console.log('Showing install prompt');

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`User response to install prompt: ${outcome}`);

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    window.deferredPrompt = undefined;
    setShowInstallButton(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl flex items-center justify-center shrink-0">
            <img src={logoImage} alt="Signway Logo" className="h-full w-full object-contain" />
          </div>
          {title ? (
            <h1 className="text-lg sm:text-2xl truncate">{title}</h1>
          ) : (
            <h1 className="text-lg sm:text-2xl leading-tight truncate font-normal">
              Signway
            </h1>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {showInstallButton && (
            <Button
              variant="default"
              size="sm"
              onClick={handleInstallClick}
              className="bg-primary hover:bg-primary/90 text-white hidden sm:flex"
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
          )}
          {showInstallButton && (
            <Button
              variant="default"
              size="icon"
              onClick={handleInstallClick}
              className="bg-primary hover:bg-primary/90 text-white sm:hidden rounded-full h-9 w-9"
              aria-label="Install App"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          {environment && onEnvironmentChange && (
            <EnvironmentSwitcher
              currentEnvironment={environment}
              onEnvironmentChange={onEnvironmentChange}
            />
          )}
          <LanguageSelector />
          <Button
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            aria-label={t('settings.accessibility')}
            className="rounded-full h-9 w-9 sm:h-10 sm:w-10"
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
