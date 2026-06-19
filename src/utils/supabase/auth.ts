import supabase from './client';

export type AuthUser = {
  id: string;
  email: string | null;
  full_name?: string | null;
  user_metadata?: Record<string, any>;
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
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = () => supabase.auth.getUser();

export const onAuthStateChange = (callback: (event: string, session: any) => void) =>
  supabase.auth.onAuthStateChange(callback);
