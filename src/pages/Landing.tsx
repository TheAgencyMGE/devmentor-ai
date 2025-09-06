import React, { Suspense, useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Brain, 
  Code, 
  Sparkles, 
  ArrowRight,
  CheckCircle,
  Rocket,
  Bot,
  Star,
  Users,
  Globe,
  Shield,
  Terminal,
  Database,
  Binary,
  ChevronDown,
  Lightbulb,
  TrendingUp,
  Award,
  Clock,
  Eye,
  Zap as Lightning
} from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const Landing = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const handleLaunch = () => {
    navigate('/app');
  };

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Simple loading sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Click effects with pure CSS animation
  const handleClick = (e: React.MouseEvent) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top = e.clientY + 'px';
    document.body.appendChild(ripple);

    setTimeout(() => {
      if (document.body.contains(ripple)) {
        document.body.removeChild(ripple);
      }
    }, 1000);
  };

  const features = [
    {
      icon: <Brain className="w-10 h-10" />,
      title: "AI Code Analysis",
      description: "Get intelligent code suggestions, bug detection, and optimization tips from your AI mentor",
      tech: "AI Powered",
      color: "from-primary to-ai-accent",
      stats: "Real-time help"
    },
    {
      icon: <Terminal className="w-10 h-10" />,
      title: "Browser Code Editor",
      description: "Write and run code directly in your browser with syntax highlighting and error detection",
      tech: "Monaco Editor",
      color: "from-primary to-ai-accent",
      stats: "25+ languages"
    },
    {
      icon: <Lightbulb className="w-10 h-10" />,
      title: "Interactive Challenges",
      description: "Practice with AI-generated coding challenges tailored to your skill level",
      tech: "Adaptive",
      color: "from-primary to-ai-accent",
      stats: "Personalized"
    },
    {
      icon: <Database className="w-10 h-10" />,
      title: "Local Processing",
      description: "All code execution and data processing happens locally in your browser - complete privacy",
      tech: "Client-Side",
      color: "from-primary to-ai-accent",
      stats: "100% private"
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Progress Tracking",
      description: "Track your learning progress with detailed analytics stored locally on your device",
      tech: "Local Storage",
      color: "from-primary to-ai-accent",
      stats: "Your data only"
    },
    {
      icon: <Code className="w-10 h-10" />,
      title: "Project Building",
      description: "Build real projects with step-by-step guidance from your AI programming mentor",
      tech: "Project-Based",
      color: "from-primary to-ai-accent",
      stats: "Hands-on"
    }
  ];

  const stats = [
    { 
      number: "100%", 
      label: "Browser-Based", 
      icon: <Globe className="w-8 h-8" />,
      description: "No downloads"
    },
    { 
      number: "25+", 
      label: "Programming Languages", 
      icon: <Code className="w-8 h-8" />,
      description: "Supported"
    },
    { 
      number: "0", 
      label: "Data Stored", 
      icon: <Shield className="w-8 h-8" />,
      description: "Privacy first"
    },
    { 
      number: "24/7", 
      label: "Local Processing", 
      icon: <Lightning className="w-8 h-8" />,
      description: "Always private"
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Complete Privacy",
      description: "Your code never leaves your browser. All processing happens locally for maximum security."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Guidance",
      description: "Get intelligent suggestions, code reviews, and personalized learning paths from your AI mentor."
    },
    {
      icon: <Lightning className="w-8 h-8" />,
      title: "Instant Feedback",
      description: "Run code immediately in your browser and get real-time feedback on your programming solutions."
    }
  ];

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100
      }
    }
  };

  const scaleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 200
      }
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden" onClick={handleClick}>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                damping: 15, 
                stiffness: 300,
                delay: 0.2 
              }}
              className="flex space-x-2 mb-8"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: i * 0.1,
                    type: "spring",
                    damping: 20,
                    stiffness: 300
                  }}
                  className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full loading-pulse"
                />
              ))}
            </motion.div>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.8,
                type: "spring",
                damping: 20,
                stiffness: 100
              }}
              className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Loading Code Environment...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particle Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.3,
              scale: [0.5, 1, 0.5],
              y: [-20, 20, -20],
              x: [-10, 10, -10]
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="particle absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      {/* Mouse Follower */}
      <motion.div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        animate={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 500,
          mass: 0.5
        }}
      >
        <div className="w-5 h-5 bg-white rounded-full opacity-50" />
      </motion.div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 3D Background */}
        <div className="absolute inset-0">
          <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20" />}>
            <Spline 
              scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" 
              className="w-full h-full opacity-30"
            />
          </Suspense>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { size: 'w-20 h-20', pos: 'top-20 left-20', color: 'from-purple-500/20 to-pink-500/20' },
            { size: 'w-32 h-32', pos: 'top-40 right-32', color: 'from-blue-500/20 to-cyan-500/20' },
            { size: 'w-24 h-24', pos: 'bottom-32 left-1/4', color: 'from-green-500/20 to-emerald-500/20' },
            { size: 'w-16 h-16', pos: 'bottom-20 right-20', color: 'from-yellow-500/20 to-orange-500/20' }
          ].map((blob, i) => (
            <motion.div
              key={i}
              className={`floating-element absolute ${blob.pos} ${blob.size} bg-gradient-to-r ${blob.color} rounded-full blur-xl`}
              animate={{
                y: [-20, 20, -20],
                x: [-10, 10, -10],
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ y, opacity, scale }}
          className="relative z-10 container mx-auto px-4 text-center"
        >
          <motion.div
            variants={scaleVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 2.2 }}
            className="mb-8 inline-block"
          >
            <Badge className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/30 backdrop-blur-xl">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-6 h-6 mr-3" />
              </motion.div>
              DevMentor AI
              <Lightning className="w-6 h-6 ml-3" />
            </Badge>
          </motion.div>

          <div className="mb-8">
            <motion.h1 
              className="text-7xl md:text-9xl font-black leading-none mb-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 2.4 }}
            >
              {['CODE', 'EVOLVE', 'DOMINATE'].map((word, i) => (
                <motion.div
                  key={word}
                  variants={itemVariants}
                  className={`${
                    i === 0 ? 'bg-gradient-to-r from-white via-purple-200 to-white' :
                    i === 1 ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400' :
                    'bg-gradient-to-r from-white via-blue-200 to-white'
                  } bg-clip-text text-transparent`}
                >
                  {word}
                </motion.div>
              ))}
            </motion.h1>
          </div>

          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              delay: 3.2,
              type: "spring",
              damping: 20,
              stiffness: 100
            }}
            className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto mb-12 font-light leading-relaxed"
          >
            Unleash your programming potential with our revolutionary AI mentor that learns, adapts, and evolves with you. 
            <span className="text-purple-400 font-semibold"> The future of coding education is here.</span>
          </motion.p>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              delay: 3.6,
              type: "spring",
              damping: 15,
              stiffness: 200
            }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleLaunch}
                size="lg" 
                className="text-xl px-12 py-8 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 group relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: [-300, 300] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                />
                <motion.div
                  animate={{ 
                    rotateX: [0, 10, 0],
                    rotateY: [0, -10, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Rocket className="w-8 h-8 mr-4 relative z-10" />
                </motion.div>
                <span className="relative z-10 font-black">START CODING</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-8 h-8 ml-4 relative z-10" />
                </motion.div>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/app?section=assessment')}
                variant="outline" 
                size="lg"
                className="text-xl px-12 py-8 border-2 border-purple-500/30 hover:border-purple-400/60 bg-black/50 backdrop-blur-xl hover:bg-purple-900/20 transition-all duration-300 text-white"
              >
                <Brain className="w-8 h-8 mr-4" />
                Take Assessment
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-purple-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Built for Learners
            </h2>
            <p className="text-2xl text-gray-400 max-w-3xl mx-auto">
              Real features designed for effective programming education
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.2 }
                }}
                className="text-center group"
              >
                <Card className="p-8 bg-gradient-to-br from-surface/80 to-surface-variant/80 border-border/50 hover:border-primary/30 transition-all duration-500 backdrop-blur-xl">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-purple-600/40 group-hover:to-pink-600/40 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div className="text-purple-400">{stat.icon}</div>
                  </motion.div>
                  <motion.div 
                    className="text-5xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-3 counter-up"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-foreground font-bold text-lg mb-2">
                    {stat.label}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.description}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-8 px-8 py-3 bg-gradient-to-r from-primary/10 to-ai-accent/10 border-primary/20 text-white text-lg">
              <Binary className="w-6 h-6 mr-3" />
              AI-Powered Learning
            </Badge>
            <h2 className="text-6xl md:text-7xl font-black mb-8">
              <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                Smart
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-ai-accent bg-clip-text text-transparent">
                Learning
              </span>
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">
              Learn programming with personalized AI guidance and hands-on practice
            </p>
          </motion.div>
          
          <motion.div 
            className="grid lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  rotateX: 5,
                  transition: { duration: 0.3 }
                }}
                className="group"
              >
                <Card className="p-10 h-full bg-gradient-to-br from-surface/50 to-surface-variant/50 border-border/30 hover:border-primary/30 transition-all duration-700 backdrop-blur-xl relative overflow-hidden">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                  
                  {/* Icon */}
                  <motion.div 
                    className="relative w-24 h-24 bg-gradient-to-br from-primary/20 to-ai-accent/20 rounded-2xl flex items-center justify-center mb-8 text-primary group-hover:from-primary/40 group-hover:to-ai-accent/40 transition-all duration-300"
                    whileHover={{ 
                      rotate: [0, -10, 10, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  {/* Tech Badge */}
                  <Badge className="mb-6 bg-gradient-to-r from-primary/20 to-ai-accent/20 border-primary/30 text-white">
                    {feature.tech}
                  </Badge>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg mb-6">
                    {feature.description}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center">
                    <span className="text-primary font-bold">{feature.stats}</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </motion.div>
                  </div>
                  
                  {/* Hover Glow */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-ai-accent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-8 px-8 py-3 bg-gradient-to-r from-primary/10 to-ai-accent/10 border-primary/20 text-white text-lg">
              <Award className="w-6 h-6 mr-3" />
              Why Choose DevMentor
            </Badge>
            <h2 className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Privacy First
            </h2>
            <p className="text-2xl text-muted-foreground max-w-4xl mx-auto">
              Learn programming with AI assistance while keeping your code completely private
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group text-center"
              >
                <Card className="p-8 h-full bg-gradient-to-br from-surface/50 to-surface-variant/50 border-border/30 hover:border-primary/30 transition-all duration-700 backdrop-blur-xl">
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-primary/20 to-ai-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary group-hover:from-primary/40 group-hover:to-ai-accent/40 transition-all duration-300"
                    whileHover={{ 
                      rotate: [0, -5, 5, 0],
                      scale: 1.1
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {benefit.icon}
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-ai-accent/20 to-primary/20" />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle absolute w-2 h-2 bg-primary rounded-full opacity-20"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%'
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.02, 1],
                rotate: [0, 1, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Badge className="mb-12 px-12 py-4 text-xl font-bold bg-gradient-to-r from-primary/20 to-ai-accent/20 border-primary/30 text-white backdrop-blur-xl">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Brain className="w-8 h-8 mr-4" />
                </motion.div>
                Start Learning Today
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 ml-4" />
                </motion.div>
              </Badge>
            </motion.div>
            
            <motion.h2 
              className="text-7xl md:text-9xl font-black mb-12 leading-none"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Ready to
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-ai-accent to-primary bg-clip-text text-transparent">
                Code?
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-3xl md:text-4xl text-muted-foreground mb-16 max-w-5xl mx-auto font-light"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Start learning with your <span className="text-primary font-bold">AI programming mentor</span> - completely private and browser-based
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleLaunch}
                  size="lg" 
                  className="text-2xl px-16 py-10 bg-gradient-to-r from-primary via-ai-accent to-primary hover:from-primary/80 hover:via-ai-accent/80 hover:to-primary/80 text-primary-foreground shadow-2xl hover:shadow-primary/25 transition-all duration-500 group relative overflow-hidden"
                >
                  <motion.div
                    animate={{ 
                      x: [-400, 400],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                  />
                  <motion.div
                    animate={{ 
                      rotateX: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Rocket className="w-10 h-10 mr-5 relative z-10" />
                  </motion.div>
                  <span className="relative z-10 font-black">START CODING</span>
                  <motion.div
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Lightning className="w-10 h-10 ml-5 relative z-10" />
                  </motion.div>
                </Button>
              </motion.div>
              
              <motion.div 
                className="text-center sm:text-left"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                  <div className="flex -space-x-3">
                    {[1,2,3,4,5].map(i => (
                      <motion.div 
                        key={i} 
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-black"
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        viewport={{ once: true }}
                      />
                    ))}
                  </div>
                  <span className="text-xl font-bold text-primary">Privacy First</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-muted-foreground">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                        viewport={{ once: true }}
                      >
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <span className="font-bold text-xl">Browser-Based</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              viewport={{ once: true }}
            >
              {[
                { icon: <CheckCircle className="w-6 h-6 text-success" />, text: "No account required" },
                { icon: <Lightning className="w-6 h-6 text-primary" />, text: "Instant access" },
                { icon: <Shield className="w-6 h-6 text-primary" />, text: "Complete privacy" },
                { icon: <Brain className="w-6 h-6 text-ai-accent" />, text: "AI-powered learning" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-3 text-lg font-medium"
                  whileHover={{ scale: 1.05, y: -2 }}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {item.icon}
                  </motion.div>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-border/50 bg-gradient-to-br from-background to-surface">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-r from-primary to-ai-accent rounded-2xl flex items-center justify-center"
                whileHover={{ 
                  rotate: 360,
                  scale: 1.1
                }}
                transition={{ duration: 0.6 }}
              >
                <Brain className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <span className="text-4xl font-black bg-gradient-to-r from-primary to-ai-accent bg-clip-text text-transparent">
                DevMentor AI
              </span>
            </div>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Learn programming with AI guidance - private, browser-based, and free
            </p>
            <div className="text-muted-foreground">
              © 2025 DevMentor AI. Privacy-first programming education.
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Custom CSS Animations */}
      <style>{`
        .loading-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .counter-up {
          animation: countUp 0.8s ease-out;
        }
        
        .click-ripple {
          position: fixed;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.4) 50%, transparent 70%);
          pointer-events: none;
          z-index: 9999;
          animation: rippleEffect 1s ease-out forwards;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes countUp {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes rippleEffect {
          0% {
            transform: scale(0);
            opacity: 0.8;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        .floating-element {
          will-change: transform;
        }

        .particle {
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
};

export default Landing;