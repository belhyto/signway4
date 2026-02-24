import { useState } from 'react';
import { Flame, Zap, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
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
    <div className="px-4 py-6 pb-24 space-y-6">
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

      {/* Quick Start CTA / Welcome Section */}
      <div className="bg-[#e6fcf5] lg:bg-[#e2f3f0] rounded-2xl lg:rounded-[40px] p-6 lg:p-12 text-center lg:text-left border lg:border-none shadow-sm lg:grid lg:grid-cols-2 lg:items-center lg:gap-12 relative overflow-hidden">
        {/* Left Content (Frog + Text) */}
        <div className="flex flex-col items-center lg:items-center space-y-4 lg:space-y-6">
          <div className="w-40 h-40 lg:w-80 lg:h-80 relative">
            <DotLottieReact
              src="https://lottie.host/bbcefa71-2c51-4f7d-9422-c34a0ebdcd0f/pRLFAMyQSs.lottie"
              loop
              autoplay
            />
          </div>
          <div className="space-y-2 lg:space-y-3 text-center">
            <h2 className="text-2xl lg:text-5xl font-bold text-[#00381d]/80">
              {t('home.welcomeTitle')}
            </h2>
            <p className="text-muted-foreground lg:text-xl lg:font-medium">
              {t('home.welcomeSubtitle')}
            </p>
          </div>
        </div>

        {/* Right Content (Button) */}
        <div className="mt-6 lg:mt-0 flex justify-center lg:justify-center">
          <Button
            size="lg"
            onClick={onStartLearning}
            className="w-full rounded-xl h-14 text-lg shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-primary to-secondary"
          >
            {t('home.continueLearning')}
          </Button>
        </div>

        {/* Decorative elements for desktop */}
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
          <div className="w-10 h-10 border-2 border-primary/20 rounded-full" />
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-3 gap-3 lg:gap-10 pb-4">
        <div className="bg-white rounded-2xl lg:rounded-[24px] p-4 lg:p-10 text-center shadow-sm border border-border/60 hover:shadow-md transition-all duration-300">
          <div className="text-xs lg:text-lg font-semibold text-muted-foreground lg:mb-3">{t('home.stats.lessons')}</div>
          <div className="text-2xl lg:text-5xl mb-1 lg:mb-4">🎯</div>
          <div className="text-xl lg:text-4xl font-bold text-[#00381d]/80">0</div>
        </div>

        <div className="bg-white rounded-2xl lg:rounded-[24px] p-4 lg:p-10 text-center shadow-sm border border-border/60 hover:shadow-md transition-all duration-300">
          <div className="text-xs lg:text-lg font-semibold text-muted-foreground lg:mb-3">{t('home.stats.signs')}</div>
          <div className="text-2xl lg:text-5xl mb-1 lg:mb-4">✋</div>
          <div className="text-xl lg:text-4xl font-bold text-[#00381d]/80">0</div>
        </div>

        <div className="bg-white rounded-2xl lg:rounded-[24px] p-4 lg:p-10 text-center shadow-sm border border-border/60 hover:shadow-md transition-all duration-300">
          <div className="text-xs lg:text-lg font-semibold text-muted-foreground lg:mb-3">{t('home.stats.stars')}</div>
          <div className="text-2xl lg:text-5xl mb-1 lg:mb-4">⭐</div>
          <div className="text-xl lg:text-4xl font-bold text-[#00381d]/80">0</div>
        </div>
      </div>
    </div>
  );
}
