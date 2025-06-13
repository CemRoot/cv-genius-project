import { useState, useEffect, useCallback } from 'react';
import { cvAPI } from '@/utils/api';
import { CVFormData } from '@/types';

interface TaskStatus {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: any;
  error?: string;
  created_at?: string;
}

interface UseAsyncCVReturn {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  result: any | null;
  generateCV: (formData: CVFormData) => Promise<void>;
  cancelGeneration: () => Promise<void>;
  resetState: () => void;
}

export const useAsyncCV = (): UseAsyncCVReturn => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);

  // Poll task status
  const pollTaskStatus = useCallback(async (id: string) => {
    try {
      const status = await cvAPI.getTaskStatus(id);
      
      setProgress(status.progress);
      
      if (status.status === 'completed') {
        setResult(status.result);
        setIsGenerating(false);
        setTaskId(null);
        return true; // Stop polling
      } else if (status.status === 'failed') {
        setError(status.error || 'CV generation failed');
        setIsGenerating(false);
        setTaskId(null);
        return true; // Stop polling
      }
      
      return false; // Continue polling
    } catch (err) {
      setError('Failed to check generation status');
      setIsGenerating(false);
      setTaskId(null);
      return true; // Stop polling
    }
  }, []);

  // Start polling when task ID is set
  useEffect(() => {
    if (!taskId || !isGenerating) return;

    const pollInterval = setInterval(async () => {
      const shouldStop = await pollTaskStatus(taskId);
      if (shouldStop) {
        clearInterval(pollInterval);
      }
    }, 2000); // Poll every 2 seconds

    // Initial poll
    pollTaskStatus(taskId);

    return () => clearInterval(pollInterval);
  }, [taskId, isGenerating, pollTaskStatus]);

  const generateCV = async (formData: CVFormData) => {
    try {
      setIsGenerating(true);
      setProgress(0);
      setError(null);
      setResult(null);

      // Start async generation
      const response = await cvAPI.generateFromFormAsync(formData);
      setTaskId(response.task_id);
      
    } catch (err: any) {
      setError(err.message || 'Failed to start CV generation');
      setIsGenerating(false);
    }
  };

  const cancelGeneration = async () => {
    if (!taskId) return;

    try {
      await cvAPI.cancelTask(taskId);
      setIsGenerating(false);
      setTaskId(null);
      setProgress(0);
      setError('Generation cancelled');
    } catch (err: any) {
      setError(err.message || 'Failed to cancel generation');
    }
  };

  const resetState = () => {
    setTaskId(null);
    setIsGenerating(false);
    setProgress(0);
    setError(null);
    setResult(null);
  };

  return {
    isGenerating,
    progress,
    error,
    result,
    generateCV,
    cancelGeneration,
    resetState,
  };
};