import supabase from './client';

export type Friendship = {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  updated_at: string;
};

export type FriendProfile = {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  xp_points: number;
};

const supabaseAny = supabase as unknown as { from: (...args: any[]) => any };

// ===== FRIENDSHIPS QUERIES =====

export const getAcceptedFriends = async (userId: string) => {
  const { data, error } = await supabaseAny
    .from('friendships')
    .select(
      `
      id,
      requester_id,
      receiver_id,
      receiver_id.id,
      requester_id.id
    `
    )
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq('status', 'accepted');

  // Parse response to get friend IDs
  const friendIds = data
    ?.map((f: any) => (f.requester_id === userId ? f.receiver_id : f.requester_id))
    .filter((id: string) => id && id !== userId);

  if (!friendIds || friendIds.length === 0) {
    return { data: [], error };
  }

  // Fetch friend profiles
  const { data: profiles, error: profileError } = await supabaseAny
    .from('profiles')
    .select('id, username, display_name, avatar_url, xp_points')
    .in('id', friendIds);

  return { data: profiles as FriendProfile[] | null, error: profileError };
};

export const getPendingFriendRequests = async (userId: string) => {
  const { data, error } = await supabaseAny
    .from('friendships')
    .select('*, requester:requester_id(id, username, display_name, avatar_url, xp_points)')
    .eq('receiver_id', userId)
    .eq('status', 'pending');

  return { data: data as (Friendship & { requester?: FriendProfile })[] | null, error };
};

export const getSentFriendRequests = async (userId: string) => {
  const { data, error } = await supabaseAny
    .from('friendships')
    .select('*, receiver:receiver_id(id, username, display_name, avatar_url, xp_points)')
    .eq('requester_id', userId)
    .eq('status', 'pending');

  return { data: data as (Friendship & { receiver?: FriendProfile })[] | null, error };
};

export const searchProfiles = async (query: string) => {
  const { data, error } = await supabaseAny
    .from('profiles')
    .select('id, username, display_name, avatar_url, xp_points')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .limit(20);

  return { data: data as FriendProfile[] | null, error };
};

export const sendFriendRequest = async (senderId: string, receiverId: string) => {
  // Check if friendship already exists
  const { data: existing } = await supabaseAny
    .from('friendships')
    .select('id')
    .or(
      `and(requester_id.eq.${senderId},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${senderId})`
    );

  if (existing && existing.length > 0) {
    return { data: null, error: new Error('Friendship request already exists') };
  }

  const { data, error } = await supabaseAny
    .from('friendships')
    .insert([{ requester_id: senderId, receiver_id: receiverId, status: 'pending' }])
    .select()
    .single();

  return { data: data as Friendship | null, error };
};

export const acceptFriendRequest = async (friendshipId: string) => {
  const { data, error } = await supabaseAny
    .from('friendships')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', friendshipId)
    .select()
    .single();

  return { data: data as Friendship | null, error };
};

export const rejectFriendRequest = async (friendshipId: string) => {
  const { error } = await supabase.from('friendships').delete().eq('id', friendshipId);
  return { error };
};

export const blockUser = async (userId: string, blockUserId: string) => {
  const { data, error } = await supabaseAny
    .from('friendships')
    .upsert(
      [{ requester_id: userId, receiver_id: blockUserId, status: 'blocked' }],
      { onConflict: 'requester_id,receiver_id' }
    )
    .select()
    .single();

  return { data: data as Friendship | null, error };
};

export const unblockUser = async (friendshipId: string) => {
  const { error } = await supabase.from('friendships').delete().eq('id', friendshipId);
  return { error };
};

export const removeFriend = async (friendshipId: string) => {
  const { error } = await supabase.from('friendships').delete().eq('id', friendshipId);
  return { error };
};
