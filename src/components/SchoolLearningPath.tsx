import { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  GraduationCap,
  Users,
  Pencil,
  Calendar,
  Trophy,
  Lock,
  CheckCircle2,
  Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { useLanguage } from './LanguageProvider';
import { ARSignLearning, Sign } from './ARSignLearning';

interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: any;
  duration: string;
  completed: boolean;
  locked: boolean;
  progress: number;
  signs: Sign[];
}

export function SchoolLearningPath() {
  const { t } = useLanguage();
  const [overallProgress] = useState(25);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const lessons: Lesson[] = [
    {
      id: '1',
      title: t('lesson.school.classroomBasics'),
      description: t('lesson.school.classroomBasics.desc'),
      icon: BookOpen,
      duration: '15 min',
      completed: true,
      locked: false,
      progress: 100,
      signs: [
        { id: 's1', word: 'Teacher', description: 'Person who teaches in school', tips: 'Point to yourself then make teaching gesture' },
        { id: 's2', word: 'Student', description: 'Person who learns in school', tips: 'Point to yourself then make learning gesture' },
        { id: 's3', word: 'Desk', description: 'Table where students sit', tips: 'Form flat surface with hands' },
        { id: 's4', word: 'Chair', description: 'Seat for sitting', tips: 'Show sitting position with hands' },
        { id: 's5', word: 'Board', description: 'Writing surface in classroom', tips: 'Draw rectangle in air' },
        { id: 's6', word: 'Book', description: 'Reading material', tips: 'Open palms like opening a book' },
        { id: 's7', word: 'Pen', description: 'Writing instrument', tips: 'Mime writing motion' },
        { id: 's8', word: 'Pencil', description: 'Drawing/writing tool', tips: 'Mime writing with eraser end' },
        { id: 's9', word: 'Eraser', description: 'Tool to remove marks', tips: 'Rubbing motion on palm' },
        { id: 's10', word: 'Notebook', description: 'Book for writing notes', tips: 'Show spiral binding motion' },
        { id: 's11', word: 'Classroom', description: 'Room where teaching happens', tips: 'Show room boundaries with hands' },
        { id: 's12', word: 'Homework', description: 'Work done at home', tips: 'House sign then work sign' },
      ]
    },
    {
      id: '2',
      title: t('lesson.school.subjects'),
      description: t('lesson.school.subjects.desc'),
      icon: GraduationCap,
      duration: '20 min',
      completed: false,
      locked: false,
      progress: 60,
      signs: [
        { id: 's13', word: 'Math', description: 'Mathematics subject', tips: 'Make multiplication sign with fingers' },
        { id: 's14', word: 'Science', description: 'Study of natural world', tips: 'Pour liquid gesture (chemistry)' },
        { id: 's15', word: 'History', description: 'Study of past events', tips: 'Look backward gesture' },
        { id: 's16', word: 'English', description: 'Language subject', tips: 'Point to mouth then make letter E' },
        { id: 's17', word: 'Geography', description: 'Study of Earth', tips: 'Draw globe shape with hands' },
        { id: 's18', word: 'Art', description: 'Creative subject', tips: 'Painting brush motion' },
        { id: 's19', word: 'Music', description: 'Sound and rhythm subject', tips: 'Conducting motion' },
        { id: 's20', word: 'Physical Education', description: 'Exercise and sports', tips: 'Running motion' },
        { id: 's21', word: 'Computer', description: 'Technology subject', tips: 'Typing motion' },
        { id: 's22', word: 'Language', description: 'Communication subject', tips: 'Speaking gesture' },
      ]
    },
    {
      id: '3',
      title: t('lesson.school.interaction'),
      description: t('lesson.school.interaction.desc'),
      icon: Users,
      duration: '25 min',
      completed: false,
      locked: false,
      progress: 0,
      signs: [
        { id: 's23', word: 'Question', description: 'Asking for information', tips: 'Questioning expression with hand' },
        { id: 's24', word: 'Answer', description: 'Providing information', tips: 'Open palm presenting gesture' },
        { id: 's25', word: 'Help', description: 'Assistance needed', tips: 'Raise hand high' },
        { id: 's26', word: 'Understand', description: 'Comprehension achieved', tips: 'Tap head with understanding nod' },
        { id: 's27', word: 'Confused', description: 'Not understanding', tips: 'Puzzled expression with hands' },
        { id: 's28', word: 'Explain', description: 'Clarify information', tips: 'Spreading hands outward' },
        { id: 's29', word: 'Listen', description: 'Pay attention to sound', tips: 'Cup hand behind ear' },
        { id: 's30', word: 'Read', description: 'Look at written words', tips: 'Eyes moving across page' },
        { id: 's31', word: 'Write', description: 'Put words on paper', tips: 'Writing motion' },
        { id: 's32', word: 'Speak', description: 'Use voice to communicate', tips: 'Point to mouth' },
      ]
    },
    {
      id: '4',
      title: t('lesson.school.activities'),
      description: t('lesson.school.activities.desc'),
      icon: Trophy,
      duration: '18 min',
      completed: false,
      locked: true,
      progress: 0,
      signs: [
        { id: 's33', word: 'Sports', description: 'Physical activities', tips: 'Athletic motion' },
        { id: 's34', word: 'Lunch', description: 'Midday meal', tips: 'Eating gesture' },
        { id: 's35', word: 'Recess', description: 'Break time', tips: 'Playing gesture' },
        { id: 's36', word: 'Assembly', description: 'School gathering', tips: 'Group gathering motion' },
        { id: 's37', word: 'Library', description: 'Book room', tips: 'Book shelves gesture' },
        { id: 's38', word: 'Playground', description: 'Outdoor play area', tips: 'Swinging motion' },
      ]
    },
    {
      id: '5',
      title: t('lesson.school.homework'),
      description: t('lesson.school.homework.desc'),
      icon: Pencil,
      duration: '22 min',
      completed: false,
      locked: true,
      progress: 0,
      signs: [
        { id: 's39', word: 'Assignment', description: 'Given task', tips: 'Handing over gesture' },
        { id: 's40', word: 'Test', description: 'Examination', tips: 'Paper and pencil gesture' },
        { id: 's41', word: 'Study', description: 'Learn material', tips: 'Reading and thinking gesture' },
        { id: 's42', word: 'Grade', description: 'Score or mark', tips: 'Letter grade gesture' },
        { id: 's43', word: 'Project', description: 'Extended assignment', tips: 'Building gesture' },
        { id: 's44', word: 'Report', description: 'Written account', tips: 'Writing document gesture' },
      ]
    },
    {
      id: '6',
      title: t('lesson.school.events'),
      description: t('lesson.school.events.desc'),
      icon: Calendar,
      duration: '20 min',
      completed: false,
      locked: true,
      progress: 0,
      signs: [
        { id: 's45', word: 'Exam', description: 'Major test', tips: 'Serious testing gesture' },
        { id: 's46', word: 'Holiday', description: 'Day off from school', tips: 'Celebration gesture' },
        { id: 's47', word: 'Meeting', description: 'Gathering to discuss', tips: 'People coming together' },
        { id: 's48', word: 'Graduation', description: 'Completion ceremony', tips: 'Cap throwing gesture' },
        { id: 's49', word: 'Field Trip', description: 'Educational outing', tips: 'Bus and walking gesture' },
        { id: 's50', word: 'Annual Day', description: 'Yearly celebration', tips: 'Stage performance gesture' },
      ]
    }
  ];

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.locked) {
      setSelectedLesson(lesson);
    }
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  const handleLessonComplete = () => {
    // Handle lesson completion
    setSelectedLesson(null);
    // Could update progress here
  };

  // If a lesson is selected, show the AR sign learning view
  if (selectedLesson) {
    return (
      <ARSignLearning
        lessonTitle={selectedLesson.title}
        signs={selectedLesson.signs}
        onBack={handleBackToLessons}
        onComplete={handleLessonComplete}
      />
    );
  }

  // Otherwise show the lesson list
  return (
    <div className="h-full overflow-auto pb-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl p-8 mb-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
            <GraduationCap className="h-12 w-12" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl mb-2">{t('learningPath.school.title')}</h1>
            <p className="text-blue-100 text-lg">
              {t('learningPath.school.subtitle')}
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
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl text-blue-600 mb-1">6</div>
            <div className="text-sm text-muted-foreground">{t('learningPath.totalLessons')}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl text-blue-600 mb-1">1</div>
            <div className="text-sm text-muted-foreground">{t('learningPath.completed')}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 text-center">
            <div className="text-3xl text-blue-600 mb-1">120</div>
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
              className={`transition-all hover:shadow-lg ${lesson.locked ? 'opacity-60' : 'hover:border-blue-300'
                }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-4 rounded-2xl ${lesson.completed
                      ? 'bg-green-100 text-green-600'
                      : lesson.locked
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-blue-100 text-blue-600'
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
                        {!lesson.locked && (
                          <p className="text-sm text-blue-600 mt-1">
                            {lesson.signs.length} signs to learn
                          </p>
                        )}
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
                          <span className="text-blue-600">{lesson.progress}%</span>
                        </div>
                        <Progress value={lesson.progress} className="h-2" />
                      </div>
                    )}

                    {/* Action Button */}
                    <Button
                      disabled={lesson.locked}
                      onClick={() => handleLessonClick(lesson)}
                      variant={lesson.completed ? "outline" : "default"}
                      className={`w-full sm:w-auto ${!lesson.locked && !lesson.completed ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''
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
      <Card className="mt-6 border-blue-200 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            {t('tips.school.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>{t('tips.school.1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>{t('tips.school.2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>{t('tips.school.3')}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
