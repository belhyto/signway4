import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Camera, CameraOff, Volume2, VolumeX, RotateCcw, Play, Pause, ChevronRight } from 'lucide-react';

const arLessons = [
  {
    id: 1,
    title: 'Basic Greetings',
    signs: ['Hello', 'Thank You', 'Please', 'Welcome'],
    duration: '5 min',
    difficulty: 'Beginner'
  },
  {
    id: 2,
    title: 'Introduction Phrases',
    signs: ['My Name Is', 'Nice to Meet You', 'How Are You'],
    duration: '7 min',
    difficulty: 'Beginner'
  },
  {
    id: 3,
    title: 'Workplace Basics',
    signs: ['Meeting', 'Email', 'Help', 'Question'],
    duration: '10 min',
    difficulty: 'Intermediate'
  },
];

export function ARLearningPage() {
  const [isARActive, setIsARActive] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartAR = (lessonId: number) => {
    setSelectedLesson(lessonId);
    setIsARActive(true);
    setIsCameraOn(true);
    setCurrentSignIndex(0);
  };

  const handleExitAR = () => {
    setIsARActive(false);
    setSelectedLesson(null);
    setIsCameraOn(false);
    setIsPlaying(false);
  };

  const currentLesson = arLessons.find(l => l.id === selectedLesson);

  if (isARActive && currentLesson) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* AR Camera View */}
        <div className="relative h-full w-full">
          {/* Simulated camera feed with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20">
            {isCameraOn ? (
              <div className="h-full w-full flex items-center justify-center text-white/50">
                <div className="text-center">
                  <Camera className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                  <p>Camera View Active</p>
                  <p className="text-sm mt-2">Virtual instructor will appear here</p>
                </div>
              </div>
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-900">
                <CameraOff className="h-16 w-16 text-white/50" />
              </div>
            )}
          </div>

          {/* Virtual Instructor Avatar (Simulated) */}
          {isCameraOn && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-8 bottom-32 w-48 h-64"
            >
              <div className="bg-gradient-to-br from-primary/30 to-secondary/30 backdrop-blur-md rounded-3xl p-4 border-2 border-white/30 shadow-2xl">
                <div className="text-center">
                  <motion.div
                    animate={{
                      rotate: isPlaying ? [0, 10, -10, 0] : 0,
                    }}
                    transition={{
                      repeat: isPlaying ? Infinity : 0,
                      duration: 2,
                    }}
                    className="text-6xl mb-2"
                  >
                    🤟
                  </motion.div>
                  <p className="text-white text-sm mb-2">Virtual Instructor</p>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {currentLesson.signs[currentSignIndex]}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <Button
              onClick={handleExitAR}
              variant="outline"
              className="bg-black/50 border-white/30 text-white hover:bg-black/70 rounded-2xl backdrop-blur-md"
            >
              Exit AR
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsCameraOn(!isCameraOn)}
                variant="outline"
                size="icon"
                className="bg-black/50 border-white/30 text-white hover:bg-black/70 rounded-2xl backdrop-blur-md"
              >
                {isCameraOn ? <Camera className="h-5 w-5" /> : <CameraOff className="h-5 w-5" />}
              </Button>
              <Button
                onClick={() => setIsSoundOn(!isSoundOn)}
                variant="outline"
                size="icon"
                className="bg-black/50 border-white/30 text-white hover:bg-black/70 rounded-2xl backdrop-blur-md"
              >
                {isSoundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black/70 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white text-lg">{currentLesson.title}</h3>
                  <p className="text-white/70 text-sm">
                    Sign {currentSignIndex + 1} of {currentLesson.signs.length}
                  </p>
                </div>
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="rounded-full h-16 w-16 bg-primary hover:bg-primary/90"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                </Button>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-white/20 rounded-full mb-4 overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentSignIndex + 1) / currentLesson.signs.length) * 100}%` }}
                />
              </div>

              {/* Sign navigation */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setCurrentSignIndex(Math.max(0, currentSignIndex - 1))}
                  disabled={currentSignIndex === 0}
                  variant="outline"
                  className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentSignIndex(0)}
                  variant="outline"
                  size="icon"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
                >
                  <RotateCcw className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => setCurrentSignIndex(Math.min(currentLesson.signs.length - 1, currentSignIndex + 1))}
                  disabled={currentSignIndex === currentLesson.signs.length - 1}
                  className="flex-1 bg-primary hover:bg-primary/90 rounded-xl"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <Camera className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl">AR Learning</h2>
          <p className="text-sm text-muted-foreground">
            Learn with a virtual instructor
          </p>
        </div>
      </div>

      {/* Feature Explanation */}
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-6 border-2 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🎯</div>
          <div>
            <h3 className="text-lg mb-2">How AR Learning Works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>A virtual instructor appears next to you via your camera</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Follow along as they demonstrate ISL gestures in 3D</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Practice at your own pace with voice guidance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* AR Lessons */}
      <div className="space-y-3">
        <h3 className="text-lg">Available AR Lessons</h3>
        {arLessons.map((lesson) => (
          <motion.div
            key={lesson.id}
            whileTap={{ scale: 0.98 }}
            className="bg-card rounded-2xl p-5 shadow-sm border border-border hover:border-primary/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-lg mb-1">{lesson.title}</h4>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {lesson.duration}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {lesson.difficulty}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {lesson.signs.length} signs
                  </Badge>
                </div>
              </div>
              <Button
                onClick={() => handleStartAR(lesson.id)}
                className="rounded-full h-12 w-12 bg-gradient-to-br from-primary to-secondary shadow-lg"
                size="icon"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {lesson.signs.map((sign, idx) => (
                <span key={idx} className="text-xs bg-muted px-3 py-1 rounded-full">
                  {sign}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Requirements Notice */}
      <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
        <p className="text-sm text-center">
          <span className="text-accent">📱</span> Camera access required for AR features
        </p>
      </div>
    </div>
  );
}
