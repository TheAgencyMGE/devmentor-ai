import { useState, useCallback } from 'react';
import { devMentorAI } from '@/services/devMentorAI';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  starterCode: string;
  solution: string;
  hints: string[];
  testCases: Array<{
    input: any;
    expectedOutput: any;
    description: string;
  }>;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  concepts: string[];
  exercises: Challenge[];
  estimatedTime: string;
  prerequisites: string[];
}

export const useAIFeatures = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateChallenges = useCallback(async (
    difficulty: 'easy' | 'medium' | 'hard',
    language: string,
    topic?: string
  ): Promise<Challenge[]> => {
    setIsGenerating(true);
    try {
      const prompt = `Generate 3 coding challenges for ${difficulty} level programmers in ${language}${topic ? ` focusing on ${topic}` : ''}.

For each challenge, provide JSON in this exact format:
{
  "challenges": [
    {
      "id": "unique-id",
      "title": "Challenge Title",
      "description": "Clear problem description with examples",
      "difficulty": "${difficulty}",
      "language": "${language}",
      "starterCode": "// Starting code template",
      "solution": "// Complete working solution",
      "hints": ["helpful hint 1", "helpful hint 2"],
      "testCases": [
        {
          "input": "example input",
          "expectedOutput": "expected result",
          "description": "what this test validates"
        }
      ]
    }
  ]
}

Make challenges practical and educational with clear learning objectives.`;

      const result = await devMentorAI.model.generateContent(prompt);
      const response = JSON.parse(result.response.text());
      return response.challenges || [];
    } catch (error) {
      console.error('Challenge generation error:', error);
      return generateFallbackChallenges(difficulty, language);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const generateLearningPath = useCallback(async (
    currentSkill: string,
    targetGoal: string,
    timeCommitment: string
  ): Promise<LearningModule[]> => {
    setIsGenerating(true);
    try {
      const prompt = `Create a comprehensive learning path for someone with ${currentSkill} skills who wants to ${targetGoal} with ${timeCommitment} available.

Generate 5-7 learning modules in JSON format:
{
  "modules": [
    {
      "id": "module-id",
      "title": "Module Title",
      "description": "What students will learn",
      "concepts": ["concept 1", "concept 2"],
      "estimatedTime": "time to complete",
      "prerequisites": ["required knowledge"],
      "exercises": [
        {
          "id": "exercise-id",
          "title": "Exercise Title",
          "description": "Exercise description",
          "difficulty": "easy|medium|hard",
          "language": "javascript",
          "starterCode": "// Code template",
          "solution": "// Solution code",
          "hints": ["hint 1", "hint 2"],
          "testCases": [
            {
              "input": "test input",
              "expectedOutput": "expected output",
              "description": "test description"
            }
          ]
        }
      ]
    }
  ]
}

Make it progressive and practical with hands-on exercises.`;

      const result = await devMentorAI.model.generateContent(prompt);
      const response = JSON.parse(result.response.text());
      return response.modules || [];
    } catch (error) {
      console.error('Learning path generation error:', error);
      return generateFallbackLearningPath();
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const validateSolution = useCallback(async (
    challenge: Challenge,
    userCode: string
  ): Promise<{
    isCorrect: boolean;
    feedback: string;
    suggestions: string[];
    score: number;
  }> => {
    try {
      const prompt = `Evaluate this solution for the coding challenge:

Challenge: ${challenge.title}
Description: ${challenge.description}
Expected Solution: ${challenge.solution}
User's Code: ${userCode}

Provide evaluation in JSON:
{
  "isCorrect": boolean,
  "feedback": "detailed feedback on the solution",
  "suggestions": ["improvement 1", "improvement 2"],
  "score": number (0-100)
}

Be constructive and educational in feedback.`;

      const result = await devMentorAI.model.generateContent(prompt);
      const response = JSON.parse(result.response.text());
      return response;
    } catch (error) {
      console.error('Solution validation error:', error);
      return {
        isCorrect: false,
        feedback: "Unable to validate solution. Please check your code and try again.",
        suggestions: ["Make sure your code runs without errors", "Check if you're addressing all requirements"],
        score: 0
      };
    }
  }, []);

  return {
    generateChallenges,
    generateLearningPath,
    validateSolution,
    isGenerating
  };
};

// Fallback data for when AI fails
const generateFallbackChallenges = (difficulty: string, language: string): Challenge[] => [
  {
    id: 'fallback-1',
    title: 'FizzBuzz Challenge',
    description: 'Write a function that prints numbers 1-100, but prints "Fizz" for multiples of 3, "Buzz" for multiples of 5, and "FizzBuzz" for multiples of both.',
    difficulty: difficulty as any,
    language,
    starterCode: `function fizzBuzz() {
  // Your code here
}`,
    solution: `function fizzBuzz() {
  for (let i = 1; i <= 100; i++) {
    if (i % 15 === 0) console.log("FizzBuzz");
    else if (i % 3 === 0) console.log("Fizz");
    else if (i % 5 === 0) console.log("Buzz");
    else console.log(i);
  }
}`,
    hints: ["Use the modulo operator (%)", "Check for multiples of 15 first"],
    testCases: [
      { input: 3, expectedOutput: "Fizz", description: "Multiple of 3" },
      { input: 5, expectedOutput: "Buzz", description: "Multiple of 5" },
      { input: 15, expectedOutput: "FizzBuzz", description: "Multiple of both 3 and 5" }
    ]
  }
];

const generateFallbackLearningPath = (): LearningModule[] => [
  {
    id: 'js-basics',
    title: 'JavaScript Fundamentals',
    description: 'Learn the core concepts of JavaScript programming',
    concepts: ['Variables', 'Functions', 'Loops', 'Conditionals'],
    estimatedTime: '2 weeks',
    prerequisites: ['Basic computer literacy'],
    exercises: generateFallbackChallenges('easy', 'javascript')
  }
];