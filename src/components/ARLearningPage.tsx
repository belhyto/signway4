import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Camera, CameraOff, Volume2, VolumeX, RotateCcw, Play, Pause, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useLanguage } from './LanguageProvider';

export function ARLearningPage({ autoStart = false, onARStateChange, onExitAR }: { autoStart?: boolean; onARStateChange?: (isActive: boolean) => void; onExitAR?: () => void } = {}) {
  const { t } = useLanguage();

  const arLessons = [
    {
      id: 1,
      title: t('ar.lesson.basicGreetings'),
      signs: ['Hello', 'Thank You', 'Please', 'Welcome'],
      duration: t('ar.lesson.basicGreetings.duration'),
      difficulty: t('ar.difficulty.beginner')
    },
    {
      id: 2,
      title: t('ar.lesson.introductionPhrases'),
      signs: ['My Name Is', 'Nice to Meet You', 'How Are You'],
      duration: t('ar.lesson.introductionPhrases.duration'),
      difficulty: t('ar.difficulty.beginner')
    },
    {
      id: 3,
      title: t('ar.lesson.workplaceBasics'),
      signs: ['Meeting', 'Email', 'Help', 'Question'],
      duration: t('ar.lesson.workplaceBasics.duration'),
      difficulty: t('ar.difficulty.intermediate')
    },
  ];

  const [isARActive, setIsARActive] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [currentSignIndex, setCurrentSignIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-start AR lesson if autoStart prop is true
  useEffect(() => {
    if (autoStart && !isARActive) {
      handleStartAR(1); // Start first lesson automatically
    }
  }, [autoStart, isARActive]);

  // Notify parent when AR state changes
  useEffect(() => {
    onARStateChange?.(isARActive);
  }, [isARActive, onARStateChange]);

  // Get available cameras
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(cameras);
        if (cameras.length > 0 && !selectedCamera) {
          setSelectedCamera(cameras[0].deviceId);
        }
      } catch (err) {
        console.error('Error enumerating devices:', err);
      }
    };
    getCameras();
  }, []);

  // Handle camera start/stop
  const toggleCamera = async () => {
    if (!isCameraOn) {
      try {
        const constraints: MediaStreamConstraints = {
          video: selectedCamera ? { deviceId: { exact: selectedCamera } } : true
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error('Error accessing camera:', err);
        alert('Unable to access camera. Please check permissions.');
      }
    } else {
      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    }
  };

  // Handle camera change
  const handleCameraChange = async (deviceId: string) => {
    setSelectedCamera(deviceId);

    // If camera is already on, restart with new camera
    if (isCameraOn && videoRef.current) {
      // Stop current stream
      if (videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      // Start new stream with selected camera
      try {
        const constraints: MediaStreamConstraints = {
          video: { deviceId: { exact: deviceId } }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } catch (err) {
        console.error('Error switching camera:', err);
        alert('Unable to switch camera.');
      }
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartAR = (lessonId: number) => {
    setSelectedLesson(lessonId);
    setIsARActive(true);
    setCurrentSignIndex(0);
  };

  const handleExitAR = () => {
    // Stop camera when exiting
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsARActive(false);
    setSelectedLesson(null);
    setIsCameraOn(false);
    setIsPlaying(false);

    // Notify parent immediately that AR is no longer active
    onARStateChange?.(false);

    // Call parent callback to navigate back
    onExitAR?.();
  };

  const currentLesson = arLessons.find(l => l.id === selectedLesson);

  if (isARActive && currentLesson) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* AR Camera View */}
        <div className="relative h-full w-full">
          {/* Real camera feed */}
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}
            playsInline
            muted
          />

          {/* Camera placeholder when off */}
          {!isCameraOn && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 flex items-center justify-center">
              <div className="text-center text-white/50">
                <Camera className="h-16 w-16 mx-auto mb-4" />
                <p>{t('ar.cameraOff')}</p>
                <p className="text-sm mt-2">{t('ar.turnOnCamera')}</p>
              </div>
            </div>
          )}

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
                  <p className="text-white text-sm mb-2">{t('ar.virtualInstructor')}</p>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {currentLesson.signs[currentSignIndex]}
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}

          {/* Top Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <Button
              onClick={handleExitAR}
              variant="outline"
              className="bg-black/50 border-white/30 text-white hover:bg-black/70 rounded-2xl backdrop-blur-md"
            >
              {t('ar.exitAR')}
            </Button>
            <div className="flex gap-2 flex-wrap items-center">
              {/* Camera Selection */}
              {availableCameras.length > 1 && (
                <Select value={selectedCamera} onValueChange={handleCameraChange}>
                  <SelectTrigger className="w-[180px] bg-black/50 border-white/30 text-white hover:bg-black/70 rounded-2xl backdrop-blur-md">
                    <SelectValue placeholder={t('ar.selectCamera')} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCameras.map((camera, index) => (
                      <SelectItem key={camera.deviceId} value={camera.deviceId}>
                        {camera.label || `Camera ${index + 1}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button
                onClick={toggleCamera}
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
                    {t('ar.sign')} {currentSignIndex + 1} {t('ar.of')} {currentLesson.signs.length}
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
                  {t('ar.previous')}
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
                  {t('ar.next')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 pb-24 space-y-6">
      {/* Header */}



      {/* AR Lessons */}
      <div className="space-y-3">
        <h3 className="text-lg">{t('ar.availableLessons')}</h3>
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
                    {lesson.signs.length} {t('lessons.signs')}
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

    </div>
  );
}
