import { useState } from 'react';
import { Flame, Zap, Trophy, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useLanguage } from './LanguageProvider';
import { ChallengeCalendar } from './ChallengeCalendar';

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
            <span className="text-sm opacity-90 font-[Poppins]">Streak</span>
          </div>
          <div className="text-3xl">0</div>
          <div className="text-xs opacity-75">days</div>
        </div>

        <div className="bg-gradient-to-br from-primary to-green-600 dark:from-primary dark:to-green-700 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5" />
            <span className="text-sm opacity-90 font-[Poppins]">Total XP</span>
          </div>
          <div className="text-3xl">0</div>
          <div className="text-xs opacity-75">points</div>
        </div>
      </div>

      {/* Daily Goal */}
      <Collapsible open={isDailyGoalExpanded} onOpenChange={setIsDailyGoalExpanded}>
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:shadow-md hover:border-primary/30 transition-all duration-200">
          <CollapsibleTrigger className="w-full group cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="text-left">
                <h3 className="text-lg font-[Poppins] group-hover:text-primary transition-colors">Daily Goal</h3>
                <p className="text-sm text-muted-foreground">0/20 XP earned today</p>
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
        <div className="text-6xl mb-2">🤟</div>
        <h2 className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-[rgba(0,56,29,0.51)] text-[36px] font-[Poppins]">
          Welcome to Signway!
        </h2>
        <p className="text-muted-foreground font-[Poppins]">
          Master Indian Sign Language with AI-powered tools
        </p>
        <Button 
          size="lg" 
          onClick={onStartLearning}
          className="w-full rounded-xl h-14 text-lg shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-primary to-secondary font-[Poppins]"
        >
          Continue Learning
        </Button>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-2xl p-4 text-center shadow-sm border border-border">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-2xl">0</div>
          <div className="text-xs text-muted-foreground mt-1 font-[Poppins]">Lessons</div>
        </div>

        <div className="bg-card rounded-2xl p-4 text-center shadow-sm border border-border">
          <div className="text-2xl mb-1">✋</div>
          <div className="text-2xl">0</div>
          <div className="text-xs text-muted-foreground mt-1 font-[Poppins]">Signs</div>
        </div>

        <div className="bg-card rounded-2xl p-4 text-center shadow-sm border border-border">
          <div className="text-2xl mb-1">⭐</div>
          <div className="text-2xl">0</div>
          <div className="text-xs text-muted-foreground mt-1 font-[Poppins]">Stars</div>
        </div>
      </div>

      {/* Features Highlight */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border space-y-4">
        <h3 className="text-lg flex items-center gap-2">
          <Star className="h-5 w-5 text-accent" />
          Powered by AI
        </h3>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3">
            <span className="text-primary shrink-0">📱</span>
            <span><strong>AR Learning:</strong> Virtual instructor teaches you in 3D</span>
          </li>
          <li className="flex gap-3">
            <span className="text-secondary shrink-0">🤖</span>
            <span><strong>Signy AI:</strong> Practice conversations with AI buddy</span>
          </li>
          <li className="flex gap-3">
            <span className="text-accent shrink-0">📚</span>
            <span><strong>Structured Lessons:</strong> Learn workplace-specific signs</span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary shrink-0">🎯</span>
            <span><strong>Smart Practice:</strong> Adaptive quizzes track progress</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
