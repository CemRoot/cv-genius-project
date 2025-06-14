// API Types matching backend models

export interface PersonalDetails {
  full_name: string;
  email: string;
  phone: string;
  linkedin_url?: string;
  location?: string;
  github_url?: string;
  website_url?: string;
}

export interface WorkExperience {
  job_title: string;
  company: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  location?: string;
}

export interface Education {
  degree: string;
  institution: string;
  start_date: string;
  end_date?: string;
  grade?: string;
  location?: string;
}

export interface CVFormData {
  personal_details: PersonalDetails;
  work_experience: WorkExperience[];
  education: Education[];
  skills: string;
  job_description?: string;
  theme?: string;
}

export interface CVUploadRequest {
  job_description: string;
}

export interface GeneratedExperience {
  job_title: string;
  company: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location?: string;
  achievements: string[];
}

export interface GeneratedEducation {
  degree: string;
  institution: string;
  start_date: string;
  end_date?: string;
  grade?: string;
  location?: string;
}

export interface SkillCategories {
  technical: string[];
  soft: string[];
  languages: string[];
}

export interface GeneratedCVResponse {
  personal_details: PersonalDetails;
  professional_summary: string;
  work_experience: GeneratedExperience[];
  education: GeneratedEducation[];
  skills: SkillCategories;
  cover_letter_body: string;
  generation_metadata: Record<string, any>;
}

export interface PDFResponse {
  cv_pdf_base64: string;
  cover_letter_pdf_base64: string;
  filename_cv: string;
  filename_cover_letter: string;
  generation_timestamp: string;
  cv_data?: Record<string, any>;
}

export interface ErrorResponse {
  error: string;
  detail?: string;
  timestamp: string;
  request_id?: string;
}

// Frontend-specific types

export interface FormStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
}

export interface FileUploadState {
  file: File | null;
  uploading: boolean;
  error: string | null;
}

export interface CVGenerationState {
  loading: boolean;
  progress: number;
  currentStep: string;
  error: string | null;
  result: PDFResponse | null;
}

export interface AppState {
  currentFlow: 'creator' | 'updater' | null;
  formData: Partial<CVFormData>;
  uploadState: FileUploadState;
  generationState: CVGenerationState;
}

// Component prop types

export interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
}

export interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
}

// Utility types

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface APIError extends Error {
  status?: number;
  code?: string;
}