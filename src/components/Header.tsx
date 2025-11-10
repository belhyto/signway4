import { Settings } from 'lucide-react';
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

export function Header({ onSettingsClick, title, environment, onEnvironmentChange }: HeaderProps) {
  const { t } = useLanguage();

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
            <h1 className="text-lg sm:text-2xl leading-tight truncate font-normal font-[Poppins]">
              Signway
            </h1>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
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
