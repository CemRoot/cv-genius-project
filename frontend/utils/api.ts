import axios, { AxiosError } from 'axios';
import { CVFormData, CVUploadRequest, PDFResponse, ErrorResponse } from '@/types';
import { API_CONFIG, URLS, ENVIRONMENT } from './constants';

// Smart API URL detection based on environment
const getApiUrl = (): string => {
  if (ENVIRONMENT.isDevelopment) {
    return URLS.DEVELOPMENT_API;
  }
  
  if (ENVIRONMENT.isProduction) {
    return URLS.PRODUCTION_API;
  }
  
  // Fallback to production URL
  return URLS.PRODUCTION_API;
};

// Create axios instance with smart URL
const api = axios.create({
  baseURL: getApiUrl(),
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for secure logging
api.interceptors.request.use(
  (config) => {
    // Only log request method and endpoint, not sensitive data
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    // Log error without exposing sensitive details
    if (process.env.NODE_ENV === 'development') {
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Only log status and endpoint in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError<ErrorResponse>) => {
    // Log error without exposing sensitive response data
    if (process.env.NODE_ENV === 'development') {
      console.error('API Response Error:', error.message);
    }
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      const errorMessage = error.response.data?.error || error.response.data?.detail || `Server error (${error.response.status})`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response from server:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

// API endpoints

export const cvAPI = {
  // Generate CV from form data (Creator flow)
  generateFromForm: async (formData: CVFormData): Promise<PDFResponse> => {
    const response = await api.post<PDFResponse>('/api/v1/generate-from-form', formData);
    return response.data;
  },

  // Generate CV from uploaded file (Updater flow)
  generateFromUpload: async (file: File, jobDescription: string): Promise<PDFResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    const response = await api.post<PDFResponse>('/api/v1/generate-from-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Validate form data
  validateForm: async (formData: CVFormData): Promise<{ valid: boolean; message: string }> => {
    const response = await api.post('/api/v1/validate-form', formData);
    return response.data;
  },

  // Get supported file formats
  getSupportedFormats: async (): Promise<{
    supported_formats: Array<{
      extension: string;
      mime_type: string;
      description: string;
    }>;
    max_file_size: number;
    max_file_size_mb: number;
  }> => {
    const response = await api.get('/api/v1/supported-formats');
    return response.data;
  },

  // Health check
  healthCheck: async (): Promise<{ status: string; service: string; version: string }> => {
    const response = await api.get('/api/v1/health');
    return response.data;
  },

  // Generate PDF from edited cover letter data
  generateCoverLetterPDF: async (coverLetterData: any): Promise<{ cover_letter_pdf_base64: string; filename_cover_letter: string }> => {
    const response = await api.post('/api/v1/generate-cover-letter-pdf', coverLetterData);
    return response.data;
  },

  // Regenerate cover letter with AI
  regenerateCoverLetter: async (cvData: any, jobDescription?: string): Promise<any> => {
    const response = await api.post('/api/v1/regenerate-cover-letter', {
      cv_data: cvData,
      job_description: jobDescription || ''
    });
    return response.data;
  },

  // Generate CV PDF from edited data
  generateCVPDF: async (cvData: any): Promise<{ cv_pdf_base64: string; filename_cv: string }> => {
    const response = await api.post('/api/v1/generate-cv-pdf', cvData);
    return response.data;
  },

  // Async CV generation methods
  generateFromFormAsync: async (formData: CVFormData): Promise<{ task_id: string; status: string; message: string; poll_url: string }> => {
    const response = await api.post('/api/v1/async/generate-from-form-async', formData);
    return response.data;
  },

  getTaskStatus: async (taskId: string): Promise<{ task_id: string; status: string; progress: number; result?: any; error?: string }> => {
    const response = await api.get(`/api/v1/async/task-status/${taskId}`);
    return response.data;
  },

  cancelTask: async (taskId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/v1/async/task/${taskId}`);
    return response.data;
  },
};

// Utility functions

export const downloadPDF = (base64Data: string, filename: string): void => {
  try {
    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download PDF file');
  }
};

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file: File, allowedTypes: string[] = ['pdf', 'docx', 'doc']): boolean => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  return fileExtension ? allowedTypes.includes(fileExtension) : false;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Error handling utilities

export const isAPIError = (error: any): error is AxiosError<ErrorResponse> => {
  return error?.isAxiosError === true;
};

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (isAPIError(error)) {
    return error.response?.data?.error || error.response?.data?.detail || 'API request failed';
  }
  
  return 'An unexpected error occurred';
};

export default api;