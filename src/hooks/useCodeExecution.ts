import { useState, useCallback } from 'react';

export interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

export const useCodeExecution = () => {
  const [result, setResult] = useState<ExecutionResult>({
    output: '',
    error: null,
    executionTime: 0
  });
  const [isRunning, setIsRunning] = useState(false);

  const executeCode = useCallback(async (code: string, language: string = 'javascript') => {
    setIsRunning(true);
    const startTime = performance.now();
    
    try {
      switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
          await executeJavaScript(code);
          break;
        case 'html':
          executeHTML(code);
          break;
        case 'css':
          executeCSS(code);
          break;
        default:
          setResult({
            output: '',
            error: `Language ${language} is not supported yet. Currently supporting: JavaScript, HTML, CSS`,
            executionTime: 0
          });
      }
    } catch (err) {
      const endTime = performance.now();
      setResult({
        output: '',
        error: err instanceof Error ? err.message : 'Unknown error occurred',
        executionTime: endTime - startTime
      });
    } finally {
      setIsRunning(false);
    }
  }, []);

  const executeJavaScript = async (code: string) => {
    const startTime = performance.now();
    let output = '';
    let hasError = false;

    // Create a safe execution environment
    const originalConsole = { ...console };
    const logs: string[] = [];

    // Override console methods to capture output
    console.log = (...args) => {
      logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' '));
    };
    console.error = (...args) => {
      logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
    };
    console.warn = (...args) => {
      logs.push('WARNING: ' + args.map(arg => String(arg)).join(' '));
    };

    try {
      // Create a function to execute the code in a controlled environment
      const executeInSandbox = new Function(`
        try {
          ${code}
        } catch (error) {
          console.error(error.message);
          throw error;
        }
      `);

      const result = executeInSandbox();
      
      // If there's a return value, add it to output
      if (result !== undefined) {
        logs.push(`Return value: ${typeof result === 'object' ? JSON.stringify(result, null, 2) : result}`);
      }

      output = logs.length > 0 ? logs.join('\n') : 'Code executed successfully (no output)';
    } catch (error) {
      hasError = true;
      output = error instanceof Error ? error.message : 'Unknown execution error';
    }

    // Restore original console
    Object.assign(console, originalConsole);

    const endTime = performance.now();
    setResult({
      output,
      error: hasError ? output : null,
      executionTime: endTime - startTime
    });
  };

  const executeHTML = (code: string) => {
    const startTime = performance.now();
    try {
      // Create a preview of HTML content
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      if (iframe.contentDocument) {
        iframe.contentDocument.write(code);
        iframe.contentDocument.close();
        
        const bodyContent = iframe.contentDocument.body?.innerHTML || 'Empty HTML';
        setResult({
          output: `HTML Preview:\n${bodyContent}`,
          error: null,
          executionTime: performance.now() - startTime
        });
      }
      
      document.body.removeChild(iframe);
    } catch (error) {
      setResult({
        output: '',
        error: error instanceof Error ? error.message : 'HTML parsing error',
        executionTime: performance.now() - startTime
      });
    }
  };

  const executeCSS = (code: string) => {
    const startTime = performance.now();
    try {
      // Basic CSS validation
      const cssRules = code.split('}').filter(rule => rule.trim());
      const validRules = cssRules.filter(rule => {
        const trimmed = rule.trim();
        return trimmed && trimmed.includes('{');
      });

      setResult({
        output: `CSS parsed successfully!\nFound ${validRules.length} CSS rules`,
        error: null,
        executionTime: performance.now() - startTime
      });
    } catch (error) {
      setResult({
        output: '',
        error: error instanceof Error ? error.message : 'CSS parsing error',
        executionTime: performance.now() - startTime
      });
    }
  };

  const clearOutput = useCallback(() => {
    setResult({
      output: '',
      error: null,
      executionTime: 0
    });
  }, []);

  return {
    executeCode,
    result,
    isRunning,
    clearOutput
  };
};