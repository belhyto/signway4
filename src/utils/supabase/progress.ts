import supabase from './client';

export type LearnerProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  max_precision_score?: number;
  is_completed: boolean;
  attempts_count: number;
  last_practiced_at: string;
};

const supabaseAny = supabase as unknown as { from: (...args: any[]) => any };

// ===== PROGRESS QUERIES =====

export const getUserProgress = async (userId: string) => {
  const { data, error } = await supabaseAny
    .from('learner_progress')
    .select('*')
    .eq('user_id', userId)
    .order('last_practiced_at', { ascending: false });

  return { data: data as LearnerProgress[] | null, error };
};

export const getLessonProgress = async (userId: string, lessonId: string) => {
  const { data, error } = await supabaseAny
    .from('learner_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .single();

  return { data: data as LearnerProgress | null, error };
};

export const getCompletedLessons = async (userId: string) => {
  const { data, error } = await supabaseAny
    .from('learner_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('is_completed', true);

  return { data: data as LearnerProgress[] | null, error };
};

export const getInProgressLessons = async (userId: string) => {
  const { data, error } = await supabaseAny
    .from('learner_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('is_completed', false)
    .order('last_practiced_at', { ascending: false });

  return { data: data as LearnerProgress[] | null, error };
};

export const createProgress = async (progress: Omit<LearnerProgress, 'id'>) => {
  const { data, error } = await supabaseAny
    .from('learner_progress')
    .insert([progress])
    .select()
    .single();

  return { data: data as LearnerProgress | null, error };
};

export const updateProgress = async (
  userId: string,
  lessonId: string,
  updates: Partial<LearnerProgress>
) => {
  const { data, error } = await supabaseAny
    .from('learner_progress')
    .update({
      ...updates,
      last_practiced_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .select()
    .single();

  return { data: data as LearnerProgress | null, error };
};

export const updateProgressScore = async (
  userId: string,
  lessonId: string,
  precision_score: number,
  is_completed: boolean = false
) => {
  const { data: existingRes } = await getLessonProgress(userId, lessonId);

  const updatePayload = {
    max_precision_score: existingRes?.max_precision_score
      ? Math.max(existingRes.max_precision_score, precision_score)
      : precision_score,
    attempts_count: (existingRes?.attempts_count || 0) + 1,
    is_completed: is_completed || existingRes?.is_completed || false,
    last_practiced_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAny
    .from('learner_progress')
    .update(updatePayload)
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .select()
    .single();

  return { data: data as LearnerProgress | null, error };
};

export const completeLesson = async (userId: string, lessonId: string) => {
  const { data, error } = await supabaseAny
    .from('learner_progress')
    .update({
      is_completed: true,
      last_practiced_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .select()
    .single();

  return { data: data as LearnerProgress | null, error };
};

export const deleteProgress = async (userId: string, lessonId: string) => {
  const { error } = await supabase
    .from('learner_progress')
    .delete()
    .eq('user_id', userId)
    .eq('lesson_id', lessonId);

  return { error };
};

// ===== ANALYTICS QUERIES =====

export const getUserStats = async (userId: string) => {
  const { data: allProgress, error } = await getUserProgress(userId);

  if (error || !allProgress) {
    return {
      stats: {
        total_lessons_attempted: 0,
        total_lessons_completed: 0,
        total_attempts: 0,
        average_precision_score: 0,
        total_xp_earned: 0,
      },
      error,
    };
  }

  const completedCount = allProgress.filter((p) => p.is_completed).length;
  const totalAttempts = allProgress.reduce((sum, p) => sum + p.attempts_count, 0);
  const avgPrecision =
    allProgress.reduce((sum, p) => sum + (p.max_precision_score || 0), 0) / allProgress.length ||
    0;

  return {
    stats: {
      total_lessons_attempted: allProgress.length,
      total_lessons_completed: completedCount,
      total_attempts: totalAttempts,
      average_precision_score: Math.round(avgPrecision * 100) / 100,
      total_xp_earned: completedCount * 10, // 10 XP per completed lesson
    },
    error: null,
  };
};
