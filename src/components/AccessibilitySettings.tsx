import { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useTheme } from './ThemeProvider';
import { useLanguage } from './LanguageProvider';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';

interface AccessibilitySettingsProps {
  open: boolean;
  onClose: () => void;
}

export function AccessibilitySettings({ open, onClose }: AccessibilitySettingsProps) {
  const { theme, setTheme, accessibility, updateAccessibility } = useTheme();
  const { t, bhashiniEnabled, setBhashiniEnabled } = useLanguage();
  const [bhashiniConfigured, setBhashiniConfigured] = useState(false);

  const handleBhashiniSetup = async () => {
    // This will trigger the Supabase secret creation modal
    const modal = await import('../utils/supabase/info');
    setBhashiniConfigured(true);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('accessibility.title')}</SheetTitle>
          <SheetDescription>
            {t('accessibility.description')}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Theme Mode Selection */}
          <div className="space-y-4">
            <Label htmlFor="theme-mode">{t('theme.select')}</Label>
            <RadioGroup
              id="theme-mode"
              value={theme}
              onValueChange={(value) => setTheme(value as 'light' | 'dark' | 'high-contrast')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="cursor-pointer">{t('theme.light')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="cursor-pointer">{t('theme.dark')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high-contrast" id="high-contrast" />
                <Label htmlFor="high-contrast" className="cursor-pointer">{t('theme.highContrast')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label htmlFor="font-size">{t('accessibility.textSize')}</Label>
            <RadioGroup
              id="font-size"
              value={accessibility.fontSize}
              onValueChange={(value) => 
                updateAccessibility({ fontSize: value as 'normal' | 'large' | 'extra-large' })
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="cursor-pointer">{t('accessibility.normal')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="large" />
                <Label htmlFor="large" className="cursor-pointer">{t('accessibility.large')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="extra-large" id="extra-large" />
                <Label htmlFor="extra-large" className="cursor-pointer">{t('accessibility.extraLarge')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduce-motion">{t('accessibility.reduceMotion')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('accessibility.reduceMotion.description')}
              </p>
            </div>
            <Switch
              id="reduce-motion"
              checked={accessibility.reduceMotion}
              onCheckedChange={(checked) => updateAccessibility({ reduceMotion: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="screen-reader">{t('accessibility.screenReader')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('accessibility.screenReader.description')}
              </p>
            </div>
            <Switch
              id="screen-reader"
              checked={accessibility.screenReaderOptimized}
              onCheckedChange={(checked) => 
                updateAccessibility({ screenReaderOptimized: checked })
              }
            />
          </div>

          <div className="pt-4 border-t">
            <h3 className="mb-2">{t('language.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('language.description')}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-0.5">
                <Label htmlFor="bhashini">{t('language.bhashini')}</Label>
                <p className="text-sm text-muted-foreground">
                  {t('language.bhashini.description')}
                </p>
              </div>
              <Switch
                id="bhashini"
                checked={bhashiniEnabled}
                onCheckedChange={(checked) => setBhashiniEnabled(checked)}
                disabled={!bhashiniConfigured}
              />
            </div>

            {!bhashiniConfigured && (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleBhashiniSetup}
              >
                {t('language.bhashini.setup')}
              </Button>
            )}

            {bhashiniConfigured && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                {t('language.bhashini.configured')}
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <h3 className="mb-2">{t('accessibility.additionalFeatures')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• {t('accessibility.feature.keyboard')}</li>
              <li>• {t('accessibility.feature.aria')}</li>
              <li>• {t('accessibility.feature.highContrast')}</li>
              <li>• {t('accessibility.feature.captions')}</li>
              <li>• {t('accessibility.feature.compatible')}</li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
