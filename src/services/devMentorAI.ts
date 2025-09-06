import { GoogleGenerativeAI } from '@google/generative-ai';

export interface CodeReview {
  overallRating: number;
  strengths: string[];
  improvements: Array<{
    issue: string;
    explanation: string;
    suggestedFix: string;
    lineNumber?: number;
  }>;
  conceptsToLearn: string[];
  bestPractices: string[];
  nextSteps: string;
}

export interface ConceptExplanation {
  simpleExplanation: string;
  detailedExplanation: string;
  codeExample: string;
  commonMistakes: string[];
  practiceExercises: Array<{
    description: string;
    difficulty: string;
    starterCode: string;
  }>;
  relatedConcepts: string[];
}

export interface LearningPath {
  pathName: string;
  estimatedDuration: string;
  phases: Array<{
    phase: string;
    duration: string;
    topics: string[];
    projects: Array<{
      name: string;
      description: string;
      skills: string[];
    }>;
    milestones: string[];
  }>;
  dailyRoutine: string;
  resources: string[];
}

export interface DebuggingGuidance {
  errorAnalysis: string;
  possibleCauses: string[];
  debuggingSteps: Array<{
    step: string;
    action: string;
    expectedResult: string;
  }>;
  fixedCode: string;
  explanation: string;
  preventionTips: string[];
}

export interface SkillAssessment {
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  areasForImprovement: string[];
  recommendedTopics: string[];
  estimatedLearningTime: string;
}

export class DevMentorAIService {
  private genAI: GoogleGenerativeAI;
  public model: any;

