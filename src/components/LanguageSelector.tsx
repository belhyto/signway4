import { Languages, Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { useLanguage, languageNames, type Language } from './LanguageProvider';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const allLanguages: Language[] = ['en', 'hi', 'mr', 'bn', 'ta', 'pa', 'gu', 'ml', 'kn', 'te', 'or', 'as', 'ur'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9 sm:h-10 sm:w-10 shrink-0"
          aria-label="Select language"
          type="button"
        >
          <Languages className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 sm:w-64 rounded-2xl" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <DropdownMenuLabel className="text-center text-sm sm:text-base">Select Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {allLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className="flex items-center justify-between cursor-pointer rounded-xl mx-1 py-2"
          >
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm sm:text-base truncate">{languageNames[lang].native}</span>
              <span className="text-xs text-muted-foreground truncate">
                {languageNames[lang].english}
              </span>
            </div>
            {language === lang && <Check className="h-4 w-4 text-primary shrink-0 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
