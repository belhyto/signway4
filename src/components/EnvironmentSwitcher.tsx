import { useState } from 'react';
import { Briefcase, Home, School } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLanguage } from './LanguageProvider';

interface EnvironmentSwitcherProps {
  currentEnvironment: 'school' | 'work' | 'home' | null;
  onEnvironmentChange: (environment: 'school' | 'work' | 'home') => void;
}

export function EnvironmentSwitcher({ 
  currentEnvironment, 
  onEnvironmentChange 
}: EnvironmentSwitcherProps) {
  const { t } = useLanguage();

  const environments = [
    { id: 'school' as const, icon: School, label: t('environment.school'), color: 'text-blue-600' },
    { id: 'work' as const, icon: Briefcase, label: t('environment.work'), color: 'text-purple-600' },
    { id: 'home' as const, icon: Home, label: t('environment.home'), color: 'text-green-600' },
  ];

  const currentEnv = environments.find(env => env.id === currentEnvironment);
  const CurrentIcon = currentEnv?.icon || School;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 sm:h-10 sm:w-10 shrink-0"
          aria-label={t('environment.switch')}
        >
          <CurrentIcon className={`h-4 w-4 sm:h-5 sm:w-5 ${currentEnv?.color || ''}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 sm:w-56 rounded-2xl">
        {environments.map((env) => {
          const Icon = env.icon;
          const isActive = currentEnvironment === env.id;
          
          return (
            <DropdownMenuItem
              key={env.id}
              onClick={() => onEnvironmentChange(env.id)}
              className={`flex items-center gap-2 sm:gap-3 cursor-pointer rounded-xl mx-1 py-2 ${
                isActive ? 'bg-accent' : ''
              }`}
            >
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${env.color} shrink-0`} />
              <span className="text-sm sm:text-base truncate flex-1">{env.label}</span>
              {isActive && (
                <span className="ml-auto text-xs text-muted-foreground shrink-0">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
