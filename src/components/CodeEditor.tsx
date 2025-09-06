import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Save, Download, Maximize2, Code } from 'lucide-react';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  onLanguageChange?: (language: string) => void;
  onRunCode?: () => void;
  readOnly?: boolean;
  height?: string;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', extension: 'js' },
  { value: 'typescript', label: 'TypeScript', extension: 'ts' },
  { value: 'python', label: 'Python', extension: 'py' },
  { value: 'java', label: 'Java', extension: 'java' },
  { value: 'cpp', label: 'C++', extension: 'cpp' },
  { value: 'c', label: 'C', extension: 'c' },
  { value: 'csharp', label: 'C#', extension: 'cs' },
  { value: 'php', label: 'PHP', extension: 'php' },
  { value: 'ruby', label: 'Ruby', extension: 'rb' },
  { value: 'go', label: 'Go', extension: 'go' },
  { value: 'rust', label: 'Rust', extension: 'rs' },
  { value: 'swift', label: 'Swift', extension: 'swift' },
  { value: 'kotlin', label: 'Kotlin', extension: 'kt' },
  { value: 'scala', label: 'Scala', extension: 'scala' },
  { value: 'dart', label: 'Dart', extension: 'dart' },
  { value: 'r', label: 'R', extension: 'r' },
  { value: 'matlab', label: 'MATLAB', extension: 'm' },
  { value: 'sql', label: 'SQL', extension: 'sql' },
  { value: 'shell', label: 'Shell/Bash', extension: 'sh' },
  { value: 'powershell', label: 'PowerShell', extension: 'ps1' },
  { value: 'html', label: 'HTML', extension: 'html' },
  { value: 'css', label: 'CSS', extension: 'css' },
  { value: 'scss', label: 'SCSS', extension: 'scss' },
  { value: 'json', label: 'JSON', extension: 'json' },
  { value: 'xml', label: 'XML', extension: 'xml' },
  { value: 'yaml', label: 'YAML', extension: 'yml' },
  { value: 'markdown', label: 'Markdown', extension: 'md' },
];

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'javascript',
  onLanguageChange,
  onRunCode,
  readOnly = false,
  height = '400px'
}) => {
  const editorRef = useRef<any>(null);
  const { executeCode, result, isRunning } = useCodeExecution();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Configure editor for better coding experience
    editor.updateOptions({
      fontSize: 14,
      fontFamily: 'Fira Code, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
      fontLigatures: true,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      automaticLayout: true,
      minimap: { enabled: false },
      wordWrap: 'on',
      tabSize: 2,
      insertSpaces: true,
      renderWhitespace: 'selection',
      renderControlCharacters: false,
      contextmenu: true,
      mouseWheelZoom: true,
      cursorSmoothCaretAnimation: 'on',
      smoothScrolling: true
    });

    // Add keyboard shortcuts - using keycodes directly
    editor.addCommand(2081, () => { // Ctrl+Enter
      handleRunCode();
    });

    editor.addCommand(2083, (e: any) => { // Ctrl+S
      e.preventDefault();
      handleSaveCode();
    });
  };

  const handleRunCode = async () => {
    if (value.trim()) {
      await executeCode(value, language);
      onRunCode?.();
    }
  };

  const handleSaveCode = () => {
    const currentLang = SUPPORTED_LANGUAGES.find(l => l.value === language);
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${currentLang?.extension || 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    handleSaveCode();
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const editorTheme = {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: 'C586C0' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'comment', foreground: '6A9955' },
      { token: 'function', foreground: 'DCDCAA' },
      { token: 'variable', foreground: '9CDCFE' },
    ],
    colors: {
      'editor.background': '#0F0F0F',
      'editor.foreground': '#D4D4D4',
      'editorCursor.foreground': '#A7A7A7',
      'editor.lineHighlightBackground': '#2D2D30',
      'editorLineNumber.foreground': '#858585',
      'editor.selectionBackground': '#264F78',
      'editor.inactiveSelectionBackground': '#3A3D41'
    }
  };

  return (
    <Card className={`card-gradient ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border/20">
        <div className="flex items-center gap-3">
          <Code className="w-5 h-5 text-primary" />
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-40 bg-surface border-border/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={formatCode}
            className="btn-glass"
          >
            Format
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="btn-glass"
          >
            <Download className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn-glass"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>

          <Button
            onClick={handleRunCode}
            disabled={isRunning || !value.trim()}
            className="btn-primary"
            size="sm"
          >
            <Play className="w-4 h-4 mr-1" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <Editor
          height={isFullscreen ? 'calc(100vh - 120px)' : height}
          value={value}
          language={language}
          theme="vs-dark"
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            wordWrap: 'on',
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            folding: true,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true
            }
          }}
        />
      </div>

      {/* Output Console */}
      {(result.output || result.error) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-border/20 bg-surface/50"
        >
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Output {result.executionTime > 0 && `(${result.executionTime.toFixed(2)}ms)`}
              </h4>
            </div>
            <pre className={`text-sm font-mono p-3 rounded-md overflow-auto max-h-32 ${
              result.error ? 'bg-destructive/10 text-destructive border border-destructive/20' : 'bg-success/10 text-success border border-success/20'
            }`}>
              {result.error || result.output}
            </pre>
          </div>
        </motion.div>
      )}
    </Card>
  );
};