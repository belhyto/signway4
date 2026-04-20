import { useEffect } from 'react';
import { motion } from 'motion/react';
import logoImage from 'figma:asset/0bac470229d92a29f0f448217f41b3da35bc5c28.png';
import frogImage from '../assets/frog_3.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash-screen-container">
      {/* Floating Bubbles/Circles from design */}
      <motion.div 
        className="splash-bubble splash-bubble--small"
        animate={{ y: [-10, 10, -10], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="splash-bubble splash-bubble--medium"
        animate={{ y: [10, -10, 10], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div 
        className="splash-bubble splash-bubble--large"
        animate={{ y: [-15, 15, -15], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      <div className="splash-content">
        {/* Logo Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="splash-logo-card"
        >
          <motion.img 
            src={logoImage} 
            alt="Signway Logo" 
            className="splash-logo-image"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* App Name */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="splash-title"
        >
          Signway
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="splash-tagline"
        >
          Making ISL Fun!
        </motion.p>
      </div>

      {/* Frog Character at Bottom */}
      <motion.div
        initial={{ y: 200 }}
        animate={{ y: 0 }}
        transition={{ 
          type: "spring", 
          damping: 15, 
          stiffness: 100, 
          delay: 0.5 
        }}
        className="splash-frog-container"
      >
        <div className="splash-frog-wrapper">
           {/* Decorative background shape behind frog */}
           <div className="splash-frog-glow" />
           
           <img 
            src={frogImage} 
            alt="Frog Character" 
            className="splash-frog-image"
          />
          
          {/* Animated bubbles near frog */}
          <motion.div 
            className="splash-frog-bubble splash-frog-bubble--1"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div 
            className="splash-frog-bubble splash-frog-bubble--2"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
