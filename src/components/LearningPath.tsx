import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeEditor } from '@/components/CodeEditor';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Target, 
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIFeatures, type LearningModule, type Challenge } from '@/hooks/useAIFeatures';

export const LearningPath: React.FC = () => {
  const [currentSkill, setCurrentSkill] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('');
  const [learningPath, setLearningPath] = useState<LearningModule[]>([]);
  const [currentModule, setCurrentModule] = useState<LearningModule | null>(null);
  const [currentExercise, setCurrentExercise] = useState<Challenge | null>(null);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [showPathGenerator, setShowPathGenerator] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const { generateLearningPath, validateSolution, isGenerating } = useAIFeatures();

  const handleGeneratePath = async () => {
    if (!currentSkill || !targetGoal || !timeCommitment) {
      alert('Please fill in all fields');
      return;
    }

    const modules = await generateLearningPath(currentSkill, targetGoal, timeCommitment);
    setLearningPath(modules);
    setShowPathGenerator(false);
    
    if (modules.length > 0) {
      selectModule(modules[0]);
    }
  };

  const selectModule = (module: LearningModule) => {
    setCurrentModule(module);
    if (module.exercises.length > 0) {
      setCurrentExercise(module.exercises[0]);
      setUserCode(module.exercises[0].starterCode);
      setExerciseIndex(0);
    }
  };

  const nextExercise = () => {
    if (!currentModule) return;
    
    const nextIndex = exerciseIndex + 1;
    if (nextIndex < currentModule.exercises.length) {
      setExerciseIndex(nextIndex);
      setCurrentExercise(currentModule.exercises[nextIndex]);
      setUserCode(currentModule.exercises[nextIndex].starterCode);
    }
  };

  const previousExercise = () => {
    if (!currentModule) return;
    
    const prevIndex = exerciseIndex - 1;
    if (prevIndex >= 0) {
      setExerciseIndex(prevIndex);
      setCurrentExercise(currentModule.exercises[prevIndex]);
      setUserCode(currentModule.exercises[prevIndex].starterCode);
    }
  };

  const submitExercise = async () => {
    if (!currentExercise) return;
    
    const validation = await validateSolution(currentExercise, userCode);
    
    if (validation.isCorrect && !completedExercises.includes(currentExercise.id)) {
      setCompletedExercises([...completedExercises, currentExercise.id]);
      
      // Auto-advance to next exercise after 2 seconds
      setTimeout(() => {
        nextExercise();
      }, 2000);
    }
  };

  const getModuleProgress = (module: LearningModule) => {
    const completed = module.exercises.filter(ex => completedExercises.includes(ex.id)).length;
    return (completed / module.exercises.length) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isGenerating) {
    return (
      <div className="p-8">
        <Card className="card-gradient p-8 text-center max-w-2xl mx-auto">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">AI Creating Your Learning Path...</h3>
          <p className="text-muted-foreground">
            Generating personalized curriculum based on your goals
          </p>
        </Card>
      </div>
    );
  }

  if (showPathGenerator) {
    return (
      <div className="p-8">
        <Card className="card-gradient p-8 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">AI Learning Path Generator</h2>
            <p className="text-muted-foreground">
              Tell us about your goals and we'll create a personalized learning journey
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Current Programming Experience</label>
              <Textarea
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                placeholder="e.g., I know basic JavaScript and HTML/CSS, familiar with variables and functions..."
                className="bg-surface border-border/20"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Learning Goal</label>
              <Textarea
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="e.g., Build modern web applications with React, become a full-stack developer..."
                className="bg-surface border-border/20"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Time Commitment</label>
              <Select value={timeCommitment} onValueChange={setTimeCommitment}>
                <SelectTrigger className="bg-surface border-border/20">
                  <SelectValue placeholder="Select your available time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30 minutes per day">30 minutes per day</SelectItem>
                  <SelectItem value="1 hour per day">1 hour per day</SelectItem>
                  <SelectItem value="2-3 hours per day">2-3 hours per day</SelectItem>
                  <SelectItem value="4+ hours per day">4+ hours per day</SelectItem>
                  <SelectItem value="weekends only">Weekends only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGeneratePath}
              disabled={!currentSkill || !targetGoal || !timeCommitment}
              className="btn-primary w-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate My Learning Path
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <Card className="card-gradient p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">AI Learning Path</h1>
              <p className="text-muted-foreground">Personalized curriculum for your goals</p>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowPathGenerator(true)}
            className="btn-glass"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            New Path
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Module List */}
        <Card className="card-gradient p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Learning Modules ({learningPath.length})
          </h3>
          
          <div className="space-y-3">
            {learningPath.map((module, index) => {
              const progress = getModuleProgress(module);
              const isActive = currentModule?.id === module.id;
              
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isActive
                      ? 'border-primary bg-primary/10'
                      : 'border-border/20 bg-surface hover:bg-surface-variant'
                  }`}
                  onClick={() => selectModule(module)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm pr-2">{module.title}</h4>
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{module.description}</p>
                  
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1" />
                  
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-xs">
                      {module.exercises.length} exercises
                    </Badge>
                    <span className="text-xs text-muted-foreground">{module.estimatedTime}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {currentModule && currentExercise ? (
            <>
              {/* Module Header */}
              <Card className="card-gradient p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{currentModule.title}</h2>
                    <p className="text-muted-foreground mb-4">{currentModule.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentModule.concepts.map((concept) => (
                        <Badge key={concept} variant="secondary" className="text-xs">
                          {concept}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>📖 {currentModule.estimatedTime}</span>
                      <span>🎯 Exercise {exerciseIndex + 1} of {currentModule.exercises.length}</span>
                    </div>
                  </div>
                </div>

                <Progress 
                  value={getModuleProgress(currentModule)} 
                  className="h-2"
                />
              </Card>

              {/* Current Exercise */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Exercise Details */}
                <Card className="card-gradient p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{currentExercise.title}</h3>
                    <Badge className={`text-white ${getDifficultyColor(currentExercise.difficulty)}`}>
                      {currentExercise.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{currentExercise.description}</p>
                  
                  {currentExercise.hints.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-warning" />
                        Hints
                      </h4>
                      {currentExercise.hints.map((hint, index) => (
                        <div key={index} className="text-sm p-2 bg-warning/10 border border-warning/20 rounded">
                          {hint}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button 
                      onClick={previousExercise}
                      disabled={exerciseIndex === 0}
                      size="sm"
                      className="btn-glass"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    
                    <Button 
                      onClick={submitExercise}
                      className="btn-primary flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Submit Solution
                    </Button>
                    
                    <Button 
                      onClick={nextExercise}
                      disabled={exerciseIndex === currentModule.exercises.length - 1}
                      size="sm"
                      className="btn-glass"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>

                {/* Code Editor */}
                <div>
                  <h4 className="font-semibold mb-2">Your Solution</h4>
                  <CodeEditor
                    value={userCode}
                    onChange={setUserCode}
                    language={currentExercise.language}
                    height="400px"
                  />
                </div>
              </div>
            </>
          ) : (
            <Card className="card-gradient p-8 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select a Module</h3>
              <p className="text-muted-foreground">
                Choose a learning module from the list to start your journey
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};