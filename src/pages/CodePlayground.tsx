import React, { useState, useEffect } from 'react';
import { CodeEditor } from '@/components/CodeEditor';
import { AIAssistant } from '@/components/AIAssistant';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Plus, 
  Folder, 
  FileText, 
  Code, 
  Bot,
  SplitSquareVertical,
  Maximize,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCodeProjects, useUserSession, type CodeProject } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_CODE = {
  javascript: `// Welcome to DevMentor AI Code Playground!
// Try writing some JavaScript code here

function greetUser(name) {
  return \`Hello, \${name}! Welcome to DevMentor AI.\`;
}

const message = greetUser("Developer");
console.log(message);

// Try adding your own code below:
`,
  typescript: `// Welcome to DevMentor AI TypeScript Playground!
// Type-safe JavaScript development

interface User {
  name: string;
  age: number;
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}! You are \${user.age} years old.\`;
}

const developer: User = { name: "Developer", age: 25 };
console.log(greetUser(developer));

// Try adding your own TypeScript code below:
`,
  python: `# Welcome to DevMentor AI Python Playground!
# Note: Python execution is simulated in the browser

def greet_user(name: str) -> str:
    return f"Hello, {name}! Welcome to DevMentor AI."

message = greet_user("Developer")
print(message)

# Try adding your own Python code below:
`,
  java: `// Welcome to DevMentor AI Java Playground!
// Write and test Java code

public class Main {
    public static void main(String[] args) {
        String name = "Developer";
        System.out.println("Hello, " + name + "! Welcome to DevMentor AI.");
        
        // Try adding your own Java code below:
        
    }
}
`,
  cpp: `// Welcome to DevMentor AI C++ Playground!
// Modern C++ development

#include <iostream>
#include <string>

int main() {
    std::string name = "Developer";
    std::cout << "Hello, " << name << "! Welcome to DevMentor AI." << std::endl;
    
    // Try adding your own C++ code below:
    
    return 0;
}
`,
  c: `// Welcome to DevMentor AI C Playground!
// System programming with C

#include <stdio.h>

int main() {
    char name[] = "Developer";
    printf("Hello, %s! Welcome to DevMentor AI.\\n", name);
    
    // Try adding your own C code below:
    
    return 0;
}
`,
  csharp: `// Welcome to DevMentor AI C# Playground!
// Object-oriented programming with C#

using System;

class Program 
{
    static void Main() 
    {
        string name = "Developer";
        Console.WriteLine($"Hello, {name}! Welcome to DevMentor AI.");
        
        // Try adding your own C# code below:
        
    }
}
`,
  php: `<?php
// Welcome to DevMentor AI PHP Playground!
// Server-side web development

$name = "Developer";
echo "Hello, $name! Welcome to DevMentor AI.\\n";

// Try adding your own PHP code below:

?>`,
  ruby: `# Welcome to DevMentor AI Ruby Playground!
# Elegant and productive programming

def greet_user(name)
  "Hello, #{name}! Welcome to DevMentor AI."
end

message = greet_user("Developer")
puts message

# Try adding your own Ruby code below:
`,
  go: `// Welcome to DevMentor AI Go Playground!
// Fast and efficient systems programming

package main

import "fmt"

func main() {
    name := "Developer"
    fmt.Printf("Hello, %s! Welcome to DevMentor AI.\\n", name)
    
    // Try adding your own Go code below:
    
}
`,
  rust: `// Welcome to DevMentor AI Rust Playground!
// Safe and fast systems programming

fn main() {
    let name = "Developer";
    println!("Hello, {}! Welcome to DevMentor AI.", name);
    
    // Try adding your own Rust code below:
    
}
`,
  swift: `// Welcome to DevMentor AI Swift Playground!
// Modern language for iOS and more

import Foundation

let name = "Developer"
print("Hello, \\(name)! Welcome to DevMentor AI.")

// Try adding your own Swift code below:
`,
  kotlin: `// Welcome to DevMentor AI Kotlin Playground!
// Modern JVM language

fun main() {
    val name = "Developer"
    println("Hello, $name! Welcome to DevMentor AI.")
    
    // Try adding your own Kotlin code below:
    
}
`,
  scala: `// Welcome to DevMentor AI Scala Playground!
// Functional and object-oriented programming

object Main extends App {
  val name = "Developer"
  println(s"Hello, $name! Welcome to DevMentor AI.")
  
  // Try adding your own Scala code below:
  
}
`,
  dart: `// Welcome to DevMentor AI Dart Playground!
// Language for Flutter and web development

void main() {
  String name = "Developer";
  print('Hello, $name! Welcome to DevMentor AI.');
  
  // Try adding your own Dart code below:
  
}
`,
  r: `# Welcome to DevMentor AI R Playground!
# Statistical computing and data analysis

name <- "Developer"
message <- paste("Hello,", name, "! Welcome to DevMentor AI.")
print(message)

# Try adding your own R code below:
`,
  matlab: `% Welcome to DevMentor AI MATLAB Playground!
% Numerical computing and analysis

name = 'Developer';
fprintf('Hello, %s! Welcome to DevMentor AI.\\n', name);

% Try adding your own MATLAB code below:
`,
  sql: `-- Welcome to DevMentor AI SQL Playground!
-- Database queries and data management

SELECT 'Hello, Developer! Welcome to DevMentor AI.' AS greeting;

-- Try adding your own SQL queries below:
`,
  shell: `#!/bin/bash
# Welcome to DevMentor AI Shell Playground!
# Bash scripting and system automation

name="Developer"
echo "Hello, $name! Welcome to DevMentor AI."

# Try adding your own shell commands below:
`,
  powershell: `# Welcome to DevMentor AI PowerShell Playground!
# Windows automation and scripting

$name = "Developer"
Write-Output "Hello, $name! Welcome to DevMentor AI."

# Try adding your own PowerShell code below:
`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DevMentor HTML</title>
</head>
<body>
    <h1>Welcome to DevMentor AI</h1>
    <p>Start building amazing web pages!</p>
    
    <!-- Add your HTML code here -->
</body>
</html>`,
  css: `/* Welcome to DevMentor AI CSS Playground */
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

h1 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

/* Add your CSS styles here */
`,
  scss: `// Welcome to DevMentor AI SCSS Playground!
// Enhanced CSS with Sass features

$primary-color: #667eea;
$secondary-color: #764ba2;
$font-stack: 'Arial', sans-serif;

body {
    font-family: $font-stack;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, $primary-color 0%, $secondary-color 100%);
    color: white;
    
    h1 {
        text-align: center;
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }
}

