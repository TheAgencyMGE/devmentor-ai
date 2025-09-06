import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CodeEditor } from '@/components/CodeEditor';
import { 
  Target, 
  Play, 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Clock,
  Star,
  Zap,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIFeatures, type Challenge } from '@/hooks/useAIFeatures';
import { useCodeExecution } from '@/hooks/useCodeExecution';

export const Challenges: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [userCode, setUserCode] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const { generateChallenges, validateSolution, isGenerating } = useAIFeatures();
  const { executeCode, result, isRunning } = useCodeExecution();

  useEffect(() => {
    loadChallenges();
  }, [selectedDifficulty, selectedLanguage]);

  const loadChallenges = async () => {
    const newChallenges = await generateChallenges(selectedDifficulty, selectedLanguage);
    setChallenges(newChallenges);
    if (newChallenges.length > 0 && !currentChallenge) {
      selectChallenge(newChallenges[0]);
    }
  };

  const selectChallenge = (challenge: Challenge) => {
    setCurrentChallenge(challenge);
    setUserCode(challenge.starterCode);
    setShowHints(false);
    setValidationResult(null);
  };

  const runCode = async () => {
    if (userCode.trim()) {
      await executeCode(userCode, selectedLanguage);
    }
  };

  const submitSolution = async () => {
    if (!currentChallenge) return;
    
    const validation = await validateSolution(currentChallenge, userCode);
    setValidationResult(validation);
    
    if (validation.isCorrect && !completedChallenges.includes(currentChallenge.id)) {
      setCompletedChallenges([...completedChallenges, currentChallenge.id]);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  if (isGenerating && challenges.length === 0) {
    return (
      <div className="p-8">
        <Card className="card-gradient p-8 text-center max-w-2xl mx-auto">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">Generating AI Challenges...</h3>
          <p className="text-muted-foreground">
            Creating personalized coding challenges for {selectedDifficulty} level
          </p>
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
            <Target className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">AI-Powered Challenges</h1>
              <p className="text-muted-foreground">Practice coding with AI-generated problems</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedDifficulty} onValueChange={(value: any) => setSelectedDifficulty(value)}>
              <SelectTrigger className="bg-surface border-border/20 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="bg-surface border-border/20 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={loadChallenges} disabled={isGenerating} className="btn-primary">
              <RefreshCw className={`w-4 h-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
              New Challenges
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Challenge List */}
        <Card className="card-gradient p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-warning" />
            Challenges ({challenges.length})
          </h3>
          
          <div className="space-y-2">
            {challenges.map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  currentChallenge?.id === challenge.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border/20 bg-surface hover:bg-surface-variant'
                }`}
                onClick={() => selectChallenge(challenge)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{challenge.title}</h4>
                  {completedChallenges.includes(challenge.id) && (
                    <CheckCircle className="w-4 h-4 text-success" />
                  )}
                </div>
                <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Main Challenge Area */}
        <div className="lg:col-span-3 space-y-4">
          {currentChallenge ? (
            <>
              {/* Challenge Details */}
              <Card className="card-gradient p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold">{currentChallenge.title}</h2>
                      <Badge className={getDifficultyColor(currentChallenge.difficulty)}>
                        {currentChallenge.difficulty}
                      </Badge>
                      {completedChallenges.includes(currentChallenge.id) && (
                        <Badge className="bg-success text-white">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{currentChallenge.description}</p>
                  </div>
                </div>

                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="hints">Hints</TabsTrigger>
                    <TabsTrigger value="tests">Test Cases</TabsTrigger>
                    <TabsTrigger value="solution">Solution</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="mt-4">
                    <div className="prose prose-invert max-w-none">
                      <p>{currentChallenge.description}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="hints" className="mt-4">
                    <div className="space-y-2">
                      {currentChallenge.hints.map((hint, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                          <Lightbulb className="w-4 h-4 text-warning mt-0.5" />
                          <span className="text-sm">{hint}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tests" className="mt-4">
                    <div className="space-y-2">
                      {currentChallenge.testCases.map((test, index) => (
                        <div key={index} className="p-3 bg-surface rounded-lg border border-border/20">
                          <div className="text-sm">
                            <div><strong>Input:</strong> {JSON.stringify(test.input)}</div>
                            <div><strong>Expected:</strong> {JSON.stringify(test.expectedOutput)}</div>
                            <div className="text-muted-foreground">{test.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="solution" className="mt-4">
                    <div className="bg-surface rounded-lg p-4 border border-border/20">
                      <pre className="text-sm overflow-auto">
                        <code>{currentChallenge.solution}</code>
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>

              {/* Code Editor */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Your Solution</h3>
                    <div className="flex gap-2">
                      <Button onClick={runCode} disabled={isRunning} size="sm" className="btn-glass">
                        <Play className="w-4 h-4 mr-1" />
                        Run
                      </Button>
                      <Button onClick={submitSolution} size="sm" className="btn-primary">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Submit
                      </Button>
                    </div>
                  </div>
                  
                  <CodeEditor
                    value={userCode}
                    onChange={setUserCode}
                    language={selectedLanguage}
                    height="400px"
                  />
                </div>

                {/* Results */}
                <div className="space-y-4">
                  {/* Code Output */}
                  {(result.output || result.error) && (
                    <Card className="card-gradient p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Code Output
                      </h4>
                      <pre className={`text-sm p-3 rounded-lg overflow-auto ${
                        result.error ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
                      }`}>
                        {result.error || result.output}
                      </pre>
                    </Card>
                  )}

                  {/* AI Validation */}
                  <AnimatePresence>
                    {validationResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <Card className="card-gradient p-4">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            {validationResult.isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <XCircle className="w-5 h-5 text-destructive" />
                            )}
                            AI Validation ({validationResult.score}/100)
                          </h4>
                          
                          <div className="space-y-3">
                            <p className="text-sm">{validationResult.feedback}</p>
                            
                            {validationResult.suggestions.length > 0 && (
                              <div>
                                <h5 className="font-medium text-sm mb-2">Suggestions:</h5>
                                <ul className="space-y-1">
                                  {validationResult.suggestions.map((suggestion: string, index: number) => (
                                    <li key={index} className="text-sm text-muted-foreground">
                                      • {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          ) : (
            <Card className="card-gradient p-8 text-center">
              <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Select a Challenge</h3>
              <p className="text-muted-foreground">
                Choose a challenge from the list to start coding
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};