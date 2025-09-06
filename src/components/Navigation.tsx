import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Code, 
  Brain, 
  Target, 
  BookOpen, 
  User, 
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useUserSession } from '@/hooks/useLocalStorage';

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentSection, onNavigate }) => {
  const [session] = useUserSession();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'editor', label: 'Code Playground', icon: Code },
    { id: 'tutor', label: 'AI Tutor', icon: Brain },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'learning', label: 'Learning Path', icon: BookOpen },
    { id: 'assessment', label: 'Skill Assessment', icon: User },
  ];

  return (
    <nav className="bg-surface/80 backdrop-blur-xl border-r border-border/30 w-64 h-screen p-4 flex flex-col relative overflow-hidden">
      {/* Glass overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-ai-accent/5 pointer-events-none" />
      
      {/* Subtle animated background */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>
      {/* Logo */}
      <motion.div 
        className="flex items-center gap-3 mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <motion.div 
          className="w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-ai-accent flex items-center justify-center shadow-lg"
          whileHover={{ 
            scale: 1.1,
            rotate: 10,
            boxShadow: "0 0 20px hsl(var(--primary) / 0.5)"
          }}
          animate={{
            boxShadow: [
              "0 0 10px hsl(var(--primary) / 0.2)",
              "0 0 20px hsl(var(--primary) / 0.4)",
              "0 0 10px hsl(var(--primary) / 0.2)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
        </motion.div>
        <div>
          <h1 className="font-bold text-lg text-foreground">DevMentor AI</h1>
          <p className="text-xs text-muted-foreground">Programming Tutor</p>
        </div>
      </motion.div>

      {/* User Status */}
      <motion.div 
        className="mb-6 p-3 rounded-lg bg-gradient-to-br from-surface/50 to-surface-variant/50 border border-border/30 backdrop-blur-sm relative overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.02, y: -2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-ai-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex items-center justify-between mb-2 relative z-10">
          <span className="text-sm font-medium">Active Session</span>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary/20 to-ai-accent/20 border-primary/30 text-primary">
              Live
            </Badge>
          </motion.div>
        </div>
        <div className="text-xs text-muted-foreground relative z-10">
          {Math.floor((Date.now() - new Date(session.sessionStart).getTime()) / 60000)}m active
        </div>
        
        {/* Pulse effect */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [1, 0, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Navigation Items */}
      <div className="flex-1 space-y-2">
        {navItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                onClick={() => onNavigate(item.id)}
                className={`w-full justify-start gap-3 transition-all duration-300 relative overflow-hidden group ${
                  currentSection === item.id 
                    ? 'bg-gradient-to-r from-primary/20 to-ai-accent/20 text-primary border border-primary/30 shadow-lg backdrop-blur-sm' 
                    : 'bg-surface/30 hover:bg-gradient-to-r hover:from-primary/10 hover:to-ai-accent/10 backdrop-blur-sm border border-border/20 hover:border-primary/20'
                }`}
              >
                {/* Hover glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r from-primary/10 to-ai-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <motion.div
                  animate={currentSection === item.id ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <item.icon className="w-5 h-5 relative z-10" />
                </motion.div>
                <span className="relative z-10">{item.label}</span>
                
                {/* Active indicator */}
                {currentSection === item.id && (
                  <motion.div
                    className="absolute right-2 w-2 h-2 bg-primary rounded-full"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </Button>
            </motion.div>
          </motion.div>
        ))}
      </div>

    </nav>
  );
};