  constructor() {
    // Using the API key from environment variables
    const apiKey = import.meta.env.VITE_GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GOOGLE_AI_API_KEY environment variable is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.3,
        topK: 32,
        topP: 0.8,
        maxOutputTokens: 4096,
      }
    });
  }

  async reviewCode(
    code: string,
    language: string = 'javascript',
    skillLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ): Promise<CodeReview> {
    const prompt = `As DevMentor AI, an expert programming tutor, review this ${language} code for a ${skillLevel} developer:

\`\`\`${language}
${code}
\`\`\`

Provide comprehensive, educational feedback in JSON format:
{
  "overallRating": number (1-10),
  "strengths": ["specific positive aspects"],
  "improvements": [
    {
      "issue": "clear issue description",
      "explanation": "why this is an issue for ${skillLevel} level",
      "suggestedFix": "specific code improvement",
      "lineNumber": number (if applicable)
    }
  ],
  "conceptsToLearn": ["programming concepts to study"],
  "bestPractices": ["coding standards and practices"],
  "nextSteps": "what to learn or practice next"
}

Focus on educational value and adapt explanations to ${skillLevel} level.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(response);
    } catch (error) {
      console.error('Code review error:', error);
      return this.getDefaultCodeReview();
    }
  }

  async explainConcept(
    concept: string,
    currentCode: string = '',
    skillLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner'
  ): Promise<ConceptExplanation> {
    const prompt = `As DevMentor AI, explain the programming concept "${concept}" to a ${skillLevel} developer.

${currentCode ? `Context code:\n\`\`\`\n${currentCode}\n\`\`\`` : ''}

Provide a comprehensive explanation in JSON format:
{
  "simpleExplanation": "easy-to-understand explanation",
  "detailedExplanation": "in-depth technical explanation",
  "codeExample": "practical code demonstration",
  "commonMistakes": ["typical errors beginners make"],
  "practiceExercises": [
    {
      "description": "hands-on exercise description",
      "difficulty": "easy/medium/hard",
      "starterCode": "code template to begin with"
    }
  ],
  "relatedConcepts": ["connected programming topics"]
}

Make it practical and educational for ${skillLevel} level.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(response);
    } catch (error) {
      console.error('Concept explanation error:', error);
      return this.getDefaultConceptExplanation();
    }
  }

  async generateLearningPath(
    currentSkills: string[],
    goals: string[],
    timeCommitment: string
  ): Promise<LearningPath> {
    const prompt = `Create a personalized learning path for a developer with:

Current Skills: ${currentSkills.join(', ')}
Goals: ${goals.join(', ')}
Time Commitment: ${timeCommitment}

Generate a structured learning plan in JSON:
{
  "pathName": "descriptive path name",
  "estimatedDuration": "realistic timeframe",
  "phases": [
    {
      "phase": "phase name",
      "duration": "time estimate",
      "topics": ["core topics to learn"],
      "projects": [
        {
          "name": "project name",
          "description": "what they'll build",
          "skills": ["skills practiced"]
        }
      ],
      "milestones": ["checkpoints to validate progress"]
    }
  ],
  "dailyRoutine": "suggested daily practice",
  "resources": ["recommended learning materials"]
}

Make it practical and achievable.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(response);
    } catch (error) {
      console.error('Learning path generation error:', error);
      return this.getDefaultLearningPath();
    }
  }

  async debugCode(
    code: string,
    error: string,
    language: string = 'javascript'
  ): Promise<DebuggingGuidance> {
    const prompt = `Help debug this ${language} code that's producing the error: "${error}"

Code:
\`\`\`${language}
${code}
\`\`\`

Provide step-by-step debugging guidance in JSON:
{
  "errorAnalysis": "what the error means in simple terms",
  "possibleCauses": ["likely reasons for this error"],
  "debuggingSteps": [
    {
      "step": "step description",
      "action": "what to do",
      "expectedResult": "what should happen"
    }
  ],
  "fixedCode": "corrected version of the code",
  "explanation": "why the fix works",
  "preventionTips": ["how to avoid this error in future"]
}

Focus on teaching the debugging process, not just providing the fix.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(response);
    } catch (error) {
      console.error('Debugging assistance error:', error);
      return this.getDefaultDebuggingGuidance();
    }
  }

  async assessSkill(
    codeExamples: string[],
    answeredQuestions: Array<{question: string, answer: string}>
  ): Promise<SkillAssessment> {
    const prompt = `Assess the programming skill level based on:

Code Examples:
${codeExamples.map((code, i) => `\`\`\`\n${code}\n\`\`\``).join('\n\n')}

Q&A Responses:
${answeredQuestions.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n')}

Provide assessment in JSON:
{
  "skillLevel": "beginner|intermediate|advanced",
  "strengths": ["areas where they excel"],
  "areasForImprovement": ["skills to focus on"],
  "recommendedTopics": ["specific topics to study next"],
  "estimatedLearningTime": "time to reach next level"
}

Be encouraging but honest in assessment.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return JSON.parse(response);
    } catch (error) {
      console.error('Skill assessment error:', error);
      return this.getDefaultSkillAssessment();
    }
  }

  async chat(
    message: string,
    conversationHistory: Array<{role: 'user' | 'assistant', content: string}> = [],
    currentCode?: string,
    currentLanguage?: string
  ): Promise<string> {
    const contextInfo = currentCode ? `\n\nCurrent Code Context:\n\`\`\`${currentLanguage || 'javascript'}\n${currentCode}\n\`\`\`` : '';
    
    const historyText = conversationHistory.length > 0 
      ? `\n\nConversation History:\n${conversationHistory.map(msg => `${msg.role === 'user' ? 'Student' : 'DevMentor'}: ${msg.content}`).join('\n')}\n`
      : '';

    const prompt = `You are DevMentor AI, a friendly and knowledgeable programming tutor. You help students learn programming in a natural, conversational way.

Student Message: "${message}"${historyText}${contextInfo}

Guidelines:
- Be conversational, helpful, and encouraging
- If the student asks about programming concepts, explain them clearly with examples
- If they share code, offer constructive feedback
- If they ask for help with bugs, guide them through debugging
- If they want to chat about programming in general, engage naturally
- Keep responses concise but informative
- Use markdown for code snippets when helpful

Respond naturally as a helpful programming mentor:`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return response.trim();
    } catch (error) {
      console.error('Chat error:', error);
      return "I'm having trouble connecting right now. Could you try again? I'm here to help with programming questions, code review, or just chat about coding!";
    }
  }

  // Default fallback responses
  private getDefaultCodeReview(): CodeReview {
    return {
      overallRating: 7,
      strengths: ["Code structure looks good", "Good use of basic syntax"],
      improvements: [{
        issue: "Consider adding comments",
        explanation: "Comments help explain your code logic",
        suggestedFix: "Add // comments above complex lines",
        lineNumber: 1
      }],
      conceptsToLearn: ["Code documentation", "Best practices"],
      bestPractices: ["Use meaningful variable names", "Add comments"],
      nextSteps: "Practice writing clean, documented code"
    };
  }

  private getDefaultConceptExplanation(): ConceptExplanation {
    return {
      simpleExplanation: "This is a fundamental programming concept",
      detailedExplanation: "Understanding this concept is important for writing effective code",
      codeExample: "// Example code would go here",
      commonMistakes: ["Not understanding the syntax", "Misusing the concept"],
      practiceExercises: [{
        description: "Practice the basic syntax",
        difficulty: "easy",
        starterCode: "// Your code here"
      }],
      relatedConcepts: ["Variables", "Functions", "Control flow"]
    };
  }

  private getDefaultLearningPath(): LearningPath {
    return {
      pathName: "Programming Fundamentals",
      estimatedDuration: "3-6 months",
      phases: [{
        phase: "Foundations",
        duration: "4 weeks",
        topics: ["Variables", "Functions", "Control flow"],
        projects: [{
          name: "Simple Calculator",
          description: "Build a basic calculator",
          skills: ["Basic syntax", "Functions"]
        }],
        milestones: ["Understand basic syntax", "Write simple programs"]
      }],
      dailyRoutine: "30 minutes of coding practice daily",
      resources: ["MDN Web Docs", "Practice platforms"]
    };
  }

  private getDefaultDebuggingGuidance(): DebuggingGuidance {
    return {
      errorAnalysis: "There appears to be a syntax or logic error in your code",
      possibleCauses: ["Syntax error", "Logic mistake", "Type mismatch"],
      debuggingSteps: [{
        step: "Check syntax",
        action: "Look for missing brackets or semicolons",
        expectedResult: "Code should parse correctly"
      }],
      fixedCode: "// Fixed code would appear here",
      explanation: "The error was likely due to a syntax issue",
      preventionTips: ["Use a code editor with syntax highlighting", "Test code frequently"]
    };
  }

  private getDefaultSkillAssessment(): SkillAssessment {
    return {
      skillLevel: 'beginner',
      strengths: ["Enthusiasm to learn", "Basic understanding"],
      areasForImprovement: ["Syntax mastery", "Problem-solving skills"],
      recommendedTopics: ["Variables and data types", "Functions", "Control structures"],
      estimatedLearningTime: "2-3 months to reach intermediate level"
    };
  }
}

export const devMentorAI = new DevMentorAIService();