import { useState } from 'react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { CheckCircle2, XCircle, RefreshCcw, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import video assets
import helloVideo from '../assets/s_hello_ai.mp4';
import thankYouVideo from '../assets/s_thankyou_ai.mp4';

interface Question {
  sign: string;
  videoPath: string;
  correctAnswer: string;
  options: string[];
}

const practiceQuestions: Question[] = [
  {
    sign: 'Hello',
    videoPath: helloVideo,
    correctAnswer: 'Wave your hand in a greeting motion',
    options: [
      'Wave your hand in a greeting motion',
      'Touch your chin and move hand forward',
      'Nod your head up and down',
      'Point to yourself'
    ]
  },
  {
    sign: 'Thank You',
    videoPath: thankYouVideo,
    correctAnswer: 'Touch your chin and move hand forward',
    options: [
      'Wave your hand in a greeting motion',
      'Touch your chin and move hand forward',
      'Circular motion on chest with open palm',
      'Bring hands together'
    ]
  },
  {
    sign: 'Write',
    videoPath: '',
    correctAnswer: 'One fist on open palm, lift together',
    options: [
      'Point to yourself',
      'Wave both hands',
      'One fist on open palm, lift together',
      'Tap fists together'
    ]
  },
  {
    sign: 'Teacher',
    videoPath: '',
    correctAnswer: 'Bring fingertips of both hands together',
    options: [
      'Bring fingertips of both hands together',
      'Tap fists together at wrists',
      'Draw a circle in the air',
      'Point to a group'
    ]
  },
  {
    sign: 'Study',
    videoPath: '',
    correctAnswer: 'Tap fists together at wrists',
    options: [
      'Type motion with fingers',
      'Tap fists together at wrists',
      'Open and close hands',
      'Point to a desk'
    ]
  },
];

export function PracticePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const question = practiceQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const progress = ((currentQuestion + 1) / practiceQuestions.length) * 100;

  const handleSubmit = () => {
    setShowResult(true);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < practiceQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  if (quizComplete) {
    const percentage = (score / practiceQuestions.length) * 100;
    const isPerfect = percentage === 100;
    const isGood = percentage >= 70;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-4 py-6 space-y-6"
      >
        <div className="bg-card rounded-3xl p-8 shadow-lg border-2 border-primary text-center space-y-6">
          <div className="text-7xl mb-4">
            {isPerfect ? '🎉' : isGood ? '🌟' : '💪'}
          </div>
          <h2 className="text-2xl">
            {isPerfect ? 'Perfect!' : isGood ? 'Great Job!' : 'Keep Practicing!'}
          </h2>
          <p className="text-muted-foreground">
            {isPerfect ? 'You aced this practice!' : isGood ? 'You did really well!' : 'You\'re improving!'}
          </p>

          <div className="text-6xl my-6">
            {score} / {practiceQuestions.length}
          </div>

          <Progress value={percentage} className="h-4" />

          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4">
              <div className="text-3xl mb-1">{percentage.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-4">
              <div className="text-3xl mb-1">+{score * 10}</div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
            <div className="bg-gradient-to-br from-accent/20 to-accent/10 rounded-2xl p-4">
              <div className="text-3xl mb-1">{isPerfect ? '3' : isGood ? '2' : '1'}</div>
              <div className="text-xs text-muted-foreground">Stars</div>
            </div>
          </div>

          <Button
            onClick={handleRestart}
            className="w-full rounded-xl h-14 shadow-md"
            size="lg"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            Practice Again
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center">
          <Target className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl">Practice Quiz</h2>
          <p className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {practiceQuestions.length}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        <div className="flex justify-between mb-2 text-sm">
          <span>Progress</span>
          <span className="text-primary">Score: {score}</span>
        </div>
        <Progress value={progress} className="h-3" />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          {/* Video Display - YouTube Shorts Style */}
          <div className="relative w-full aspect-[9/16] max-h-[65vh] mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl">
            {question.videoPath ? (
              <video
                key={question.videoPath}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={question.videoPath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="text-center text-white">
                  <span className="text-7xl block mb-3" aria-hidden="true">🤟</span>
                  <h3 className="text-2xl">{question.sign}</h3>
                </div>
              </div>
            )}

            {/* Sign Label Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-black/60 backdrop-blur-md rounded-2xl px-4 py-2">
                <h3 className="text-white text-xl font-semibold">{question.sign}</h3>
              </div>
            </div>
          </div>

          {/* Question and Options */}
          <div className="bg-card rounded-3xl p-6 shadow-lg border border-border space-y-4">
            <p className="text-sm text-muted-foreground">
              Select the correct description:
            </p>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isAnswer = showResult && option === question.correctAnswer;
                const isWrong = showResult && isSelected && !isAnswer;

                return (
                  <button
                    key={idx}
                    onClick={() => !showResult && setSelectedAnswer(option)}
                    disabled={showResult}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${isAnswer
                      ? 'border-primary bg-primary/10'
                      : isWrong
                        ? 'border-destructive bg-destructive/10'
                        : isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center ${isAnswer ? 'bg-primary border-primary' :
                        isWrong ? 'bg-destructive border-destructive' :
                          isSelected ? 'bg-primary border-primary' :
                            'border-muted-foreground'
                        }`}>
                        {(isSelected || isAnswer) && (
                          <div className="h-3 w-3 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                      {isAnswer && <CheckCircle2 className="h-5 w-5 text-primary" />}
                      {isWrong && <XCircle className="h-5 w-5 text-destructive" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl ${isCorrect
                  ? 'bg-primary/10 border-2 border-primary/30'
                  : 'bg-destructive/10 border-2 border-destructive/30'
                  }`}
              >
                <p className="text-center">
                  {isCorrect ? (
                    <span className="text-[rgba(0,219,0,1)]">✓ Correct! +10 XP</span>
                  ) : (
                    <span className="text-destructive">✗ Not quite right. Keep practicing!</span>
                  )}
                </p>
              </motion.div>
            )}

            {/* Action Button */}
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="w-full rounded-xl h-14 shadow-md"
                size="lg"
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="w-full rounded-xl h-14 shadow-md"
                size="lg"
              >
                {currentQuestion < practiceQuestions.length - 1 ? 'Next Question →' : 'View Results'}
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
