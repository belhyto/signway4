import { useState } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Home, School, Globe, ArrowRight, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Language, languageNames } from './LanguageProvider';
import enTranslations from '../translations/en';
import hiTranslations from '../translations/hi';
import mrTranslations from '../translations/mr';
import bnTranslations from '../translations/bn';
import taTranslations from '../translations/ta';
import paTranslations from '../translations/pa';
import guTranslations from '../translations/gu';
import mlTranslations from '../translations/ml';
import knTranslations from '../translations/kn';
import teTranslations from '../translations/te';
import orTranslations from '../translations/or';
import asTranslations from '../translations/as';
import urTranslations from '../translations/ur';
import logoImage from 'figma:asset/0bac470229d92a29f0f448217f41b3da35bc5c28.png';

interface WelcomeScreenProps {
  onComplete: (language: Language, environment?: 'school' | 'work' | 'home') => void;
  onSignIn: () => void;
}

export function WelcomeScreen({ onComplete, onSignIn }: WelcomeScreenProps) {
  const [step, setStep] = useState<'welcome' | 'language' | 'environment'>('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('en');

  // Create a simple translation function for the welcome screen
  const getTranslations = (lang: Language) => {
    const translations = {
      en: enTranslations,
      hi: hiTranslations,
      mr: mrTranslations,
      bn: bnTranslations,
      ta: taTranslations,
      pa: paTranslations,
      gu: guTranslations,
      ml: mlTranslations,
      kn: knTranslations,
      te: teTranslations,
      or: orTranslations,
      as: asTranslations,
      ur: urTranslations,
    };
    return translations[lang] || translations.en;
  };

  const t = (key: string) => {
    const translations = getTranslations(selectedLanguage);
    return translations[key] || key;
  };

  const allLanguages: Language[] = ['en', 'hi', 'mr', 'bn', 'ta', 'pa', 'gu', 'ml', 'kn', 'te', 'or', 'as', 'ur'];

  const handleEnvironmentSelect = (environment: 'school' | 'work' | 'home') => {
    onComplete(selectedLanguage, environment);
  };

  if (step === 'welcome') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-3 sm:p-4 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl"
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-6 sm:p-12">
              <div className="text-center mb-8 sm:mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
                  className="inline-block bg-white rounded-3xl p-4 sm:p-8 mb-6 sm:mb-8 shadow-lg"
                >
                  <img src={logoImage} alt="Signway Logo" className="w-20 h-20 sm:w-32 sm:h-32 object-contain" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl sm:text-6xl mb-3 sm:mb-4"
                >
                  {t('welcome.title')}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-base sm:text-2xl text-muted-foreground px-2"
                >
                  {t('welcome.subtitle')}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-3 sm:space-y-4 flex flex-col items-center"
              >
                <Button
                  onClick={() => setStep('language')}
                  size="lg"
                  className="h-12 sm:h-16 text-base sm:text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all px-6 sm:px-8"
                >
                  <ArrowRight className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
                  {t('welcome.getStarted')}
                </Button>

                <Button
                  onClick={onSignIn}
                  variant="outline"
                  size="lg"
                  className="h-12 sm:h-16 text-base sm:text-xl rounded-2xl border-2 hover:bg-accent/50 transition-all px-6 sm:px-8"
                >
                  <LogIn className="mr-2 h-4 w-4 sm:h-6 sm:w-6" />
                  <span className="truncate">{t('welcome.signIn')}</span>
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm sm:text-base text-muted-foreground mt-6 sm:mt-8"
              >
                {t('welcome.description')}
              </motion.p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (step === 'language') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-3 sm:p-4 overflow-auto">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-5xl"
        >
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-6 sm:p-12">
              <div className="text-center mb-6 sm:mb-8">
                <Globe className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-primary" />
                <h2 className="text-2xl sm:text-5xl mb-2">{t('welcome.chooseLanguage')}</h2>
                <p className="text-sm sm:text-xl text-muted-foreground">
                  {t('welcome.languageDescription')}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 max-h-[60vh] overflow-y-auto">
                {allLanguages.map((lang) => (
                  <motion.button
                    key={lang}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`p-4 sm:p-6 rounded-2xl border-2 transition-all ${selectedLanguage === lang
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50 bg-background'
                      }`}
                  >
                    <div className="text-center">
                      <div className="text-lg sm:text-2xl mb-1 sm:mb-2 truncate">{languageNames[lang].native}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground truncate">
                        {languageNames[lang].english}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-3 sm:gap-4 justify-center">
                <Button
                  onClick={() => setStep('welcome')}
                  variant="outline"
                  size="lg"
                  className="h-12 sm:h-14 text-base sm:text-lg rounded-2xl px-6 sm:px-8"
                >
                  {t('common.back')}
                </Button>
                <Button
                  onClick={() => setStep('environment')}
                  size="lg"
                  className="h-12 sm:h-14 text-base sm:text-lg rounded-2xl shadow-lg px-6 sm:px-8"
                >
                  {t('common.continue')}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Environment selection step
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center p-3 sm:p-4 overflow-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl"
      >
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardContent className="p-6 sm:p-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-5xl mb-2 sm:mb-4">{t('welcome.chooseEnvironment')}</h2>
              <p className="text-sm sm:text-xl text-muted-foreground">
                {t('welcome.environmentDescription')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.button
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEnvironmentSelect('school')}
                className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <School className="h-12 w-12 sm:h-20 sm:w-20 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-3xl mb-1 sm:mb-2">{t('welcome.school')}</h3>
                  <p className="text-sm sm:text-base text-white/90">
                    {t('welcome.schoolDesc')}
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEnvironmentSelect('work')}
                className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <Briefcase className="h-12 w-12 sm:h-20 sm:w-20 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-3xl mb-1 sm:mb-2">{t('welcome.work')}</h3>
                  <p className="text-sm sm:text-base text-white/90">
                    {t('welcome.workDesc')}
                  </p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -8 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEnvironmentSelect('home')}
                className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <Home className="h-12 w-12 sm:h-20 sm:w-20 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-xl sm:text-3xl mb-1 sm:mb-2">{t('welcome.home')}</h3>
                  <p className="text-sm sm:text-base text-white/90">
                    {t('welcome.homeDesc')}
                  </p>
                </div>
              </motion.button>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => setStep('language')}
                variant="outline"
                size="lg"
                className="h-12 sm:h-14 text-base sm:text-lg rounded-2xl px-6 sm:px-8"
              >
                {t('common.back')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
