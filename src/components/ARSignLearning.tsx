import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Camera, CheckCircle2, Video, CameraOff, Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { useLanguage } from './LanguageProvider';

export interface Sign {
    id: string;
    word: string;
    description: string;
    tips?: string;
}

interface ARSignLearningProps {
    lessonTitle: string;
    signs: Sign[];
    onBack: () => void;
    onComplete?: () => void;
}

export function ARSignLearning({ lessonTitle, signs, onBack, onComplete }: ARSignLearningProps) {
    const { t } = useLanguage();
    const [currentSignIndex, setCurrentSignIndex] = useState(0);
    const [completedSigns, setCompletedSigns] = useState<Set<string>>(new Set());
    const [cameraEnabled, setCameraEnabled] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSignListOpen, setIsSignListOpen] = useState(false);
    const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
    const [selectedCameraId, setSelectedCameraId] = useState<string>('');
    const videoRef = useRef<HTMLVideoElement>(null);

    const currentSign = signs[currentSignIndex];
    const progress = ((currentSignIndex + 1) / signs.length) * 100;
    const isLastSign = currentSignIndex === signs.length - 1;
    const isFirstSign = currentSignIndex === 0;

    // Get available cameras
    useEffect(() => {
        const getCameras = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                setAvailableCameras(videoDevices);
                if (videoDevices.length > 0 && !selectedCameraId) {
                    setSelectedCameraId(videoDevices[0].deviceId);
                }
            } catch (err) {
                console.error('Error enumerating devices:', err);
            }
        };
        getCameras();
    }, [selectedCameraId]);

    // Handle camera toggle
    const toggleCamera = async () => {
        if (!cameraEnabled) {
            try {
                const constraints: MediaStreamConstraints = {
                    video: selectedCameraId
                        ? {
                            deviceId: { exact: selectedCameraId },
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        }
                        : {
                            facingMode: 'user',
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        }
                };

                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setCameraEnabled(true);
                setIsExpanded(true);
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
            setCameraEnabled(false);
            setIsExpanded(false);
        }
    };

    // Handle camera change
    const handleCameraChange = async (deviceId: string) => {
        setSelectedCameraId(deviceId);

        // If camera is currently enabled, restart with new camera
        if (cameraEnabled && videoRef.current) {
            // Stop current stream
            if (videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }

            // Start new stream with selected camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: { exact: deviceId },
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                });
                videoRef.current.srcObject = stream;
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

    const handleNext = () => {
        setCompletedSigns(prev => new Set([...prev, currentSign.id]));

        if (isLastSign) {
            if (onComplete) {
                onComplete();
            }
        } else {
            setCurrentSignIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (!isFirstSign) {
            setCurrentSignIndex(prev => prev - 1);
        }
    };

    const handleSignClick = (index: number) => {
        setCurrentSignIndex(index);
    };

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={onBack}
                        className="text-white hover:bg-white/20 mb-2"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        {t('common.back')}
                    </Button>
                    <h1 className="text-2xl sm:text-3xl mb-1">{lessonTitle}</h1>
                    <p className="text-blue-100">
                        {t('practice.question')} {currentSignIndex + 1} {t('practice.of')} {signs.length}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto p-4 space-y-4">
                    {/* Camera Feed / AR View */}
                    <Card className="overflow-hidden border-2 border-blue-200">
                        <CardContent className="p-0">
                            <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center transition-all ${isExpanded ? 'aspect-[16/10]' : 'aspect-video'
                                }`}>
                                {/* Video Element for Camera Feed */}
                                <video
                                    ref={videoRef}
                                    className={`absolute inset-0 w-full h-full object-cover ${cameraEnabled ? 'opacity-100' : 'opacity-0'}`}
                                    autoPlay
                                    playsInline
                                    muted
                                />

                                {/* Camera Feed Placeholder (when camera is off) */}
                                {!cameraEnabled && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="text-center text-white/60">
                                            <Camera className="h-16 w-16 mx-auto mb-4" />
                                            <p className="text-sm mb-4">Camera Feed</p>
                                            <Button
                                                onClick={toggleCamera}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <Camera className="h-4 w-4 mr-2" />
                                                Turn On Camera
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* AR Character Overlay - Positioned on Right Side */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSign.id}
                                        initial={{ opacity: 0, scale: 0.8, x: 50 }}
                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, x: 50 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
                                    >
                                        {/* AR Character - No blur, positioned right */}
                                        <div className="bg-white/10 rounded-3xl p-6 border-2 border-white/20">
                                            <div className={`mb-3 ${isExpanded ? 'text-8xl' : 'text-7xl'}`}>🧍</div>
                                            <div className={`text-white font-semibold bg-black/30 px-4 py-2 rounded-full text-center ${isExpanded ? 'text-2xl' : 'text-xl'
                                                }`}>
                                                {currentSign.word}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Camera Controls */}
                                {cameraEnabled && (
                                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between flex-wrap gap-2">
                                        <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                            <Video className="h-4 w-4" />
                                            Live
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            {/* Camera Selector */}
                                            {availableCameras.length > 1 && (
                                                <select
                                                    value={selectedCameraId}
                                                    onChange={(e) => handleCameraChange(e.target.value)}
                                                    className="bg-black/70 hover:bg-black/80 text-white border border-white/20 rounded px-3 py-1.5 text-sm cursor-pointer"
                                                >
                                                    {availableCameras.map((camera, index) => (
                                                        <option key={camera.deviceId} value={camera.deviceId}>
                                                            {camera.label || `Camera ${index + 1}`}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => setIsExpanded(!isExpanded)}
                                                className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                                            >
                                                {isExpanded ? (
                                                    <><Minimize2 className="h-4 w-4 mr-1" /> Minimize</>
                                                ) : (
                                                    <><Maximize2 className="h-4 w-4 mr-1" /> Expand</>
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={toggleCamera}
                                                className="bg-black/50 hover:bg-black/70 text-white border-white/20"
                                            >
                                                <CameraOff className="h-4 w-4 mr-1" />
                                                Turn Off
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Sign Information */}
                    <Card className="border-blue-200 bg-blue-50/30">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h2 className="text-3xl mb-2">{currentSign.word}</h2>
                                    <p className="text-muted-foreground text-lg">{currentSign.description}</p>
                                </div>
                                {completedSigns.has(currentSign.id) && (
                                    <Badge className="bg-green-500 text-white">
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        Learned
                                    </Badge>
                                )}
                            </div>

                            {currentSign.tips && (
                                <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded">
                                    <p className="text-sm">
                                        <strong className="text-blue-700">💡 Tip:</strong> {currentSign.tips}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Progress */}
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">
                                    {t('learningPath.overallProgress')}
                                </span>
                                <span className="text-sm font-semibold text-blue-600">
                                    {completedSigns.size}/{signs.length} {t('learningPath.completed')}
                                </span>
                            </div>
                            <Progress value={progress} className="h-3" />
                        </CardContent>
                    </Card>

                    {/* Navigation Controls */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={isFirstSign}
                            className="flex-1"
                            size="lg"
                        >
                            <ChevronLeft className="h-5 w-5 mr-2" />
                            Previous
                        </Button>
                        <Button
                            onClick={handleNext}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            size="lg"
                        >
                            {isLastSign ? (
                                <>
                                    <CheckCircle2 className="h-5 w-5 mr-2" />
                                    Complete Lesson
                                </>
                            ) : (
                                <>
                                    Next
                                    <ChevronRight className="h-5 w-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Sign List - Collapsible Quick Navigation */}
                    <Collapsible open={isSignListOpen} onOpenChange={setIsSignListOpen}>
                        <Card>
                            <CardContent className="p-4">
                                <CollapsibleTrigger className="w-full">
                                    <div className="flex items-center justify-between cursor-pointer group">
                                        <h3 className="text-sm font-semibold text-muted-foreground group-hover:text-blue-600 transition-colors">
                                            All Signs in This Lesson ({signs.length})
                                        </h3>
                                        {isSignListOpen ? (
                                            <ChevronUp className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                                        ) : (
                                            <ChevronDown className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                                        )}
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                                        {signs.map((sign, index) => (
                                            <button
                                                key={sign.id}
                                                onClick={() => handleSignClick(index)}
                                                className={`p-3 rounded-lg border-2 transition-all text-left ${index === currentSignIndex
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : completedSigns.has(sign.id)
                                                        ? 'border-green-200 bg-green-50'
                                                        : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs text-muted-foreground">#{index + 1}</span>
                                                    {completedSigns.has(sign.id) && (
                                                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                                                    )}
                                                </div>
                                                <div className="font-medium text-sm truncate">{sign.word}</div>
                                            </button>
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </CardContent>
                        </Card>
                    </Collapsible>
                </div>
            </div>
        </div>
    );
}
