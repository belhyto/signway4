import { useState } from 'react';
import { Flame, Zap, Trophy, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useLanguage } from './LanguageProvider';
import { ChallengeCalendar } from './ChallengeCalendar';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface HomePageProps {
  onStartLearning: () => void;
}

export function HomePage({ onStartLearning }: HomePageProps) {
  const { t } = useLanguage();
  const [isDailyGoalExpanded, setIsDailyGoalExpanded] = useState(false);

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Streak and XP Banner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-2xl p-4 text-white shadow-lg bg-[rgba(84,69,167,0)]">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-5 w-5" />
            <span className="text-sm opacity-90">{t('home.streak')}</span>
          </div>
          <div className="text-3xl">0</div>
          <div className="text-xs opacity-75">{t('home.days')}</div>
        </div>

        <div className="bg-gradient-to-br from-primary to-green-600 dark:from-primary dark:to-green-700 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5" />
            <span className="text-sm opacity-90">{t('home.totalXP')}</span>
          </div>
          <div className="text-3xl">0</div>
          <div className="text-xs opacity-75">{t('home.points')}</div>
        </div>
      </div>

      {/* Daily Goal */}
      <Collapsible open={isDailyGoalExpanded} onOpenChange={setIsDailyGoalExpanded}>
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md hover:border-primary/30 transition-all duration-200">
          <CollapsibleTrigger className="w-full group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="text-left">
                <h3 className="text-lg group-hover:text-primary transition-colors">{t('home.dailyGoal')}</h3>
                <p className="text-sm text-muted-foreground">{t('home.xpEarnedToday').replace('{xp}', '0')}</p>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-8 w-8 text-accent group-hover:scale-110 transition-transform" />
                {isDailyGoalExpanded ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-primary animate-bounce group-hover:animate-none transition-colors" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
          <Progress value={0} className="h-3 mb-3" />

          <CollapsibleContent>
            <div className="mt-4 pt-4 border-t border-border">
              <ChallengeCalendar />
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>

      {/* Quick Start CTA */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 text-center space-y-4 border-2 border-primary/20">
        <div className="w-30 h-30 mx-auto mb-2">
          <DotLottieReact
            src="https://lottie.host/bbcefa71-2c51-4f7d-9422-c34a0ebdcd0f/pRLFAMyQSs.lottie"
            loop
            autoplay
          />
        </div>
        <h2 className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-[rgba(0,56,29,0.51)] text-[36px]">
          {t('home.welcomeTitle')}
        </h2>
        <p className="text-muted-foreground">
          {t('home.welcomeSubtitle')}
        </p>
        <Button
          size="lg"
          onClick={onStartLearning}
          className="w-full rounded-xl h-14 text-lg shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-primary to-secondary"
        >
          {t('home.continueLearning')}
        </Button>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl p-4 text-center shadow-sm border border-border">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-2xl">0</div>
          <div className="text-xs text-muted-foreground mt-1">{t('home.stats.lessons')}</div>
        </div>

        <div className="bg-card rounded-2xl p-4 text-center shadow-sm border border-border">
          <div className="text-2xl mb-1">✋</div>
          <div className="text-2xl">0</div>
          <div className="text-xs text-muted-foreground mt-1">{t('home.stats.signs')}</div>
        </div>

        <div className="bg-card rounded-2xl p-4 text-center shadow-sm border border-border">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-2xl">0</div>
          <div className="text-xs text-muted-foreground mt-1">{t('home.stats.stars')}</div>
        </div>
      </div>

      {/* Features Highlight */}

    </div>
  );
}
