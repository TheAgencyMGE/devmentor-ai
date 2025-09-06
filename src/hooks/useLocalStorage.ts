import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue] as const;
}

// Specific hooks for DevMentor data
export interface CodeProject {
  id: string;
  name: string;
  code: string;
  language: string;
  createdAt: string;
  lastModified: string;
}

export interface UserSession {
  sessionStart: string;
  codeWritten: number;
  challengesSolved: number;
  conceptsLearned: string[];
}

export interface UserStats {
  totalChallengesSolved: number;
  totalCodeLines: number;
  favoriteLanguage: string;
  lastActiveDate: string;
  sessionsCompleted: number;
}

export const useCodeProjects = () => {
  return useLocalStorage<CodeProject[]>('devmentor_projects', []);
};

export const useUserSession = () => {
  return useLocalStorage<UserSession>('devmentor_session', {
    sessionStart: new Date().toISOString(),
    codeWritten: 0,
    challengesSolved: 0,
    conceptsLearned: []
  });
};

export const useUserStats = () => {
  return useLocalStorage<UserStats>('devmentor_stats', {
    totalChallengesSolved: 0,
    totalCodeLines: 0,
    favoriteLanguage: 'javascript',
    lastActiveDate: new Date().toISOString(),
    sessionsCompleted: 0
  });
};