// Add your SCSS styles here
`,
  json: `{
  "message": "Welcome to DevMentor AI JSON Playground!",
  "user": {
    "name": "Developer",
    "role": "Student",
    "skills": ["JavaScript", "Python", "React"]
  },
  "config": {
    "theme": "dark",
    "notifications": true
  }
}`,
  xml: `<?xml version="1.0" encoding="UTF-8"?>
<!-- Welcome to DevMentor AI XML Playground! -->
<root>
    <message>Welcome to DevMentor AI</message>
    <user>
        <name>Developer</name>
        <role>Student</role>
    </user>
    <!-- Add your XML content here -->
</root>`,
  yaml: `# Welcome to DevMentor AI YAML Playground!
# Configuration and data serialization

message: "Welcome to DevMentor AI"
user:
  name: "Developer"
  role: "Student"
  skills:
    - "JavaScript"
    - "Python"
    - "React"

config:
  theme: "dark"
  notifications: true

# Add your YAML content here
`,
  markdown: `# Welcome to DevMentor AI Markdown Playground!

**Learn** to write *beautiful* documentation with Markdown.

## Getting Started

1. Write your content
2. Use **formatting** options
3. Create \`code blocks\`

### Code Example

\`\`\`javascript
console.log("Hello, DevMentor AI!");
\`\`\`

> Add your own Markdown content below:
`
};

