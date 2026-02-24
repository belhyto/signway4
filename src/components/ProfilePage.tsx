import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Edit2,
  Camera,
  Mail,
  Calendar as CalendarIcon,
  Award,
  Users,
  TrendingUp,
  Star,
  Trophy,
  Target,
  Flame,
  CheckCircle2,
  UserPlus,
  Search,
  LogOut
} from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ChallengeCalendar } from './ChallengeCalendar';
import { useLanguage } from './LanguageProvider';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarBgColor: string;
  joinDate: string;
  totalXP: number;
  streak: number;
  lessonsCompleted: number;
  signsLearned: number;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  avatarBgColor: string;
  totalXP: number;
  status: 'online' | 'offline';
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
  const { t } = useLanguage();
  const [editMode, setEditMode] = useState(false);
  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [friendSearch, setFriendSearch] = useState('');

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: 'Rohan Kumar',
    email: 'rohan.kumar@example.com',
    avatar: '👤',
    avatarBgColor: 'bg-blue-500',
    joinDate: '2024-10-15',
    totalXP: 2450,
    streak: 12,
    lessonsCompleted: 18,
    signsLearned: 156,
  });

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '2',
      name: 'Priya Sharma',
      avatar: '👩',
      avatarBgColor: 'bg-pink-500',
      totalXP: 3200,
      status: 'online',
    },
    {
      id: '3',
      name: 'Amit Patel',
      avatar: '👨',
      avatarBgColor: 'bg-green-500',
      totalXP: 1800,
      status: 'offline',
    },
    {
      id: '4',
      name: 'Sneha Reddy',
      avatar: '👧',
      avatarBgColor: 'bg-purple-500',
      totalXP: 2900,
      status: 'online',
    },
  ]);

  const badges: BadgeItem[] = [
    {
      id: '1',
      name: t('badge.firstLesson'),
      description: t('badge.firstLesson.desc'),
      icon: '🎓',
      earned: true,
      earnedDate: '2024-10-16',
    },
    {
      id: '2',
      name: t('badge.weekStreak'),
      description: t('badge.weekStreak.desc'),
      icon: '🔥',
      earned: true,
      earnedDate: '2024-10-22',
    },
    {
      id: '3',
      name: t('badge.hundredSigns'),
      description: t('badge.hundredSigns.desc'),
      icon: '✋',
      earned: true,
      earnedDate: '2024-11-01',
    },
    {
      id: '4',
      name: t('badge.socialButterfly'),
      description: t('badge.socialButterfly.desc'),
      icon: '🦋',
      earned: true,
      earnedDate: '2024-10-25',
    },
    {
      id: '5',
      name: t('badge.perfectScore'),
      description: t('badge.perfectScore.desc'),
      icon: '⭐',
      earned: false,
      progress: 3,
      target: 5,
    },
    {
      id: '6',
      name: t('badge.monthStreak'),
      description: t('badge.monthStreak.desc'),
      icon: '🏆',
      earned: false,
      progress: 12,
      target: 30,
    },
  ];

  const avatarEmojis = [
    '👤', '👨', '👩', '👦', '👧', '🧑', '👴', '👵',
    '😀', '😃', '😄', '😁', '😊', '😇', '🙂', '🤗',
    '🤓', '😎', '🥳', '🤩', '🥰', '😍', '🤪', '😜',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🦁', '🐯', '🐸', '🐵', '🐔', '🐧', '🦉', '🦄',
  ];

  const handleSaveProfile = () => {
    setEditMode(false);
    // Save to backend
  };

  const handleAvatarChange = (emoji: string, color: string) => {
    setUserProfile({ ...userProfile, avatar: emoji, avatarBgColor: color });
    setShowAvatarEditor(false);
  };

  return (
    <div className="h-full overflow-auto pb-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        {/* Profile Header Card */}
        <Card className="border-2">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className={`h-20 w-20 sm:h-24 sm:w-24 rounded-full ${userProfile.avatarBgColor} flex items-center justify-center text-4xl sm:text-5xl shadow-lg`}
                >
                  {userProfile.avatar}
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-lg"
                  onClick={() => setShowAvatarEditor(true)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0 w-full">
                {editMode ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name" className="text-xs sm:text-sm">{t('profile.name')}</Label>
                      <Input
                        id="name"
                        value={userProfile.name}
                        onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs sm:text-sm">{t('profile.email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-xl sm:text-2xl mb-1 truncate">{userProfile.name}</h2>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2 truncate">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      <span className="truncate">{userProfile.email}</span>
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                      {t('profile.memberSince')} {new Date(userProfile.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Edit/Logout Buttons */}
              <div className="w-full sm:w-auto">
                {editMode ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} className="flex-1 sm:flex-initial">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {t('profile.save')}
                    </Button>
                    <Button variant="outline" onClick={() => setEditMode(false)} className="flex-1 sm:flex-initial">
                      {t('profile.cancel')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setEditMode(true)} className="w-full sm:w-auto">
                      <Edit2 className="h-4 w-4 mr-2" />
                      {t('profile.editProfile')}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={onLogout}
                      className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('profile.logout')}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-3 sm:p-4 text-center">
                <div className="flex justify-center mb-2">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div className="text-xl sm:text-2xl mb-1">{userProfile.totalXP}</div>
                <div className="text-xs text-muted-foreground">{t('profile.totalXP')}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-2xl p-3 sm:p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Flame className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                </div>
                <div className="text-xl sm:text-2xl mb-1">{userProfile.streak}</div>
                <div className="text-xs text-muted-foreground">{t('profile.dayStreak')}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-2xl p-3 sm:p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                </div>
                <div className="text-xl sm:text-2xl mb-1">{userProfile.lessonsCompleted}</div>
                <div className="text-xs text-muted-foreground">{t('profile.lessons')}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-2xl p-3 sm:p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Star className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                </div>
                <div className="text-xl sm:text-2xl mb-1">{userProfile.signsLearned}</div>
                <div className="text-xs text-muted-foreground">{t('profile.signs')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Tabs for Badges, Friends, and Challenges */}
      <Tabs defaultValue="badges" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="badges" className="text-sm sm:text-base">
            <Award className="h-4 w-4 mr-2" />
            {t('profile.badges')}
          </TabsTrigger>
          <TabsTrigger value="friends" className="text-sm sm:text-base">
            <Users className="h-4 w-4 mr-2" />
            {t('profile.friends')}
          </TabsTrigger>
          <TabsTrigger value="challenges" className="text-sm sm:text-base">
            <Trophy className="h-4 w-4 mr-2" />
            {t('profile.challenges')}
          </TabsTrigger>
        </TabsList>

        {/* Badges Tab */}
        <TabsContent value="badges" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`${badge.earned ? 'border-2 border-primary/20' : 'opacity-60'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`text-4xl shrink-0 ${!badge.earned && 'grayscale'}`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg mb-1 truncate">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{badge.description}</p>
                        {badge.earned ? (
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-xs text-primary truncate">
                              {t('profile.earnedOn')} {badge.earnedDate && new Date(badge.earnedDate).toLocaleDateString()}
                            </span>
                          </div>
                        ) : badge.progress !== undefined && badge.target !== undefined ? (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{t('profile.progress')}</span>
                              <span className="text-muted-foreground">{badge.progress}/{badge.target}</span>
                            </div>
                            <Progress value={(badge.progress / badge.target) * 100} className="h-2" />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Friends Tab */}
        <TabsContent value="friends" className="space-y-4">
          {/* Add Friend Section */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('profile.searchFriends')}
                    value={friendSearch}
                    onChange={(e) => setFriendSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="shrink-0">
                  <UserPlus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">{t('profile.addFriend')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Friends List */}
          <div className="space-y-3">
            {friends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative shrink-0">
                        <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full ${friend.avatarBgColor} flex items-center justify-center text-2xl sm:text-3xl`}>
                          {friend.avatar}
                        </div>
                        <div className={`absolute bottom-0 right-0 h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-card ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg mb-1 truncate">{friend.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Trophy className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                          <span className="truncate">{friend.totalXP} XP</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="shrink-0">
                        {t('profile.viewProfile')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Challenges Tab */}
        <TabsContent value="challenges">
          <ChallengeCalendar />
        </TabsContent>
      </Tabs>

      {/* Avatar Editor Dialog */}
      <Dialog open={showAvatarEditor} onOpenChange={setShowAvatarEditor}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('profile.chooseAvatar')}</DialogTitle>
            <DialogDescription>
              {t('profile.avatarDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">{t('profile.selectEmoji')}</Label>
              <div className="grid grid-cols-8 gap-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                {avatarEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setUserProfile({ ...userProfile, avatar: emoji })}
                    className={`h-10 w-10 text-2xl hover:scale-110 transition-transform rounded-lg ${userProfile.avatar === emoji ? 'bg-accent ring-2 ring-primary' : 'hover:bg-accent'
                      }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm mb-2 block">{t('profile.selectColor')}</Label>
              <div className="grid grid-cols-9 gap-2">
                {avatarColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setUserProfile({ ...userProfile, avatarBgColor: color })}
                    className={`h-10 w-10 rounded-full ${color} hover:scale-110 transition-transform ${userProfile.avatarBgColor === color ? 'ring-4 ring-primary ring-offset-2' : ''
                      }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <div className={`h-24 w-24 rounded-full ${userProfile.avatarBgColor} flex items-center justify-center text-5xl shadow-xl`}>
                {userProfile.avatar}
              </div>
            </div>
            <Button
              onClick={() => setShowAvatarEditor(false)}
              className="w-full"
            >
              {t('profile.saveAvatar')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
