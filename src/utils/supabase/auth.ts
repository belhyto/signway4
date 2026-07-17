import supabase from './client';
import { upsertProfile } from './profiles';

export type AuthUser = {
  id: string;
  email: string | null;
  full_name?: string | null;
  user_metadata?: Record<string, any>;
};

const ensureUserProfile = async (user: { id: string; email?: string | null; user_metadata?: Record<string, any> } | null | undefined, fullName?: string) => {
  if (!user?.id) return;

  const metadata = (user.user_metadata || {}) as Record<string, any>;
  const displayName = fullName || metadata.full_name || metadata.name || user.email?.split('@')[0] || 'User';
  const fallbackUsername = user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`;
  const username = String(metadata.username || fallbackUsername)
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 24) || `user_${user.id.slice(0, 8)}`;

  await upsertProfile({
    id: user.id,
    username,
    display_name: displayName,
    avatar_url: metadata.avatar_url || '',
    current_pathway: 'school',
    xp_points: 0,
  });
};

export const signUp = async (email: string, password: string, fullName?: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { data, error, needsConfirmation: false };
  }

  if (data.session?.user) {
    await ensureUserProfile(data.user, fullName);
    return { data, error: null, needsConfirmation: false };
  }

  if (data.user) {
    await ensureUserProfile(data.user, fullName);
    return { data, error: null, needsConfirmation: true };
  }

  return { data, error: null, needsConfirmation: false };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (!error && data.user) {
    await ensureUserProfile(data.user);
  }

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (sessionData?.session?.user) {
    return { data: { user: sessionData.session.user }, error: null };
  }

  return supabase.auth.getUser();
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) =>
  supabase.auth.onAuthStateChange(callback);
