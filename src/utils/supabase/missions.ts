import supabase from './client';

export type CooperativeMission = {
  id: string;
  title: string;
  target_xp: number;
  expires_at: string;
  created_at?: string;
};

export type MissionParticipant = {
  mission_id: string;
  user_id: string;
  xp_contributed: number;
  joined_at?: string;
};

export type MissionWithParticipants = CooperativeMission & {
  participants: (MissionParticipant & { profile?: { display_name?: string; avatar_url?: string } })[];
};

const supabaseAny = supabase as unknown as { from: (...args: any[]) => any };

// ===== MISSIONS QUERIES =====

export const getAllMissions = async () => {
  const { data, error } = await supabaseAny
    .from('cooperative_missions')
    .select('*')
    .order('expires_at', { ascending: true });

  return { data: data as CooperativeMission[] | null, error };
};

export const getActiveMissions = async () => {
  const now = new Date().toISOString();
  const { data, error } = await supabaseAny
    .from('cooperative_missions')
    .select('*')
    .gt('expires_at', now)
    .order('expires_at', { ascending: true });

  return { data: data as CooperativeMission[] | null, error };
};

export const getMissionById = async (missionId: string) => {
  const { data, error } = await supabaseAny
    .from('cooperative_missions')
    .select('*')
    .eq('id', missionId)
    .single();

  return { data: data as CooperativeMission | null, error };
};

export const createMission = async (mission: Omit<CooperativeMission, 'id' | 'created_at'>) => {
  const { data, error } = await supabaseAny
    .from('cooperative_missions')
    .insert([mission])
    .select()
    .single();

  return { data: data as CooperativeMission | null, error };
};

export const updateMission = async (missionId: string, updates: Partial<CooperativeMission>) => {
  const { data, error } = await supabaseAny
    .from('cooperative_missions')
    .update(updates)
    .eq('id', missionId)
    .select()
    .single();

  return { data: data as CooperativeMission | null, error };
};

export const deleteMission = async (missionId: string) => {
  const { error } = await supabase.from('cooperative_missions').delete().eq('id', missionId);
  return { error };
};

// ===== MISSION PARTICIPANTS QUERIES =====

export const getMissionParticipants = async (missionId: string) => {
  const { data, error } = await supabaseAny
    .from('mission_participants')
    .select('*, profiles(id, display_name, avatar_url)')
    .eq('mission_id', missionId)
    .order('xp_contributed', { ascending: false });

  return { data: data as (MissionParticipant & { profiles?: any })[] | null, error };
};

export const getUserMissions = async (userId: string) => {
  const { data, error } = await supabaseAny
    .from('mission_participants')
    .select('mission_id, xp_contributed, joined_at')
    .eq('user_id', userId)
    .order('joined_at', { ascending: false });

  return { data, error };
};

export const joinMission = async (missionId: string, userId: string) => {
  const { data, error } = await supabaseAny
    .from('mission_participants')
    .insert([{ mission_id: missionId, user_id: userId, xp_contributed: 0 }])
    .select()
    .single();

  return { data: data as MissionParticipant | null, error };
};

export const isUserInMission = async (missionId: string, userId: string) => {
  const { data, error } = await supabaseAny
    .from('mission_participants')
    .select('user_id')
    .eq('mission_id', missionId)
    .eq('user_id', userId)
    .single();

  return { isParticipant: !!data, error };
};

export const updateMissionProgress = async (
  missionId: string,
  userId: string,
  xpToAdd: number
) => {
  const { data: participant, error: fetchError } = await supabaseAny
    .from('mission_participants')
    .select('xp_contributed')
    .eq('mission_id', missionId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !participant) {
    return { data: null, error: fetchError };
  }

  const newXp = (participant.xp_contributed || 0) + xpToAdd;

  const { data, error } = await supabaseAny
    .from('mission_participants')
    .update({ xp_contributed: newXp })
    .eq('mission_id', missionId)
    .eq('user_id', userId)
    .select()
    .single();

  return { data: data as MissionParticipant | null, error };
};

export const leaveMission = async (missionId: string, userId: string) => {
  const { error } = await supabase
    .from('mission_participants')
    .delete()
    .eq('mission_id', missionId)
    .eq('user_id', userId);

  return { error };
};

// ===== COMBINED QUERIES =====

export const getMissionWithParticipants = async (missionId: string) => {
  const missionRes = await getMissionById(missionId);
  if (missionRes.error || !missionRes.data) {
    return { data: null, error: missionRes.error };
  }

  const participantsRes = await getMissionParticipants(missionId);

  return {
    data: {
      ...missionRes.data,
      participants: participantsRes.data || [],
    } as MissionWithParticipants,
    error: participantsRes.error,
  };
};

// ===== LEADERBOARD QUERIES =====

export const getMissionLeaderboard = async (missionId: string, limit: number = 10) => {
  const { data, error } = await supabaseAny
    .from('mission_participants')
    .select('user_id, xp_contributed, profiles(display_name, avatar_url)')
    .eq('mission_id', missionId)
    .order('xp_contributed', { ascending: false })
    .limit(limit);

  return { data: data as (MissionParticipant & { profiles?: any })[] | null, error };
};

export const getUserMissionStats = async (userId: string) => {
  const { data, error } = await supabaseAny
    .from('mission_participants')
    .select('xp_contributed')
    .eq('user_id', userId);

  if (error || !data) {
    return { stats: { total_missions: 0, total_mission_xp: 0 }, error };
  }

  const totalXp = data.reduce((sum: number, p: any) => sum + (p.xp_contributed || 0), 0);

  return {
    stats: {
      total_missions: data.length,
      total_mission_xp: totalXp,
    },
    error: null,
  };
};
