import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, CheckCircle2, X, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageProvider';

interface ChallengeCalendarProps {
  className?: string;
}

export function ChallengeCalendar({ className = '' }: ChallengeCalendarProps) {
  const { t } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [completionHistory, setCompletionHistory] = useState<{ [key: string]: boolean }>({});
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  useEffect(() => {
    loadCompletionHistory();
  }, []);

  const loadCompletionHistory = () => {
    const history = localStorage.getItem('challengeCompletionHistory');
    if (history) {
      const data = JSON.parse(history);
      setCompletionHistory(data);
      calculateStreaks(data);
    }

    const streakData = localStorage.getItem('challengeStreak');
    if (streakData) {
      const data = JSON.parse(streakData);
      setCurrentStreak(data.streak || 0);
    }
  };

  const calculateStreaks = (history: { [key: string]: boolean }) => {
    const dates = Object.keys(history)
      .filter(date => history[date])
      .sort()
      .reverse();

    let longest = 0;
    let currentCount = 0;
    let previousDate: Date | null = null;

    for (const dateStr of dates) {
      const date = new Date(dateStr);
      
      if (previousDate) {
        const diff = Math.floor((previousDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diff === 1) {
          currentCount++;
        } else {
          longest = Math.max(longest, currentCount);
          currentCount = 1;
        }
      } else {
        currentCount = 1;
      }
      
      previousDate = date;
    }
    
    longest = Math.max(longest, currentCount);
    setLongestStreak(longest);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateCompleted = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return completionHistory[dateStr] === true;
  };

  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate completion rate for current month
  const monthDates = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(year, month, i + 1);
    return date;
  }).filter(date => !isFutureDate(date));

  const completedDaysThisMonth = monthDates.filter(date => isDateCompleted(date)).length;
  const completionRate = monthDates.length > 0 
    ? Math.round((completedDaysThisMonth / monthDates.length) * 100) 
    : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <CardTitle>{t('challenges.calendar.title')}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl mb-1">🔥</p>
            <p className="text-sm text-muted-foreground">{t('challenges.calendar.currentStreak')}</p>
            <p className="text-xl">{currentStreak}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl mb-1">⭐</p>
            <p className="text-sm text-muted-foreground">{t('challenges.calendar.longestStreak')}</p>
            <p className="text-xl">{longestStreak}</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl mb-1">📊</p>
            <p className="text-sm text-muted-foreground">{t('challenges.calendar.thisMonth')}</p>
            <p className="text-xl">{completionRate}%</p>
          </div>
        </div>

        {/* Month Header */}
        <div className="text-center mb-4">
          <h3 className="text-lg">{monthName}</h3>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs text-muted-foreground p-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const completed = isDateCompleted(date);
            const future = isFutureDate(date);
            const today = isToday(date);

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.01 }}
                className="aspect-square"
              >
                <div
                  className={`
                    w-full h-full flex items-center justify-center rounded-lg text-sm relative
                    ${today ? 'ring-2 ring-primary ring-offset-2' : ''}
                    ${completed ? 'bg-green-500 text-white' : ''}
                    ${!completed && !future ? 'bg-muted hover:bg-muted/70' : ''}
                    ${future ? 'text-muted-foreground/30' : ''}
                    ${!completed && !future ? 'cursor-pointer' : ''}
                  `}
                >
                  {completed ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </motion.div>
                  ) : !future ? (
                    <span>{day}</span>
                  ) : (
                    <span>{day}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span>{t('challenges.calendar.completed')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted" />
            <span>{t('challenges.calendar.incomplete')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded ring-2 ring-primary" />
            <span>{t('challenges.calendar.today')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
