import { Home, BookOpen, Dumbbell, Sparkles, User } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useLanguage();

  const navItems = [
    { id: 'home', icon: Home, label: t('nav.home') },
    { id: 'lessons', icon: BookOpen, label: t('nav.lessons') },
    { id: 'practice', icon: Dumbbell, label: t('nav.practice') },
    { id: 'signy', icon: Sparkles, label: 'Signy' },
    { id: 'profile', icon: User, label: t('profile.title') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom shadow-lg">
      <div className="max-w-7xl mx-auto grid grid-cols-5 h-14 sm:h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all relative ${isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-1 bg-primary rounded-full" />
              )}
              <Icon className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs truncate max-w-full px-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
