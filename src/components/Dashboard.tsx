import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Code, 
  Target, 
  BookOpen, 
  Sparkles, 
  TrendingUp,
  Activity,
  FileText,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCodeProjects, useUserSession, useUserStats } from '@/hooks/useLocalStorage';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [projects] = useCodeProjects();
  const [session] = useUserSession();
  const [stats] = useUserStats();
  const [todaysProgress, setTodaysProgress] = useState({
    codeLines: 0,
    challenges: 0,
    timeSpent: 0
  });

  useEffect(() => {
    // Calculate today's progress
    const today = new Date().toDateString();
    const sessionToday = new Date(session.sessionStart).toDateString();
    
    if (today === sessionToday) {
      setTodaysProgress({
        codeLines: session.codeWritten,
        challenges: session.challengesSolved,
        timeSpent: Math.floor((Date.now() - new Date(session.sessionStart).getTime()) / 60000)
      });
    }
  }, [session]);

  const quickActions = [
    {
      icon: Code,
      title: 'Code Playground',
      description: 'Write and test code with AI assistance - runs in your browser',
      action: 'editor',
      gradient: 'from-primary to-primary-variant'
    },
    {
      icon: Brain,
      title: 'AI Mentor',
      description: 'Get personalized help from your AI programming mentor',
      action: 'tutor',
      gradient: 'from-ai-accent to-primary'
    },
    {
      icon: Target,
      title: 'Practice Challenges',
      description: 'Solve coding challenges tailored to your skill level',
      action: 'challenges',
      gradient: 'from-primary to-ai-accent'
    },
    {
      icon: BookOpen,
      title: 'Learning Path',
      description: 'Follow your personalized programming curriculum',
      action: 'learning',
      gradient: 'from-ai-accent to-primary'
    }
  ];

  return (
    <div className="space-y-6 p-6 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full opacity-20"
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              scale: [0.5, 1.2, 0.5],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          damping: 20,
          stiffness: 100
        }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/90 via-ai-accent/90 to-primary/90 p-8 text-white backdrop-blur-sm shadow-2xl"
        whileHover={{ scale: 1.02, y: -5 }}
      >
        {/* Animated background overlay */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 via-ai-accent/20 to-primary/20"
            animate={{
              background: [
                "linear-gradient(45deg, hsl(var(--primary)/0.2) 0%, hsl(var(--ai-accent)/0.2) 50%, hsl(var(--primary)/0.2) 100%)",
                "linear-gradient(45deg, hsl(var(--ai-accent)/0.2) 0%, hsl(var(--primary)/0.2) 50%, hsl(var(--ai-accent)/0.2) 100%)",
                "linear-gradient(45deg, hsl(var(--primary)/0.2) 0%, hsl(var(--ai-accent)/0.2) 50%, hsl(var(--primary)/0.2) 100%)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Floating sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.5
              }}
              style={{
                left: 10 + (i * 15) + '%',
                top: 20 + (i % 3) * 20 + '%'
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <motion.h1 
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome to DevMentor AI
          </motion.h1>
          <motion.p 
            className="text-lg opacity-90 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Learn programming with your personal AI mentor - completely private and browser-based
          </motion.p>
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {stats.totalChallengesSolved} Challenges Completed
              </Badge>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {projects.length} Local Projects
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.action}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: 0.5 + index * 0.1,
              type: "spring",
              damping: 20,
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.08, 
              y: -8,
              rotate: Math.random() * 4 - 2
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              className="bg-gradient-to-br from-surface/60 to-surface-variant/60 backdrop-blur-xl border border-border/30 hover:border-primary/30 cursor-pointer transition-all duration-500 relative overflow-hidden group shadow-lg hover:shadow-2xl"
              onClick={() => onNavigate(action.action)}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-ai-accent/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Animated border */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-ai-accent"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
              
              <div className="p-6 relative z-10">
                <motion.div 
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1,
                    boxShadow: "0 0 20px hsl(var(--primary) / 0.5)"
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{action.title}</h3>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{action.description}</p>
              </div>
              
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Today's Activity */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Card className="bg-gradient-to-br from-surface/70 to-surface-variant/70 backdrop-blur-xl border border-border/30 hover:border-success/30 p-6 relative overflow-hidden group transition-all duration-500">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="p-2 rounded-lg bg-gradient-to-r from-success/20 to-success/30"
              >
                <Activity className="w-5 h-5 text-success" />
              </motion.div>
              <h3 className="font-semibold group-hover:text-success transition-colors">Today's Activity</h3>
            </div>
          
          <div className="space-y-4 relative z-10">
            <motion.div 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-surface/30 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Code Lines</span>
              </div>
              <motion.span 
                className="font-medium text-success"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {todaysProgress.codeLines}
              </motion.span>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-surface/30 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Challenges</span>
              </div>
              <motion.span 
                className="font-medium text-success"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                {todaysProgress.challenges}
              </motion.span>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-surface/30 transition-colors"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Active Time</span>
              </div>
              <motion.span 
                className="font-medium text-success"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                {todaysProgress.timeSpent}m
              </motion.span>
            </motion.div>
          </div>
          </Card>
        </motion.div>

        {/* Learning Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Card className="bg-gradient-to-br from-surface/70 to-surface-variant/70 backdrop-blur-xl border border-border/30 hover:border-primary/30 p-6 relative overflow-hidden group transition-all duration-500">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-ai-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-ai-accent/30"
              >
                <TrendingUp className="w-5 h-5 text-primary" />
              </motion.div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">Learning Stats</h3>
            </div>
            
            <div className="space-y-4 relative z-10">
              <motion.div 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-surface/30 transition-colors"
                whileHover={{ x: 5 }}
              >
                <span className="text-sm text-muted-foreground">Total Challenges</span>
                <motion.span 
                  className="font-medium text-primary"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {stats.totalChallengesSolved}
                </motion.span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-surface/30 transition-colors"
                whileHover={{ x: 5 }}
              >
                <span className="text-sm text-muted-foreground">Code Lines Written</span>
                <motion.span 
                  className="font-medium text-primary"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  {stats.totalCodeLines}
                </motion.span>
              </motion.div>
              
              <motion.div 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-surface/30 transition-colors"
                whileHover={{ x: 5 }}
              >
                <span className="text-sm text-muted-foreground">Favorite Language</span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-ai-accent/20 border-primary/30 text-primary">{stats.favoriteLanguage}</Badge>
                </motion.div>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          whileHover={{ scale: 1.03, y: -5 }}
        >
          <Card className="bg-gradient-to-br from-surface/70 to-surface-variant/70 backdrop-blur-xl border border-border/30 hover:border-ai-accent/30 p-6 relative overflow-hidden group transition-all duration-500">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-ai-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="p-2 rounded-lg bg-gradient-to-r from-ai-accent/20 to-primary/30"
              >
                <Sparkles className="w-5 h-5 text-ai-accent" />
              </motion.div>
              <h3 className="font-semibold group-hover:text-ai-accent transition-colors">Quick Actions</h3>
            </div>
            
            <div className="space-y-2 relative z-10">
              <motion.div
                whileHover={{ scale: 1.02, x: 3 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={() => onNavigate('assessment')}
                  className="bg-gradient-to-r from-ai-accent/20 to-primary/20 hover:from-ai-accent/30 hover:to-primary/30 border border-ai-accent/30 text-foreground hover:text-ai-accent w-full justify-start backdrop-blur-sm transition-all duration-300 relative overflow-hidden group/btn"
                  size="sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-ai-accent/10 to-primary/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Brain className="w-4 h-4 mr-2 relative z-10" />
                  </motion.div>
                  <span className="relative z-10">Take Skill Assessment</span>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02, x: 3 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  onClick={() => onNavigate('challenges')}
                  className="bg-surface/50 hover:bg-gradient-to-r hover:from-primary/10 hover:to-ai-accent/10 border border-border/30 hover:border-primary/30 text-foreground hover:text-primary w-full justify-start backdrop-blur-sm transition-all duration-300 relative overflow-hidden group/btn"
                  size="sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-ai-accent/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Target className="w-4 h-4 mr-2 relative z-10" />
                  </motion.div>
                  <span className="relative z-10">Practice Challenges</span>
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Projects */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <Card className="bg-gradient-to-br from-surface/70 to-surface-variant/70 backdrop-blur-xl border border-border/30 hover:border-primary/30 p-6 relative overflow-hidden group transition-all duration-500">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-ai-accent/3 to-primary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="p-2 rounded-lg bg-gradient-to-r from-primary/20 to-ai-accent/30"
              >
                <Code className="w-5 h-5 text-primary" />
              </motion.div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">Recent Projects</h3>
            </div>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onNavigate('editor')}
                className="bg-gradient-to-r from-primary/10 to-ai-accent/10 hover:from-primary/20 hover:to-ai-accent/20 border border-primary/30 hover:border-primary/50 text-primary hover:text-primary backdrop-blur-sm transition-all duration-300 relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-ai-accent/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">New Project</span>
              </Button>
            </motion.div>
          </div>
        
        <div className="relative z-10">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.slice(0, 6).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 1.3 + index * 0.1, type: "spring" }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: "0 10px 30px hsl(var(--primary) / 0.2)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-lg bg-gradient-to-br from-surface/50 to-surface-variant/50 border border-border/30 hover:border-primary/30 cursor-pointer backdrop-blur-sm transition-all duration-300 relative overflow-hidden group"
                  onClick={() => onNavigate('editor')}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-ai-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="flex items-center justify-between mb-2 relative z-10">
                    <h4 className="font-medium truncate group-hover:text-primary transition-colors">{project.name}</h4>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Badge variant="secondary" className="text-xs bg-gradient-to-r from-primary/20 to-ai-accent/20 border-primary/30 text-primary">
                        {project.language}
                      </Badge>
                    </motion.div>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors relative z-10">
                    Modified {new Date(project.lastModified).toLocaleDateString()}
                  </p>
                  
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-primary/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-8 relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <motion.div
                animate={{ 
                  y: [-5, 5, -5],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              </motion.div>
              <p className="text-muted-foreground mb-4">No local projects yet - all your work stays private</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => onNavigate('editor')}
                  className="bg-gradient-to-r from-primary to-ai-accent hover:from-primary/80 hover:to-ai-accent/80 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Create Your First Project
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </Card>
      </motion.div>
    </div>
  );
};