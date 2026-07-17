import { useState, useEffect } from 'react';
import {
  Edit2,
  Camera,
  Award,
  Users,
  TrendingUp,
  Star,
  Target,
  Flame,
  CheckCircle2,
  UserPlus,
  Search,
  Loader,
  LogOut,
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { getCurrentUser } from '../utils/supabase/auth';
import {
  updateProfile,
  getUserFullStats,
  type Profile,
} from '../utils/supabase/profiles';
import {
  getAcceptedFriends,
  getPendingFriendRequests,
  searchProfiles,
  sendFriendRequest,
  type FriendProfile,
} from '../utils/supabase/social';
import { createProfile } from '../utils/supabase/profiles';

interface UserStats {
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
}

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  target?: number;
}

const avatarColors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
];

interface ProfilePageProps {
  onLogout?: () => void;
}

export function ProfilePage({ onLogout }: ProfilePageProps) {
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [friendSearch, setFriendSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string>('');
  const [authUser, setAuthUser] = useState<{
    id?: string;
    email?: string | null;
    user_metadata?: Record<string, any>;
  } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [friendResults, setFriendResults] = useState<FriendProfile[]>([]);

  const [activeTab, setActiveTab] = useState<'overview' | 'edit' | 'social' | 'badges'>('overview');

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: userError } = await getCurrentUser();
      if (userError || !userData?.user) {
        console.error('ProfilePage: getCurrentUser failed', userError);
        const message = userError?.message || 'Unable to load your session. Please try signing in again.';
        setError(message);
        return;
      }

      const uid = userData.user.id;
      setUserId(uid);
      setAuthUser(userData.user);

      let statsData = null;
      let statsError = null;

      try {
        const result = await getUserFullStats(uid);
        statsData = result.data;
        statsError = result.error;
      } catch (err) {
        console.error('ProfilePage: getUserFullStats threw', err);
        statsError = err;
      }

      if ((statsError || !statsData) && statsError?.code === 'PGRST116') {
        console.warn('ProfilePage: profile row missing for user, creating default profile', uid);
        const metadata = (userData.user.user_metadata || {}) as Record<string, any>;
        const displayName =
          metadata.full_name || metadata.name || userData.user.email?.split('@')[0] || 'User';

        const { data: created, error: createError } = await createProfile({
          id: uid,
          username: userData.user.email?.split('@')[0] || `user_${uid.slice(0, 8)}`,
          display_name: displayName,
          avatar_url: '',
          current_pathway: 'school',
          xp_points: 0,
        });

        if (createError || !created) {
          console.error('ProfilePage: failed to create profile', createError);
          setError(createError?.message || 'Failed to create profile');
          setLoading(false);
          return;
        }

        try {
          const retry = await getUserFullStats(uid);
          statsData = retry.data;
          statsError = retry.error;
        } catch (retryErr) {
          console.error('ProfilePage: getUserFullStats retry threw', retryErr);
          statsError = retryErr;
        }
      }

      if (statsError || !statsData) {
        console.error('ProfilePage: getUserFullStats failed', statsError);
        setError(statsError?.message || 'Failed to load profile stats');
        setLoading(false);
        return;
      }

      setProfile(statsData.profile);
      setStats(statsData);

      let friendsData: FriendProfile[] | null = null;
      let friendsError: any = null;
      try {
        const res = await getAcceptedFriends(uid);
        friendsData = res.data;
        friendsError = res.error;
      } catch (err) {
        console.error('ProfilePage: getAcceptedFriends threw', err);
      }
      if (!friendsError && friendsData) {
        setFriends(friendsData);
      }

      try {
        await getPendingFriendRequests(uid);
      } catch (err) {
        console.error('ProfilePage: getPendingFriendRequests threw', err);
      }
    } catch (err: any) {
      console.error('ProfilePage: loadProfileData unexpected error', err);
      setError(err?.message || 'Unexpected error loading profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const badges: BadgeItem[] = [
    {
      id: '1',
      name: 'First Lesson',
      description: 'Complete your first lesson',
      icon: '🎓',
      earned: stats ? stats.learner_stats.total_lessons_completed >= 1 : false,
    },
    {
      id: '2',
      name: 'Quick Learner',
      description: 'Complete 5 lessons',
      icon: '⚡',
      earned: stats ? stats.learner_stats.total_lessons_completed >= 5 : false,
      progress: stats?.learner_stats.total_lessons_completed || 0,
      target: 5,
    },
    {
      id: '3',
      name: 'Master',
      description: 'Complete 20 lessons',
      icon: '🏆',
      earned: stats ? stats.learner_stats.total_lessons_completed >= 20 : false,
      progress: stats?.learner_stats.total_lessons_completed || 0,
      target: 20,
    },
    {
      id: '4',
      name: 'Social Butterfly',
      description: 'Add 5 friends',
      icon: '🦋',
      earned: friends.length >= 5,
      progress: friends.length,
      target: 5,
    },
    {
      id: '5',
      name: 'Perfect Score',
      description: 'Achieve 95%+ precision',
      icon: '⭐',
      earned: stats
        ? stats.learner_stats.average_precision_score >= 95
        : false,
    },
    {
      id: '6',
      name: 'Mission Accomplished',
      description: 'Complete 3 missions',
      icon: '🚀',
      earned: stats ? stats.mission_stats.total_missions >= 3 : false,
      progress: stats?.mission_stats.total_missions || 0,
      target: 3,
    },
    {
      id: '7',
      name: 'XP Hunter',
      description: 'Earn 500 XP',
      icon: '💎',
      earned: stats ? stats.learner_stats.total_xp_earned >= 500 : false,
      progress: stats?.learner_stats.total_xp_earned || 0,
      target: 500,
    },
  ];

  const avatarEmojis = [
    '👤', '👨', '👩', '👦', '👧', '🧑', '👴', '👵',
    '😀', '😃', '😄', '😁', '😊', '😇', '🙂', '🤗',
    '🤓', '😎', '🥳', '🤩', '🥰', '😍', '🤪', '😜',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🦁', '🐯', '🐸', '🐵', '🐔', '🐧', '🦉', '🦄',
  ];

  const displayName = profile?.display_name || authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || authUser?.email?.split('@')[0] || 'Unnamed User';
  const emailAddress = authUser?.email || 'No email on file';
  const usernameValue = profile?.username || authUser?.email?.split('@')[0] || 'user';

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    setError(null);

    try {
      const { error: updateError } = await updateProfile(userId, {
        display_name: profile.display_name,
        avatar_url: profile.avatar_url,
        current_pathway: profile.current_pathway,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setActiveTab('overview');
      await loadProfileData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSearchFriends = async () => {
    if (!friendSearch.trim()) {
      setFriendResults([]);
      return;
    }

    try {
      const { data, error: searchError } = await searchProfiles(friendSearch);
      if (searchError) {
        setError(searchError.message);
        return;
      }

      setFriendResults(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSendFriendRequest = async (receiverId: string) => {
    if (!userId) {
      setError('Unable to determine current user');
      return;
    }

    try {
      const { error: requestError } = await sendFriendRequest(userId, receiverId);
      if (requestError) {
        setError(requestError.message);
        return;
      }

      setFriendSearch('');
      setFriendResults([]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile || !stats) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-medium text-destructive">Failed to load profile</p>
        <p className="text-sm text-muted-foreground">
          {error || 'We couldn’t load your profile. Please try signing out and back in.'}
        </p>
        {onLogout && (
          <Button variant="destructive" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="space-y-6">
        {error && (
          <div className="rounded-lg border border-red-500/60 bg-red-500/10 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <Card>
          <CardContent className="grid gap-6 p-6 md:grid-cols-[160px_1fr]">
            <div className="flex flex-col items-center gap-4 md:items-start">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full bg-muted">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-4xl">👤</span>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
                  onClick={() => setShowAvatarEditor(true)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1 text-center md:text-left">
                <h2 className="text-xl font-bold tracking-tight">{displayName}</h2>
                <p className="text-sm text-muted-foreground">@{usernameValue}</p>
                <p className="text-sm text-muted-foreground">{emailAddress}</p>
              </div>
            </div>

            <div className="grid gap-4">
              {activeTab === 'edit' ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      value={profile.display_name || ''}
                      onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pathway">Pathway</Label>
                    <select
                      id="pathway"
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                      value={profile.current_pathway}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          current_pathway: e.target.value as Profile['current_pathway'],
                        })
                      }
                    >
                      <option value="school">School</option>
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Display Name</p>
                    <p className="text-base font-semibold">{profile.display_name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pathway</p>
                    <p className="text-base font-semibold">{profile.current_pathway}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="mx-auto mb-2 h-5 w-5 text-primary" />
                    <p className="text-2xl font-bold">{stats.learner_stats.total_xp_earned}</p>
                    <p className="text-xs text-muted-foreground">Total XP</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                  <CardContent className="p-4 text-center">
                    <Flame className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                    <p className="text-2xl font-bold">-</p>
                    <p className="text-xs text-muted-foreground">Streak</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5">
                  <CardContent className="p-4 text-center">
                    <Target className="mx-auto mb-2 h-5 w-5 text-green-500" />
                    <p className="text-2xl font-bold">{stats.learner_stats.total_lessons_completed}</p>
                    <p className="text-xs text-muted-foreground">Lessons</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5">
                  <CardContent className="p-4 text-center">
                    <Star className="mx-auto mb-2 h-5 w-5 text-purple-500" />
                    <p className="text-2xl font-bold">{stats.learner_stats.average_precision_score.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Precision</p>
                  </CardContent>
                </Card>
              </div>

              {activeTab === 'edit' ? (
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('overview')}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setActiveTab('edit')}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'overview' | 'edit' | 'social' | 'badges')}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="social">
              <Users className="mr-2 h-4 w-4" />
              Friends ({friends.length})
            </TabsTrigger>
            <TabsTrigger value="badges">
              <Award className="mr-2 h-4 w-4" />
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardContent className="grid grid-cols-2 gap-4 p-6 md:grid-cols-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{stats.mission_stats.total_missions}</p>
                  <p className="text-sm text-muted-foreground">Missions</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{stats.mission_stats.total_mission_xp}</p>
                  <p className="text-sm text-muted-foreground">Mission XP</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{stats.learner_stats.total_lessons_attempted}</p>
                  <p className="text-sm text-muted-foreground">Lessons Attempted</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{stats.learner_stats.total_attempts}</p>
                  <p className="text-sm text-muted-foreground">Total Attempts</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search users..."
                value={friendSearch}
                onChange={(e) => setFriendSearch(e.target.value)}
                className="rounded-xl"
              />
              <Button onClick={handleSearchFriends} variant="secondary">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {friendResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Search Results:</p>
                {friendResults.map((user) => (
                  <div key={user.id} className="flex items-center justify-between rounded-lg bg-muted p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{user.display_name || user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.xp_points} XP</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleSendFriendRequest(user.id)}>
                      <UserPlus className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {friends.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Users className="mb-2 h-8 w-8 opacity-50" />
                  <p>No friends yet. Search to add some!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-2">
                {friends.map((friend) => (
                  <Card key={friend.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary text-white flex items-center justify-center">
                          {friend.avatar_url ? (
                            <img src={friend.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
                          ) : (
                            '👤'
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{friend.display_name || friend.username}</p>
                          <p className="text-xs text-muted-foreground">{friend.xp_points} XP</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {badges.map((badge) => (
                <Card key={badge.id} className={badge.earned ? 'border-primary/40' : 'opacity-60'}>
                  <CardContent className="flex flex-col items-center p-4 text-center">
                    <span className="mb-2 text-3xl">{badge.icon}</span>
                    <p className="text-sm font-semibold">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                    {badge.progress !== undefined && badge.target !== undefined && (
                      <div className="mt-2 w-full">
                        <Progress value={(badge.progress / badge.target) * 100} className="h-1" />
                        <p className="mt-1 text-xs text-muted-foreground">
                          {badge.progress} / {badge.target}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showAvatarEditor} onOpenChange={setShowAvatarEditor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Avatar</DialogTitle>
            <DialogDescription>Select an emoji and background color for your profile.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Emoji</Label>
              <div className="grid max-h-52 grid-cols-8 gap-2 overflow-y-auto rounded-lg border p-2">
                {avatarEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setProfile({ ...profile, avatar_url: emoji })}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-transform hover:scale-110 ${
                      profile.avatar_url === emoji ? 'bg-accent ring-2 ring-primary' : 'hover:bg-accent'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Background</Label>
              <div className="grid grid-cols-9 gap-2">
                {avatarColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setProfile({ ...profile, avatar_url: color })}
                    className={`h-10 w-10 rounded-full transition-transform hover:scale-110 ${
                      profile.avatar_url === color ? 'ring-4 ring-primary ring-offset-2' : ''
                    } ${color}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <div
                className={`flex h-24 w-24 items-center justify-center rounded-full text-5xl shadow-xl ${
                  avatarColors.find((c) => c === profile.avatar_url) || 'bg-muted'
                }`}
              >
                {(profile.avatar_url && avatarEmojis.includes(profile.avatar_url))
                  ? profile.avatar_url
                  : '👤'}
              </div>
            </div>

            <Button className="w-full" onClick={() => setShowAvatarEditor(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-6 flex justify-end">
        <Button variant="destructive" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
