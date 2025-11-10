import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { CheckCircle2, Lock, Star, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface Lesson {
  id: string;
  title: string;
  description: string;
  signs: string[];
  completed: boolean;
  locked: boolean;
  category: string;
}

const lessons: Lesson[] = [
  {
    id: '1',
    title: 'Basic Greetings',
    description: 'Learn essential greetings for the workplace',
    signs: ['Hello', 'Good Morning', 'Good Afternoon', 'Good Evening', 'Goodbye', 'Thank You', 'Please', 'Welcome'],
    completed: false,
    locked: false,
    category: 'Basics',
  },
  {
    id: '2',
    title: 'Introductions',
    description: 'Introduce yourself and others',
    signs: ['My Name Is', 'Nice to Meet You', 'I Work In', 'Department', 'Manager', 'Colleague', 'Team'],
    completed: false,
    locked: false,
    category: 'Basics',
  },
  {
    id: '3',
    title: 'Meeting Vocabulary',
    description: 'Essential signs for meetings and discussions',
    signs: ['Meeting', 'Conference', 'Presentation', 'Question', 'Answer', 'Agree', 'Disagree', 'Schedule'],
    completed: false,
    locked: false,
    category: 'Professional',
  },
  {
    id: '4',
    title: 'Common Requests',
    description: 'Make and respond to common workplace requests',
    signs: ['Help', 'Can You', 'I Need', 'Understand', 'Repeat', 'Slow Down', 'Break', 'Lunch'],
    completed: false,
    locked: false,
    category: 'Professional',
  },
  {
    id: '5',
    title: 'Office Environment',
    description: 'Signs related to office spaces and equipment',
    signs: ['Office', 'Desk', 'Computer', 'Phone', 'Email', 'Printer', 'Meeting Room', 'Restroom'],
    completed: false,
    locked: false,
    category: 'Workplace',
  },
  {
    id: '6',
    title: 'Time & Scheduling',
    description: 'Communicate about time and schedules',
    signs: ['Today', 'Tomorrow', 'Yesterday', 'Week', 'Month', 'Morning', 'Afternoon', 'Evening'],
    completed: false,
    locked: false,
    category: 'Workplace',
  },
];

export function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const completedLessons = lessons.filter(l => l.completed).length;
  const progressPercent = (completedLessons / lessons.length) * 100;

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header with Progress */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl">Your Learning Path</h2>
            <p className="text-sm text-muted-foreground">
              {completedLessons} of {lessons.length} lessons completed
            </p>
          </div>
          <Trophy className="h-10 w-10 text-accent" />
        </div>
        <Progress value={progressPercent} className="h-3" />
      </div>

      {/* Lesson Path */}
      <div className="space-y-4">
        {lessons.map((lesson, index) => {
          const isCompleted = lesson.completed;
          const isLocked = lesson.locked;
          const isActive = !isCompleted && !isLocked;

          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={index % 2 === 0 ? 'mr-6' : 'ml-6'}
            >
              <div
                className={`w-full bg-card rounded-3xl p-5 shadow-md border-2 transition-all
                  ${isCompleted ? 'border-primary/50 bg-primary/5' : 
                    isActive ? 'border-primary hover:border-primary hover:shadow-lg' : 
                    'border-border opacity-60'}
                `}
              >
                <button
                  onClick={() => !isLocked && setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id)}
                  disabled={isLocked}
                  className="w-full text-left flex items-center gap-4"
                >
                  <div className={`shrink-0 h-16 w-16 rounded-2xl flex items-center justify-center text-2xl shadow-md
                    ${isCompleted ? 'bg-primary text-white' : 
                      isActive ? 'bg-secondary text-white' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-8 w-8" />
                    ) : isLocked ? (
                      <Lock className="h-8 w-8" />
                    ) : (
                      <Star className="h-8 w-8" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg truncate">{lesson.title}</h3>
                      {isCompleted && (
                        <Badge className="bg-primary text-white">✓</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {lesson.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {lesson.signs.length} signs
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {lesson.category}
                      </Badge>
                    </div>
                  </div>

                  {isActive && (
                    <div className="shrink-0 text-primary">
                      <div className="text-xs">START</div>
                      <div className="text-xl">▶</div>
                    </div>
                  )}
                </button>

                {selectedLesson === lesson.id && !isLocked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {lesson.signs.map((sign, idx) => (
                        <div 
                          key={idx}
                          className="p-3 bg-muted rounded-xl text-sm text-center"
                        >
                          ✋ {sign}
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full rounded-xl h-12 shadow-md"
                      size="lg"
                    >
                      Start Lesson • +{lesson.signs.length * 10} XP
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Connector Line */}
              {index < lessons.length - 1 && (
                <div className={`h-6 w-1 ${isCompleted ? 'bg-primary' : 'bg-border'} ${index % 2 === 0 ? 'ml-8' : 'ml-auto mr-8'}`} />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedLessons === lessons.length && (
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-xl mb-2">All Lessons Complete!</h3>
          <p className="text-sm text-muted-foreground">
            Great job! Keep practicing to maintain your skills.
          </p>
        </div>
      )}
    </div>
  );
}