export const CodePlayground: React.FC = () => {
  const [projects, setProjects] = useCodeProjects();
  const [session, setSession] = useUserSession();
  const [currentProject, setCurrentProject] = useState<CodeProject | null>(null);
  const [code, setCode] = useState(DEFAULT_CODE.javascript);
  const [language, setLanguage] = useState('javascript');
  const [projectName, setProjectName] = useState('');
  const [isAIVisible, setIsAIVisible] = useState(true);
  const [layout, setLayout] = useState<'split' | 'editor' | 'ai'>('split');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  useEffect(() => {
    // Load the most recent project or create a default one
    if (projects.length > 0) {
      const lastProject = projects[0];
      setCurrentProject(lastProject);
      setCode(lastProject.code);
      setLanguage(lastProject.language);
      setProjectName(lastProject.name);
    } else {
      setProjectName('Untitled Project');
    }
  }, [projects]);

  useEffect(() => {
    if (!currentProject) {
      setCode(DEFAULT_CODE[language as keyof typeof DEFAULT_CODE] || DEFAULT_CODE.javascript);
    }
  }, [language, currentProject]);

  // Auto-save project when code or project name changes (with debounce)
  useEffect(() => {
    if (!code) return;
    
    setSaveStatus('unsaved');
    
    const autoSaveTimer = setTimeout(() => {
      setSaveStatus('saving');
      
      let updatedProject;
      let updatedProjects: CodeProject[];
      
      if (!currentProject) {
        // Create new project if none exists
        updatedProject = {
          id: uuidv4(),
          name: projectName || 'Untitled Project',
          code,
          language,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };
        updatedProjects = [updatedProject, ...projects];
        setCurrentProject(updatedProject);
      } else {
        // Update existing project
        updatedProject = {
          ...currentProject,
          name: projectName || 'Untitled Project',
          code,
          language,
          lastModified: new Date().toISOString()
        };
        
        const existingIndex = projects.findIndex(p => p.id === currentProject.id);
        
        if (existingIndex >= 0) {
          updatedProjects = [...projects];
          updatedProjects[existingIndex] = updatedProject;
        } else {
          updatedProjects = [updatedProject, ...projects];
        }
        setCurrentProject(updatedProject);
      }
      
      setProjects(updatedProjects);
      setTimeout(() => setSaveStatus('saved'), 500); // Show "saved" for a moment
    }, 2000); // Auto-save after 2 seconds of inactivity
    
    return () => clearTimeout(autoSaveTimer);
  }, [code, projectName, language, currentProject, projects, setProjects]);

  const createNewProject = () => {
    const newProject = {
      id: uuidv4(),
      name: 'New Project',
      code: DEFAULT_CODE[language as keyof typeof DEFAULT_CODE] || DEFAULT_CODE.javascript,
      language,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    // Immediately save the new project
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    
    setCurrentProject(newProject);
    setCode(newProject.code);
    setProjectName(newProject.name);
  };

  const saveProject = () => {
    setSaveStatus('saving');
    
    // If no current project exists, create one
    if (!currentProject) {
      const newProject = {
        id: uuidv4(),
        name: projectName || 'Untitled Project',
        code,
        language,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      };
      
      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      setCurrentProject(newProject);
      setTimeout(() => setSaveStatus('saved'), 300);
      return;
    }
    
    const updatedProject = {
      ...currentProject,
      name: projectName || 'Untitled Project',
      code,
      language,
      lastModified: new Date().toISOString()
    };
    
    const existingIndex = projects.findIndex(p => p.id === currentProject.id);
    let updatedProjects: CodeProject[];
    
    if (existingIndex >= 0) {
      updatedProjects = [...projects];
      updatedProjects[existingIndex] = updatedProject;
    } else {
      updatedProjects = [updatedProject, ...projects];
    }
    
    setProjects(updatedProjects);
    setCurrentProject(updatedProject);
    
    setTimeout(() => setSaveStatus('saved'), 300);

    // Update session stats
    setSession({
      ...session,
      codeWritten: session.codeWritten + Math.max(0, code.length - (currentProject.code?.length || 0))
    });
  };

  const loadProject = (project: CodeProject) => {
    setCurrentProject(project);
    setCode(project.code);
    setLanguage(project.language);
    setProjectName(project.name);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const exportProject = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName}.${language === 'javascript' ? 'js' : language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getLayoutClasses = () => {
    switch (layout) {
      case 'editor': return 'grid-cols-1';
      case 'ai': return 'grid-cols-1';
      case 'split': return 'grid-cols-1 lg:grid-cols-2';
      default: return 'grid-cols-1 lg:grid-cols-2';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      {/* Header */}
      <Card className="card-gradient p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            <Code className="w-6 h-6 text-primary" />
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="bg-surface border-border/20 max-w-xs"
              placeholder="Project name..."
            />
            <Badge variant="secondary">{language}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Layout Controls */}
            <div className="flex border border-border/20 rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayout('editor')}
                className={`btn-glass border-none rounded-none ${layout === 'editor' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <FileText className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayout('split')}
                className={`btn-glass border-none rounded-none ${layout === 'split' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <SplitSquareVertical className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLayout('ai')}
                className={`btn-glass border-none rounded-none ${layout === 'ai' ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <Bot className="w-4 h-4" />
              </Button>
            </div>

            <Button onClick={createNewProject} size="sm" className="btn-glass">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
            
            <Button onClick={saveProject} size="sm" className="btn-primary">
              <Save className="w-4 h-4 mr-1" />
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}
            </Button>

            <Button onClick={exportProject} size="sm" className="btn-glass">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className={`grid ${getLayoutClasses()} gap-4 min-h-[80vh]`}>
        {/* Code Editor */}
        {(layout === 'editor' || layout === 'split') && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col min-h-[600px]"
          >
            <CodeEditor
              value={code}
              onChange={handleCodeChange}
              language={language}
              onLanguageChange={handleLanguageChange}
              height="600px"
            />
          </motion.div>
        )}

        {/* AI Assistant */}
        {(layout === 'ai' || layout === 'split') && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col min-h-[600px]"
          >
            <AIAssistant
              currentCode={code}
              currentLanguage={language}
              onCodeSuggestion={setCode}
            />
          </motion.div>
        )}
      </div>

      {/* Projects Sidebar */}
      {projects.length > 0 && (
        <Card className="card-gradient p-4">
          <div className="flex items-center gap-2 mb-4">
            <Folder className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Recent Projects</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {projects.slice(0, 8).map((project) => (
              <div
                key={project.id}
                onClick={() => loadProject(project)}
                className={`p-3 rounded-lg border border-border/20 cursor-pointer transition-all hover:border-primary/30 hover:bg-surface/50 ${
                  currentProject?.id === project.id ? 'bg-primary/10 border-primary/30' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm truncate">{project.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {project.language}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(project.lastModified).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};