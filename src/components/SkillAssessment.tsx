import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, Code, Target, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { devMentorAI } from '@/services/devMentorAI';
import { useUserStats } from '@/hooks/useLocalStorage';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: '1',
    question: 'What is a variable in programming?',
    options: [
      'A container that stores data values',
      'A function that performs calculations',
      'A loop that repeats code',
      'A conditional statement'
    ],
    correctAnswer: 0,
    explanation: 'A variable is a container that stores data values that can be used throughout your program.',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'Which of the following is the correct way to declare a function in JavaScript?',
    options: [
      'function myFunction() {}',
      'def myFunction() {}',
      'func myFunction() {}',
      'function myFunction[] {}'
    ],
    correctAnswer: 0,
    explanation: 'In JavaScript, functions are declared using the "function" keyword followed by the function name and parentheses.',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What does "const" mean in JavaScript?',
    options: [
      'It creates a variable that can be changed',
      'It creates a constant that cannot be reassigned',
      'It creates a temporary variable',
      'It creates a global variable'
    ],
    correctAnswer: 1,
    explanation: 'The "const" keyword creates a constant that cannot be reassigned after its initial declaration.',
    difficulty: 'beginner'
  },
  {
    id: '4',
    question: 'What is the purpose of a for loop?',
    options: [
      'To make decisions in code',
      'To repeat code a specific number of times',
      'To store multiple values',
      'To define a function'
    ],
    correctAnswer: 1,
    explanation: 'A for loop is used to repeat a block of code a specific number of times.',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    question: 'What is an array?',
    options: [
      'A single data value',
      'A collection of related data items',
      'A type of function',
      'A conditional statement'
    ],
    correctAnswer: 1,
    explanation: 'An array is a data structure that can store multiple values in a single variable.',
    difficulty: 'intermediate'
  }
];

interface SkillAssessmentProps {
  onComplete?: (result: any) => void;
}

export const SkillAssessment: React.FC<SkillAssessmentProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useUserStats();

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      setSelectedAnswer('');

      if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        completeAssessment(newAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || '');
      setAnswers(answers.slice(0, -1));
    }
  };

  const completeAssessment = async (finalAnswers: string[]) => {
    setIsLoading(true);
    
    try {
      // Calculate score
      let calculatedScore = 0;
      const answeredQuestions = ASSESSMENT_QUESTIONS.map((question, index) => {
        const userAnswer = parseInt(finalAnswers[index]);
        const isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) calculatedScore++;
        
        return {
          question: question.question,
          answer: question.options[userAnswer] || 'No answer',
          correct: isCorrect
        };
      });

      // Determine skill level based on score
      const percentage = (calculatedScore / ASSESSMENT_QUESTIONS.length) * 100;
      let skillLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
      
      if (percentage >= 80) skillLevel = 'advanced';
      else if (percentage >= 60) skillLevel = 'intermediate';

      // Get AI assessment
      const codeExamples = ['console.log("Hello World");'];
      const assessment = await devMentorAI.assessSkill(codeExamples, answeredQuestions);

      const assessmentResults = {
        score: calculatedScore,
        totalQuestions: ASSESSMENT_QUESTIONS.length,
        percentage,
        skillLevel,
        ...assessment,
        answeredQuestions
      };

      setResults(assessmentResults);
      setIsCompleted(true);

      // Update user stats
      setStats({
        ...stats,
        totalChallengesSolved: stats.totalChallengesSolved + 1
      });

      // Don't call onComplete here - only when user clicks "Continue Learning Journey"
    } catch (error) {
      console.error('Assessment error:', error);
      // Calculate fallback score
      let fallbackScore = 0;
      ASSESSMENT_QUESTIONS.forEach((question, index) => {
        const userAnswer = parseInt(finalAnswers[index]);
        const isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) fallbackScore++;
      });
      
      // Fallback results
      const fallbackResults = {
        score: fallbackScore,
        totalQuestions: ASSESSMENT_QUESTIONS.length,
        percentage: (fallbackScore / ASSESSMENT_QUESTIONS.length) * 100,
        skillLevel: 'beginner' as const,
        strengths: ['Basic understanding'],
        areasForImprovement: ['Continue practicing'],
        recommendedTopics: ['Variables', 'Functions', 'Loops'],
        estimatedLearningTime: '2-3 months'
      };
      setResults(fallbackResults);
      setIsCompleted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-blue-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="card-gradient p-8 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold mb-2">Analyzing Your Skills...</h3>
        <p className="text-muted-foreground">
          AI is evaluating your responses and creating a personalized assessment
        </p>
      </Card>
    );
  }

  if (isCompleted && results) {
    return (
      <Card className="card-gradient p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
          <p className="text-muted-foreground">
            Here's your personalized skill evaluation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Score Overview */}
          <Card className="card-glow p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Your Score
            </h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {results.score}/{results.totalQuestions}
              </div>
              <div className="text-2xl font-semibold mb-2">
                {Math.round(results.percentage)}%
              </div>
              <Badge className={`${getSkillLevelColor(results.skillLevel)} text-white`}>
                {results.skillLevel} Level
              </Badge>
            </div>
          </Card>

          {/* Skill Breakdown */}
          <Card className="card-glow p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-ai-accent" />
              AI Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-success mb-2">Strengths:</h4>
                <ul className="text-sm space-y-1">
                  {results.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-warning mb-2">Areas to Improve:</h4>
                <ul className="text-sm space-y-1">
                  {results.areasForImprovement.map((area: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-warning" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Recommended Learning Path */}
        <Card className="card-glow p-6 mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Recommended Next Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Topics to Study:</h4>
              <div className="flex flex-wrap gap-2">
                {results.recommendedTopics.map((topic: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Estimated Learning Time:</h4>
              <p className="text-primary font-semibold">{results.estimatedLearningTime}</p>
            </div>
          </div>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => onComplete?.(results)}
            className="btn-primary"
          >
            Continue Learning Journey
          </Button>
        </div>
      </Card>
    );
  }

  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  const progressPercentage = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <Card className="card-gradient p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Skill Assessment</h2>
        <p className="text-muted-foreground mb-4">
          Answer these questions to help us understand your programming level
        </p>
        <div className="flex items-center gap-4 justify-center">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
          </span>
          <Progress value={progressPercentage} className="w-32" />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        className="mb-8"
      >
        <Card className="card-glow p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <Badge 
              variant="secondary" 
              className={`${getSkillLevelColor(question.difficulty)} text-white`}
            >
              {question.difficulty}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-surface transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Card>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn-glass"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={!selectedAnswer}
          className="btn-primary"
        >
          {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? 'Complete' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </Card>
  );
};