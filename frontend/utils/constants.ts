/**
 * Application constants for CVGenius frontend
 * Following camelCase naming convention for utility files
 */

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 300000, // 5 minutes for AI processing
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  SUPPORTED_TYPES: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  SUPPORTED_EXTENSIONS: ['.pdf', '.docx'],
} as const;

// UI Constants
export const UI_CONFIG = {
  TOAST_DURATION: 4000,
  LOADING_DEBOUNCE: 300,
  FORM_AUTO_SAVE_DELAY: 2000,
} as const;

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  LINKEDIN_REGEX: /^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 5000,
} as const;

// Environment Detection
export const ENVIRONMENT = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

// URLs
export const URLS = {
  PRODUCTION_API: 'https://cvgenius-backend-449239631634.europe-west1.run.app',
  DEVELOPMENT_API: 'http://localhost:8000',
  WEBSITE: 'https://cvgenius-nine.vercel.app',
} as const; 