import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { HomePage } from './HomePage';
import { SchoolLearningPath } from './SchoolLearningPath';
import { WorkLearningPath } from './WorkLearningPath';
import { HomeLearningPath } from './HomeLearningPath';
import { LessonsPage } from './LessonsPage';
import { ARLearningPage } from './ARLearningPage';
import { SignyPage } from './SignyPage';
import { PracticePage } from './PracticePage';
import { ProfilePage } from './ProfilePage';
import { AccessibilitySettings } from './AccessibilitySettings';
import { DailyChallengesModal } from './DailyChallengesModal';
import { useLanguage } from './LanguageProvider';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

interface AppContentProps {
  environment?: 'school' | 'work' | 'home' | null;
  onEnvironmentChange?: (environment: 'school' | 'work' | 'home') => void;
}

export function AppContent({ environment, onEnvironmentChange }: AppContentProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showDailyChallenges, setShowDailyChallenges] = useState(false);
  const [isARActive, setIsARActive] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if we should show daily challenges
    const checkDailyChallenges = () => {
      const today = new Date().toDateString();
      const lastShown = localStorage.getItem('lastChallengeModalShown');

      // Show challenges if it's a new day and user hasn't seen them today
      if (lastShown !== today) {
        // Delay showing the modal slightly to let the app load
        setTimeout(() => {
          setShowDailyChallenges(true);
          localStorage.setItem('lastChallengeModalShown', today);
        }, 1000);
      }
    };

    checkDailyChallenges();
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onStartLearning={() => setActiveTab('lessons')} />;
      case 'lessons':
        // Show environment-specific learning path
        if (environment === 'school') {
          return <SchoolLearningPath onLessonClick={() => setActiveTab('ar')} />;
        } else if (environment === 'work') {
          return <WorkLearningPath />;
        } else if (environment === 'home') {
          return <HomeLearningPath />;
        }
        // Fallback to generic lessons page
        return <LessonsPage />;
      case 'practice':
        return <PracticePage />;
      case 'ar':
        return <ARLearningPage autoStart={true} onARStateChange={setIsARActive} onExitAR={() => setActiveTab('lessons')} />;
      case 'signy':
        return <SignyPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage onStartLearning={() => setActiveTab('lessons')} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header
        onSettingsClick={() => setSettingsOpen(true)}
        environment={environment}
        onEnvironmentChange={onEnvironmentChange}
      />

      {/* Main content area - fills remaining space */}
      <main className="flex-1 overflow-auto pb-14 sm:pb-16" id="main-content">
        <div className="h-full max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {!isARActive && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}

      <AccessibilitySettings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <DailyChallengesModal
        open={showDailyChallenges}
        onClose={() => setShowDailyChallenges(false)}
        environment={environment}
      />

      {/* Skip to main content for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-2xl"
      >
        {t('common.skipToMain')}
      </a>
    </div>
  );
}
