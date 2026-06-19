import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { CheckCircle2, Star, Trophy, Loader } from 'lucide-react';
import { motion } from 'motion/react';
import { getCurrentUser } from '../utils/supabase/auth';
import { getAllLessons, SignLesson } from '../utils/supabase/lessons';
import { getUserProgress, completeLesson } from '../utils/supabase/progress';
import { addXp } from '../utils/supabase/profiles';

interface LessonWithProgress extends SignLesson {
  completed: boolean;
  precision_score?: number;
  attempts_count?: number;
}

export function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const { data: userData, error: userError } = await getCurrentUser();
        if (userError || !userData?.user) {
          setError('Failed to load user');
          return;
        }
        const uid = userData.user.id;
        setUserId(uid);

        // Get all lessons
        const { data: lessonsData, error: lessonsError } = await getAllLessons();
        if (lessonsError || !lessonsData) {
          setError('Failed to load lessons');
          return;
        }

        // Get user progress for these lessons
        const { data: progressData, error: progressError } = await getUserProgress(uid);
        if (progressError) {
          setError('Failed to load progress');
          return;
        }

        // Merge lessons with progress data
        const lessonsWithProgress = lessonsData.map((lesson) => {
          const progress = progressData?.find((p: any) => p.lesson_id === lesson.id);
          return {
            ...lesson,
            completed: progress?.is_completed || false,
            precision_score: progress?.max_precision_score,
            attempts_count: progress?.attempts_count || 0,
          };
        });

        setLessons(lessonsWithProgress);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  const handleLessonStart = async (lessonId: string) => {
    try {
      // Navigate to practice page (this would be handled by parent router)
      // For now, just mark as initiated
      console.log('Starting lesson:', lessonId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLessonComplete = async (lessonId: string) => {
    try {
      if (!userId) return;
      
      const { error } = await completeLesson(userId, lessonId);
      if (error) throw error;

      // Award XP (10 points per lesson)
      await addXp(userId, 100);

      // Update local state
      setLessons(lessons.map((l) => (l.id === lessonId ? { ...l, completed: true } : l)));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const completedLessons = lessons.filter((l) => l.completed).length;
  const progressPercent = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  return (
    <div className="px-4 py-6 space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Header with Progress */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-xl font-semibold">Your Learning Path</h2>
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
        {lessons.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No lessons available yet</p>
          </div>
        ) : (
          lessons.map((lesson, index) => {
            const isCompleted = lesson.completed;
            const isActive = !isCompleted;

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
                    ${
                      isCompleted
                        ? 'border-primary/50 bg-primary/5'
                        : isActive
                          ? 'border-primary hover:border-primary hover:shadow-lg'
                          : 'border-border opacity-60'
                    }
                  `}
                >
                  <button
                    onClick={() =>
                      setSelectedLesson(selectedLesson === lesson.id ? null : lesson.id)
                    }
                    className="w-full text-left flex items-center gap-4"
                  >
                    <div
                      className={`shrink-0 h-16 w-16 rounded-2xl flex items-center justify-center text-2xl shadow-md
                        ${
                          isCompleted
                            ? 'bg-primary text-white'
                            : isActive
                              ? 'bg-secondary text-white'
                              : 'bg-muted text-muted-foreground'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-8 w-8" />
                      ) : (
                        <Star className="h-8 w-8" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold truncate">
                          {lesson.lesson_title}
                        </h3>
                        {isCompleted && (
                          <Badge className="bg-primary text-white">✓</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {lesson.category} • {lesson.difficulty_level}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {lesson.target_pathway}
                        </Badge>
                        {lesson.attempts_count && lesson.attempts_count > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {lesson.attempts_count} attempts
                          </Badge>
                        )}
                      </div>
                    </div>

                    {isActive && (
                      <div className="shrink-0 text-primary">
                        <div className="text-xs font-semibold">START</div>
                        <div className="text-xl">▶</div>
                      </div>
                    )}
                  </button>

                  {selectedLesson === lesson.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-border space-y-4"
                    >
                      <div>
                        <p className="text-sm font-medium mb-2">Lesson Details</p>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p>
                            <strong>Category:</strong> {lesson.category}
                          </p>
                          <p>
                            <strong>Difficulty:</strong> {lesson.difficulty_level}
                          </p>
                          <p>
                            <strong>Target Pathway:</strong> {lesson.target_pathway}
                          </p>
                          {lesson.precision_score && (
                            <p>
                              <strong>Best Score:</strong>{' '}
                              {Math.round(lesson.precision_score * 100)}%
                            </p>
                          )}
                        </div>
                      </div>

                      <Button
                        className="w-full rounded-xl h-12 shadow-md"
                        size="lg"
                        onClick={() => handleLessonStart(lesson.id)}
                      >
                        {isCompleted ? 'Review Lesson' : 'Start Lesson'} • +100 XP
                      </Button>

                      {isActive && (
                        <Button
                          variant="outline"
                          className="w-full rounded-xl"
                          onClick={() => handleLessonComplete(lesson.id)}
                        >
                          Mark as Complete
                        </Button>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Connector Line */}
                {index < lessons.length - 1 && (
                  <div
                    className={`h-6 w-1 ${isCompleted ? 'bg-primary' : 'bg-border'} ${index % 2 === 0 ? 'ml-8' : 'ml-auto mr-8'}`}
                  />
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* Completion Message */}
      {completedLessons === lessons.length && lessons.length > 0 && (
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-6 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h3 className="text-xl font-semibold mb-2">All Lessons Complete!</h3>
          <p className="text-sm text-muted-foreground">Great job! Keep practicing to maintain your skills.</p>
        </div>
      )}
    </div>
  );
}
