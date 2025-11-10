import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Users, 
  MessageSquare, 
  Video, 
  FileText, 
  Coffee,
  Lock,
  CheckCircle2,
  Play,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageProvider';

interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: string;
  completed: boolean;
  locked: boolean;
  progress: number;
}

export function WorkLearningPath() {
  const { t } = useLanguage();
  const [overallProgress] = useState(35);

  const lessons: Lesson[] = [
    {
      id: '1',
      title: t('lesson.work.greetings'),
      description: t('lesson.work.greetings.desc'),
      icon: Users,
      duration: '12 min',
      completed: true,
      locked: false,
      progress: 100
    },
    {
      id: '2',
      title: t('lesson.work.meetings'),
      description: t('lesson.work.meetings.desc'),
      icon: Video,
      duration: '25 min',
      completed: false,
      locked: false,
      progress: 70
    },
    {
      id: '3',
      title: t('lesson.work.email'),
      description: t('lesson.work.email.desc'),
      icon: MessageSquare,
      duration: '18 min',
      completed: false,
      locked: false,
      progress: 0
    },
    {
      id: '4',
      title: t('lesson.work.collaboration'),
      description: t('lesson.work.collaboration.desc'),
      icon: Briefcase,
      duration: '22 min',
      completed: false,
      locked: true,
      progress: 0
    },
    {
      id: '5',
      title: t('lesson.work.presentations'),
      description: t('lesson.work.presentations.desc'),
      icon: FileText,
      duration: '20 min',
      completed: false,
      locked: true,
      progress: 0
    },
    {
      id: '6',
      title: t('lesson.work.social'),
      description: t('lesson.work.social.desc'),
      icon: Coffee,
      duration: '15 min',
      completed: false,
      locked: true,
      progress: 0
    }
  ];

  return (
    <div className="h-full overflow-auto pb-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl p-8 mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <Briefcase className="h-12 w-12" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl mb-2">{t('learningPath.work.title')}</h1>
            <p className="text-purple-100 text-lg">
              {t('learningPath.work.subtitle')}
            </p>
          </div>
        </div>
        
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mt-6">
          <div className="flex justify-between items-center mb-2">
            <span>{t('learningPath.overallProgress')}</span>
            <span className="font-semibold">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3 bg-white/30" />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl text-purple-600 mb-1">6</div>
            <div className="text-sm text-muted-foreground">{t('learningPath.totalLessons')}</div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl text-purple-600 mb-1">1</div>
            <div className="text-sm text-muted-foreground">{t('learningPath.completed')}</div>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl text-purple-600 mb-1">112</div>
            <div className="text-sm text-muted-foreground">{t('learningPath.totalMinutes')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-2xl mb-4">{t('learningPath.yourLessons')}</h2>
        
        {lessons.map((lesson, index) => (
          <motion.div
            key={lesson.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`transition-all hover:shadow-lg ${
                lesson.locked ? 'opacity-60' : 'hover:border-purple-300'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-4 rounded-2xl ${
                    lesson.completed 
                      ? 'bg-green-100 text-green-600' 
                      : lesson.locked 
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {lesson.locked ? (
                      <Lock className="h-6 w-6" />
                    ) : lesson.completed ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <lesson.icon className="h-6 w-6" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl mb-1">{lesson.title}</h3>
                        <p className="text-muted-foreground">{lesson.description}</p>
                      </div>
                      <Badge variant={lesson.completed ? "default" : "secondary"} className="shrink-0">
                        {lesson.duration}
                      </Badge>
                    </div>

                    {/* Progress */}
                    {!lesson.locked && lesson.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">{t('learningPath.overallProgress')}</span>
                          <span className="text-purple-600">{lesson.progress}%</span>
                        </div>
                        <Progress value={lesson.progress} className="h-2" />
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      disabled={lesson.locked}
                      variant={lesson.completed ? "outline" : "default"}
                      className={`w-full sm:w-auto ${
                        !lesson.locked && !lesson.completed ? 'bg-purple-600 hover:bg-purple-700' : ''
                      }`}
                    >
                      {lesson.locked ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          {t('learningPath.locked')}
                        </>
                      ) : lesson.completed ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {t('learningPath.review')}
                        </>
                      ) : lesson.progress > 0 ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          {t('learningPath.continue')}
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          {t('learningPath.startLesson')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tips Section */}
      <Card className="mt-6 border-purple-200 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            {t('tips.work.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>{t('tips.work.1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>{t('tips.work.2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>{t('tips.work.3')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 mt-1">•</span>
              <span>{t('tips.work.4')}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
