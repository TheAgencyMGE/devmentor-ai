import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Dashboard } from '@/components/Dashboard';
import { CodePlayground } from '@/pages/CodePlayground';
import { AIAssistant } from '@/components/AIAssistant';
import { SkillAssessment } from '@/components/SkillAssessment';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Code, 
  Target, 
  BookOpen, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserSession } from '@/hooks/useLocalStorage';
import { Challenges } from '@/components/Challenges';
import { LearningPath } from '@/components/LearningPath';

const Index = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useUserSession();

  // Check URL parameters for section
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section) {
      setCurrentSection(section);
    }
  }, []);

  // Update session when user is active
  useEffect(() => {
    setSession({
      ...session,
      sessionStart: session.sessionStart || new Date().toISOString()
    });
  }, []);

  const handleNavigate = (section: string) => {
    setCurrentSection(section);
    setIsMobileMenuOpen(false);
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'editor':
        return <CodePlayground />;
      case 'tutor':
        return (
          <div className="h-[calc(100vh-2rem)] p-4">
            <AIAssistant />
          </div>
        );
      case 'assessment':
        return (
          <div className="p-4">
            <SkillAssessment onComplete={() => handleNavigate('dashboard')} />
          </div>
        );
      case 'challenges':
        return <Challenges />;
      case 'learning':
        return <LearningPath />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Particle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.2,
              scale: [0.3, 0.8, 0.3],
              y: [-15, 15, -15],
              x: [-8, 8, -8]
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="particle absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { size: 'w-16 h-16', pos: 'top-20 left-20', color: 'from-primary/10 to-ai-accent/10' },
          { size: 'w-24 h-24', pos: 'top-40 right-32', color: 'from-ai-accent/10 to-primary/10' },
          { size: 'w-20 h-20', pos: 'bottom-32 left-1/4', color: 'from-primary/10 to-ai-accent/10' },
          { size: 'w-12 h-12', pos: 'bottom-20 right-20', color: 'from-ai-accent/10 to-primary/10' }
        ].map((blob, i) => (
          <motion.div
            key={i}
            className={`floating-element absolute ${blob.pos} ${blob.size} bg-gradient-to-r ${blob.color} rounded-full blur-xl`}
            animate={{
              y: [-15, 15, -15],
              x: [-8, 8, -8],
              scale: [1, 1.1, 1],
              rotate: [0, 90, 180, 270, 360]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden btn-glass"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Navigation - Desktop */}
      <div className="hidden lg:block">
        <Navigation currentSection={currentSection} onNavigate={handleNavigate} />
      </div>

      {/* Navigation - Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="fixed inset-y-0 left-0 z-40 lg:hidden"
          >
            <Navigation currentSection={currentSection} onNavigate={handleNavigate} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            damping: 20,
            stiffness: 100
          }}
          className="h-full"
        >
          {renderCurrentSection()}
        </motion.div>
      </main>
    </div>
  );
};


export default Index;
