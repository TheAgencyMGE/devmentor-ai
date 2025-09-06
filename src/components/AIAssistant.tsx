import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Code, 
  Bug, 
  BookOpen, 
  Target,
  Lightbulb,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { devMentorAI, type CodeReview, type ConceptExplanation, type DebuggingGuidance } from '@/services/devMentorAI';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  action?: 'code-review' | 'concept-explanation' | 'debugging' | 'general';
  data?: CodeReview | ConceptExplanation | DebuggingGuidance;
}

interface AIAssistantProps {
  currentCode?: string;
  currentLanguage?: string;
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  onCodeSuggestion?: (code: string) => void;
}

const QUICK_ACTIONS = [
  { 
    icon: Code, 
    label: 'Review My Code', 
    action: 'code-review',
    description: 'Get AI feedback on your code quality and best practices'
  },
  { 
    icon: Bug, 
    label: 'Debug Help', 
    action: 'debugging',
    description: 'Get help fixing errors and debugging issues'
  },
  { 
    icon: BookOpen, 
    label: 'Explain Concept', 
    action: 'concept-explanation',
    description: 'Learn programming concepts with examples'
  },
  { 
    icon: Target, 
    label: 'Learning Path', 
    action: 'learning-path',
    description: 'Get a personalized learning roadmap'
  }
];

export const AIAssistant: React.FC<AIAssistantProps> = ({
  currentCode = '',
  currentLanguage = 'javascript',
  skillLevel = 'beginner',
  onCodeSuggestion
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'intro',
      type: 'ai',
      content: "Hello! I'm DevMentor AI, your friendly programming tutor. I'm here to help you learn, debug code, answer questions, or just chat about programming. What would you like to talk about?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const animatedMessagesRef = useRef(new Set(['intro'])); // Track which messages have been animated

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (content: string, type: 'user' | 'ai', action?: string, data?: any) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      action: action as any,
      data
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages
        .slice(1) // Skip intro message
        .map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));

      // Use the natural chat method
      const response = await devMentorAI.chat(
        userMessage, 
        conversationHistory,
        currentCode,
        currentLanguage
      );
      
      addMessage(response, 'ai');
    } catch (error) {
      console.error('Chat error:', error);
      addMessage(
        "I apologize, but I'm having trouble connecting right now. Please try again! I'm here to help with programming questions, code review, or just chat about coding.",
        'ai'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    
    try {
      let message = '';
      switch (action) {
        case 'code-review':
          message = 'Can you review my code?';
          break;
        case 'debugging':
          message = 'Help me debug my code - I\'m having issues.';
          break;
        case 'concept-explanation':
          message = 'Can you explain a programming concept to me?';
          break;
        case 'learning-path':
          message = 'Can you help me create a learning path?';
          break;
        default:
          message = 'How can you help me?';
      }
      
      // Add user message and get AI response
      addMessage(message, 'user');
      
      const conversationHistory = messages
        .slice(1) // Skip intro message
        .map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));

      const response = await devMentorAI.chat(
        message, 
        conversationHistory,
        currentCode,
        currentLanguage
      );
      
      addMessage(response, 'ai');
    } catch (error) {
      addMessage("Sorry, I encountered an error. Please try again!", 'ai');
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageComponent = ({ message }: { message: Message }) => {
    const isAlreadyAnimated = animatedMessagesRef.current.has(message.id);
    
    // Mark this message as animated
    if (!isAlreadyAnimated) {
      animatedMessagesRef.current.add(message.id);
    }
    
    return (
      <motion.div
        initial={isAlreadyAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
      >
      {message.type === 'ai' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
        <div className={`rounded-lg p-3 ${
          message.type === 'user' 
            ? 'bg-primary text-primary-foreground ml-auto' 
            : 'bg-ai-response border border-border/20'
        }`}>
          <div className="text-sm leading-relaxed">
            {message.type === 'ai' ? (
              <ReactMarkdown 
                components={{
                  // Custom styling for code blocks
                  code: ({ node, inline, className, children, ...props }) => {
                    if (inline) {
                      return (
                        <code 
                          className="bg-surface/50 px-1.5 py-0.5 rounded text-primary font-mono text-xs" 
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="bg-surface/30 p-3 rounded-md overflow-x-auto my-2 font-mono text-xs text-foreground">
                        <code {...props}>
                          {children}
                        </code>
                      </pre>
                    );
                  },
                  // Custom styling for headers
                  h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-foreground">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-md font-bold mb-1 text-foreground">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mb-1 text-foreground">{children}</h3>,
                  // Custom styling for lists
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 ml-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 ml-2">{children}</ol>,
                  li: ({ children }) => <li className="text-sm">{children}</li>,
                  // Custom styling for paragraphs
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  // Custom styling for strong/bold
                  strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </div>
          
          {message.action && (
            <div className="mt-2">
              <Badge variant="secondary" className="text-xs">
                {message.action.replace('-', ' ')}
              </Badge>
            </div>
          )}
        </div>
        
        <div className={`text-xs text-muted-foreground mt-1 ${
          message.type === 'user' ? 'text-right' : 'text-left'
        }`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
      
      {message.type === 'user' && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
    </motion.div>
    );
  };

  return (
    <Card className="flex flex-col h-full card-gradient">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border/20">
        <div className="w-10 h-10 rounded-full bg-gradient-ai flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">DevMentor AI</h3>
          <p className="text-sm text-muted-foreground">Your Programming Tutor</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-ai flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-ai-response border border-border/20 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse">Thinking...</div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-ai-accent" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Quick Actions */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2 mb-3">
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.action}
              variant="ghost"
              size="sm"
              onClick={() => handleQuickAction(action.action)}
              disabled={isLoading}
              className="btn-glass h-auto p-2 flex flex-col items-center gap-1"
            >
              <action.icon className="w-4 h-4" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/20">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about programming..."
            disabled={isLoading}
            className="resize-none bg-surface border-border/20"
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="btn-ai self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};