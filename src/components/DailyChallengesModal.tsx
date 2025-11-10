import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Target,
  BookOpen,
  Zap,
  Calendar,
  Flame,
  Star,
  CheckCircle2,
  X,
  ArrowRight
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { useLanguage } from './LanguageProvider';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'learn' | 'practice' | 'streak' | 'review';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
}

interface DailyChallengesModalProps {
  open: boolean;
  onClose: () => void;
  environment: 'school' | 'work' | 'home' | null;
  onChallengeComplete?: (challengeId: string) => void;
}

export function DailyChallengesModal({ 
  open, 
  onClose, 
  environment,
  onChallengeComplete 
}: DailyChallengesModalProps) {
  const { t } = useLanguage();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Load challenges from localStorage or generate new ones
    const loadChallenges = () => {
      const today = new Date().toDateString();
      const storedData = localStorage.getItem('dailyChallenges');
      
      if (storedData) {
        const data = JSON.parse(storedData);
        if (data.date === today) {
          setChallenges(data.challenges);
          setTotalXP(data.totalXP || 0);
          return;
        }
      }
      
      // Generate new daily challenges
      const newChallenges = generateDailyChallenges(environment);
      setChallenges(newChallenges);
      
      // Save to localStorage
      localStorage.setItem('dailyChallenges', JSON.stringify({
        date: today,
        challenges: newChallenges,
        totalXP: 0
      }));
    };

    // Load streak from localStorage
    const loadStreak = () => {
      const streakData = localStorage.getItem('challengeStreak');
      if (streakData) {
        const data = JSON.parse(streakData);
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (data.lastCompletionDate === yesterday || data.lastCompletionDate === today) {
          setStreak(data.streak || 0);
        } else {
          setStreak(0);
        }
      }
    };

    if (open) {
      loadChallenges();
      loadStreak();
    }
  }, [open, environment]);

  const generateDailyChallenges = (env: 'school' | 'work' | 'home' | null): Challenge[] => {
    const baseId = Date.now();
    
    return [
      {
        id: `challenge-${baseId}-1`,
        title: t('challenges.learnNewSigns.title'),
        description: t('challenges.learnNewSigns.description'),
        type: 'learn',
        difficulty: 'easy',
        xpReward: 50,
        progress: 0,
        target: 3,
        completed: false
      },
      {
        id: `challenge-${baseId}-2`,
        title: t('challenges.practiceSession.title'),
        description: t('challenges.practiceSession.description'),
        type: 'practice',
        difficulty: 'medium',
        xpReward: 100,
        progress: 0,
        target: 1,
        completed: false
      },
      {
        id: `challenge-${baseId}-3`,
        title: t('challenges.perfectScore.title'),
        description: t('challenges.perfectScore.description'),
        type: 'review',
        difficulty: 'hard',
        xpReward: 150,
        progress: 0,
        target: 1,
        completed: false
      }
    ];
  };

  const completeChallenge = (challengeId: string) => {
    setChallenges(prev => {
      const updated = prev.map(ch => {
        if (ch.id === challengeId && !ch.completed) {
          setTotalXP(xp => xp + ch.xpReward);
          return { ...ch, completed: true, progress: ch.target };
        }
        return ch;
      });

      // Save to localStorage
      const today = new Date().toDateString();
      localStorage.setItem('dailyChallenges', JSON.stringify({
        date: today,
        challenges: updated,
        totalXP: totalXP + updated.find(c => c.id === challengeId)?.xpReward || 0
      }));

      // Check if all challenges completed to update streak
      const allCompleted = updated.every(c => c.completed);
      if (allCompleted) {
        updateStreak();
        saveChallengeCompletion();
      }

      return updated;
    });

    onChallengeComplete?.(challengeId);
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const streakData = localStorage.getItem('challengeStreak');
    
    let newStreak = 1;
    if (streakData) {
      const data = JSON.parse(streakData);
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      if (data.lastCompletionDate === yesterday) {
        newStreak = (data.streak || 0) + 1;
      }
    }
    
    localStorage.setItem('challengeStreak', JSON.stringify({
      streak: newStreak,
      lastCompletionDate: today
    }));
    
    setStreak(newStreak);
  };

  const saveChallengeCompletion = () => {
    const today = new Date().toISOString().split('T')[0];
    const completionHistory = localStorage.getItem('challengeCompletionHistory');
    
    let history: { [key: string]: boolean } = {};
    if (completionHistory) {
      history = JSON.parse(completionHistory);
    }
    
    history[today] = true;
    localStorage.setItem('challengeCompletionHistory', JSON.stringify(history));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500 bg-green-500/10';
      case 'medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'hard':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'learn':
        return BookOpen;
      case 'practice':
        return Target;
      case 'streak':
        return Flame;
      case 'review':
        return Star;
      default:
        return Trophy;
    }
  };

  const completedCount = challenges.filter(c => c.completed).length;
  const allCompleted = challenges.length > 0 && completedCount === challenges.length;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
              >
                <Trophy className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <DialogTitle className="text-2xl">{t('challenges.title')}</DialogTitle>
                <DialogDescription>
                  {t('challenges.subtitle')}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Streak and XP Display */}
        <div className="grid grid-cols-2 gap-3 my-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('challenges.currentStreak')}</p>
                <p className="text-2xl">{streak} {t('challenges.days')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('challenges.earnedToday')}</p>
                <p className="text-2xl">{totalXP} XP</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">{t('challenges.progress')}</span>
            <span className="text-sm">
              {completedCount} / {challenges.length} {t('challenges.completed')}
            </span>
          </div>
          <Progress value={(completedCount / challenges.length) * 100} className="h-2" />
        </div>

        {/* Daily Challenges */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {challenges.map((challenge, index) => {
              const Icon = getChallengeIcon(challenge.type);
              
              return (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={challenge.completed ? 'border-green-500 bg-green-500/5' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          challenge.completed ? 'bg-green-500' : 'bg-primary/10'
                        }`}>
                          {challenge.completed ? (
                            <CheckCircle2 className="h-6 w-6 text-white" />
                          ) : (
                            <Icon className={`h-6 w-6 ${challenge.completed ? 'text-white' : 'text-primary'}`} />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={challenge.completed ? 'line-through text-muted-foreground' : ''}>
                              {challenge.title}
                            </h4>
                            <Badge className={getDifficultyColor(challenge.difficulty)} variant="outline">
                              {t(`challenges.difficulty.${challenge.difficulty}`)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {challenge.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">+{challenge.xpReward} XP</span>
                            </div>

                            {!challenge.completed && (
                              <Button
                                size="sm"
                                onClick={() => completeChallenge(challenge.id)}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                {t('challenges.markComplete')}
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            )}

                            {challenge.completed && (
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                {t('challenges.completed')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* All Completed Message */}
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4"
          >
            <Card className="border-2 border-green-500 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: 'spring', bounce: 0.6, delay: 0.2 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
                >
                  <Trophy className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl mb-2">{t('challenges.allCompleted.title')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('challenges.allCompleted.description')}
                </p>
                <div className="flex items-center justify-center gap-2 text-yellow-600">
                  <Star className="h-5 w-5 fill-current" />
                  <span>+{totalXP} XP {t('challenges.earned')}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t('challenges.viewLater')}
          </Button>
          <Button onClick={onClose} className="flex-1 bg-blue-600 hover:bg-blue-700">
            {allCompleted ? t('challenges.done') : t('challenges.startLearning')}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
