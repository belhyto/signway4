import supabase from './client';

export type SignLesson = {
  id: string;
  lesson_title: string;
  category: 'NCERT_Math' | 'NCERT_Science' | 'Professional_HR' | 'Daily_Greetings';
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced';
  target_pathway: 'school' | 'home' | 'work';
  reference_avatar_url?: string;
  created_at?: string;
};

export type SignLandmark = {
  id: string;
  lesson_id: string;
  frame_index: number;
  landmarks: Record<string, any>; // JSONB: { "hands": [...], "face": [...], etc }
  optical_weight?: number;
};

const supabaseAny = supabase as unknown as { from: (...args: any[]) => any };

// ===== LESSONS QUERIES =====

export const getAllLessons = async () => {
  const { data, error } = await supabaseAny
    .from('sign_lessons')
    .select('*')
    .order('created_at', { ascending: false });

  return { data: data as SignLesson[] | null, error };
};

export const getLessonsByPathway = async (pathway: 'school' | 'home' | 'work') => {
  const { data, error } = await supabaseAny
    .from('sign_lessons')
    .select('*')
    .eq('target_pathway', pathway)
    .order('difficulty_level', { ascending: true });

  return { data: data as SignLesson[] | null, error };
};

export const getLessonsByCategory = async (category: string) => {
  const { data, error } = await supabaseAny
    .from('sign_lessons')
    .select('*')
    .eq('category', category)
    .order('difficulty_level', { ascending: true });

  return { data: data as SignLesson[] | null, error };
};

export const getLessonById = async (lessonId: string) => {
  const { data, error } = await supabaseAny
    .from('sign_lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  return { data: data as SignLesson | null, error };
};

export const createLesson = async (lesson: Omit<SignLesson, 'id' | 'created_at'>) => {
  const { data, error } = await supabaseAny
    .from('sign_lessons')
    .insert([lesson])
    .select()
    .single();

  return { data: data as SignLesson | null, error };
};

export const updateLesson = async (lessonId: string, updates: Partial<SignLesson>) => {
  const { data, error } = await supabaseAny
    .from('sign_lessons')
    .update(updates)
    .eq('id', lessonId)
    .select()
    .single();

  return { data: data as SignLesson | null, error };
};

export const deleteLesson = async (lessonId: string) => {
  const { error } = await supabase.from('sign_lessons').delete().eq('id', lessonId);
  return { error };
};

// ===== LANDMARKS QUERIES =====

export const getLandmarksByLesson = async (lessonId: string) => {
  const { data, error } = await supabaseAny
    .from('sign_landmarks')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('frame_index', { ascending: true });

  return { data: data as SignLandmark[] | null, error };
};

export const getLandmarksByFrame = async (lessonId: string, frameIndex: number) => {
  const { data, error } = await supabaseAny
    .from('sign_landmarks')
    .select('*')
    .eq('lesson_id', lessonId)
    .eq('frame_index', frameIndex)
    .single();

  return { data: data as SignLandmark | null, error };
};

export const createLandmark = async (landmark: Omit<SignLandmark, 'id'>) => {
  const { data, error } = await supabaseAny
    .from('sign_landmarks')
    .insert([landmark])
    .select()
    .single();

  return { data: data as SignLandmark | null, error };
};

export const createLandmarksBatch = async (landmarks: Omit<SignLandmark, 'id'>[]) => {
  const { data, error } = await supabaseAny
    .from('sign_landmarks')
    .insert(landmarks)
    .select();

  return { data: data as SignLandmark[] | null, error };
};

export const updateLandmark = async (landmarkId: string, updates: Partial<SignLandmark>) => {
  const { data, error } = await supabaseAny
    .from('sign_landmarks')
    .update(updates)
    .eq('id', landmarkId)
    .select()
    .single();

  return { data: data as SignLandmark | null, error };
};

export const deleteLandmark = async (landmarkId: string) => {
  const { error } = await supabase.from('sign_landmarks').delete().eq('id', landmarkId);
  return { error };
};

export const deleteLandmarksByLesson = async (lessonId: string) => {
  const { error } = await supabase
    .from('sign_landmarks')
    .delete()
    .eq('lesson_id', lessonId);
  return { error };
};

// ===== COMBINED QUERIES =====

export const getLessonWithLandmarks = async (lessonId: string) => {
  const lessonRes = await getLessonById(lessonId);
  if (lessonRes.error || !lessonRes.data) {
    return { data: null, error: lessonRes.error };
  }

  const landmarksRes = await getLandmarksByLesson(lessonId);
  return {
    data: {
      lesson: lessonRes.data,
      landmarks: landmarksRes.data || [],
    },
    error: landmarksRes.error,
  };
};
