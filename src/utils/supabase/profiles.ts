import supabase from './client';
import { getUserStats as getLearnerStats } from './progress';
import { getUserMissionStats } from './missions';

export type Profile = {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  current_pathway: 'school' | 'home' | 'work';
  xp_points: number;
  created_at?: string;
};

export type UserStats = {
  profile: Profile;
  learner_stats: {
    total_lessons_attempted: number;
    total_lessons_completed: number;
    total_attempts: number;
    average_precision_score: number;
    total_xp_earned: number;
  };
  mission_stats: {
    total_missions: number;
    total_mission_xp: number;
  };
};

const supabaseAny = supabase as unknown as { from: (...args: any[]) => any };

// ===== PROFILES QUERIES =====

export const getProfile = async (userId: string) => {
  const { data, error } = await supabaseAny
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data: data as Profile | null, error };
};

export const getProfileByUsername = async (username: string) => {
  const { data, error } = await supabaseAny
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single();

  return { data: data as Profile | null, error };
};

export const createProfile = async (profile: Omit<Profile, 'created_at'>) => {
  const { data, error } = await supabaseAny
    .from('profiles')
    .insert([profile])
    .select()
    .single();

  return { data: data as Profile | null, error };
};

export const upsertProfile = async (profile: Profile) => {
  const { data, error } = await supabaseAny
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single();

  return { data: data as Profile | null, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabaseAny
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data: data as Profile | null, error };
};

export const updatePathway = async (userId: string, pathway: 'school' | 'home' | 'work') => {
  const { data, error } = await supabaseAny
    .from('profiles')
    .update({ current_pathway: pathway })
    .eq('id', userId)
    .select()
    .single();

  return { data: data as Profile | null, error };
};

export const addXp = async (userId: string, xpAmount: number) => {
  const { data: profile, error: fetchError } = await getProfile(userId);

  if (fetchError || !profile) {
    return { data: null, error: fetchError };
  }

  const newXp = (profile.xp_points || 0) + xpAmount;

  const { data, error } = await supabaseAny
    .from('profiles')
    .update({ xp_points: newXp })
    .eq('id', userId)
    .select()
    .single();

  return { data: data as Profile | null, error };
};

export const getLeaderboard = async (limit: number = 10) => {
  const { data, error } = await supabaseAny
    .from('profiles')
    .select('id, username, display_name, avatar_url, xp_points')
    .order('xp_points', { ascending: false })
    .limit(limit);

  return { data: data as Profile[] | null, error };
};

export const getLeaderboardByPathway = async (
  pathway: 'school' | 'home' | 'work',
  limit: number = 10
) => {
  const { data, error } = await supabaseAny
    .from('profiles')
    .select('id, username, display_name, avatar_url, xp_points')
    .eq('current_pathway', pathway)
    .order('xp_points', { ascending: false })
    .limit(limit);

  return { data: data as Profile[] | null, error };
};

export const deleteProfile = async (userId: string) => {
  const { error } = await supabase.from('profiles').delete().eq('id', userId);
  return { error };
};

// ===== COMBINED STATS QUERIES =====

export const getUserFullStats = async (userId: string): Promise<{ data: UserStats | null; error: any }> => {
  const profileRes = await getProfile(userId);
  if (profileRes.error || !profileRes.data) {
    return { data: null, error: profileRes.error };
  }

  const learnerRes = await getLearnerStats(userId);
  const missionRes = await getUserMissionStats(userId);

  return {
    data: {
      profile: profileRes.data,
      learner_stats: learnerRes.stats,
      mission_stats: missionRes.stats,
    },
    error: null,
  };
};

