import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FileText, 
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Send,
  Bot,
  Sparkles,
  Download,
  Save,
  Eye,
  EyeOff,
  Zap,
  RefreshCw,
  Crown
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { geminiService } from '@/services/geminiService';

interface PersonalData {
  firstName: string;
  lastName: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  phone: string;
  email: string;
  linkedin: string;
  website: string;
}

interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrentRole: boolean;
  location: string;
  description: string;
  achievements: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  grade: string;
  location: string;
}

interface CVData {
  personal: PersonalData;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  sections: {
    projects: any[];
    certifications: any[];
    awards: any[];
  };
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIResumeBuilderProps {
  onSave?: (data: CVData) => void;
  onBack?: () => void;
}

const AIResumeBuilder: React.FC<AIResumeBuilderProps> = ({ onSave, onBack }) => {
  // State management
  const [currentStep, setCurrentStep] = useState('header');
  const [cvData, setCvData] = useState<CVData>({
    personal: {
      firstName: '',
      lastName: '',
      city: '',
      stateProvince: '',
      postalCode: '',
      phone: '',
      email: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: []
    },
    sections: {
      projects: [],
      certifications: [],
      awards: []
    }
  });

  // UI State
  const [showChat, setShowChat] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [previewMode, setPreviewMode] = useState(true);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "👋 Hi! I'm your AI resume assistant. I'll help you create a professional resume that stands out. Let's start with your personal information. What's your name?",
      timestamp: new Date(),
      suggestions: [
        "Help me write a professional summary",
        "Suggest skills for my field",
        "Improve my work experience descriptions",
        "What sections should I include?"
      ]
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Navigation steps
  const sidebarSteps = [
    { id: 'header', label: 'Header', icon: User, completed: false },
    { id: 'summary', label: 'Summary', icon: FileText, completed: false },
    { id: 'experience', label: 'Experience', icon: Briefcase, completed: false },
    { id: 'education', label: 'Education', icon: GraduationCap, completed: false },
    { id: 'skills', label: 'Skills', icon: Award, completed: false },
    { id: 'sections', label: 'Additional', icon: Plus, completed: false }
  ];

  // Auto-save functionality
  useEffect(() => {
    const autoSave = setTimeout(() => {
      if (cvData.personal.firstName || cvData.personal.email) {
        handleAutoSave();
      }
    }, 2000);

    return () => clearTimeout(autoSave);
  }, [cvData]);

  // Chat scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleAutoSave = async () => {
    setLastSaved(new Date());
    // Auto-save logic here
  };

  const simulateAIResponse = async (userMessage: string) => {
    setIsAITyping(true);
    
    try {
      // Use Gemini AI service for intelligent responses
      const response = await geminiService.getResumeAdvice(userMessage, {
        currentStep,
        industry: 'Technology', // Could be extracted from form or user selection
        experience_level: 'Mid-level', // Could be inferred from experience length
        target_role: cvData.experience[0]?.jobTitle || 'Professional',
        cv_data: cvData
      });

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions || []
      };

      setChatMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('AI Response Error:', error);
      
      // Fallback response
      const fallbackMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: "I'm here to help you create an outstanding resume! Could you please be more specific about what you'd like assistance with?",
        timestamp: new Date(),
        suggestions: [
          "Help me write a better summary",
          "Improve my experience descriptions",
          "Suggest relevant skills",
          "Review my resume"
        ]
      };

      setChatMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsAITyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    await simulateAIResponse(currentMessage);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    await simulateAIResponse(suggestion);
  };

  const generateCVHTML = () => {
    const { personal } = cvData;
    const name = personal.firstName && personal.lastName 
      ? `${personal.firstName} ${personal.lastName}` 
      : 'Your Name';
    
    const location = [personal.city, personal.stateProvince].filter(Boolean).join(', ') || 'City, State';
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #2d3748;
      background: #ffffff;
      padding: 40px;
      font-size: 14px;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #3182ce;
      padding-bottom: 25px;
      margin-bottom: 35px;
    }
    .name {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      color: #1a202c;
      letter-spacing: -0.5px;
    }
    .contact-info {
      font-size: 14px;
      color: #4a5568;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .contact-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .summary {
      font-size: 15px;
      line-height: 1.7;
      color: #4a5568;
      text-align: justify;
    }
    .experience-item, .education-item {
      margin-bottom: 20px;
      padding-left: 15px;
      border-left: 3px solid #e2e8f0;
      position: relative;
    }
    .experience-item::before, .education-item::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 8px;
      width: 9px;
      height: 9px;
      background: #3182ce;
      border-radius: 50%;
    }
    .job-title, .degree {
      font-size: 16px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 4px;
    }
    .company, .institution {
      font-size: 14px;
      color: #3182ce;
      font-weight: 500;
      margin-bottom: 4px;
    }
    .date-location {
      font-size: 13px;
      color: #718096;
      margin-bottom: 8px;
    }
    .description {
      font-size: 14px;
      color: #4a5568;
      line-height: 1.6;
    }
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }
    .skill-category {
      background: #f7fafc;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #3182ce;
    }
    .skill-category-title {
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .skill-items {
      font-size: 13px;
      color: #4a5568;
      line-height: 1.5;
    }
    .empty-state {
      text-align: center;
      color: #a0aec0;
      font-style: italic;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${name}</div>
    <div class="contact-info">
      ${personal.email ? `<div class="contact-item">📧 ${personal.email}</div>` : ''}
      ${personal.phone ? `<div class="contact-item">📞 ${personal.phone}</div>` : ''}
      ${location !== 'City, State' ? `<div class="contact-item">📍 ${location}</div>` : ''}
      ${personal.linkedin ? `<div class="contact-item">💼 LinkedIn</div>` : ''}
    </div>
  </div>
  
  ${cvData.summary ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="summary">${cvData.summary}</div>
  </div>
  ` : ''}
  
  ${cvData.experience.length > 0 ? `
  <div class="section">
    <div class="section-title">Professional Experience</div>
    ${cvData.experience.map(exp => `
      <div class="experience-item">
        <div class="job-title">${exp.jobTitle || 'Job Title'}</div>
        <div class="company">${exp.company || 'Company Name'}</div>
        <div class="date-location">
          ${exp.startDate ? new Date(exp.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Start Date'} - 
          ${exp.isCurrentRole ? 'Present' : (exp.endDate ? new Date(exp.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'End Date')}
          ${exp.location ? ` | ${exp.location}` : ''}
        </div>
        ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : `
  <div class="section">
    <div class="section-title">Professional Experience</div>
    <div class="empty-state">Add your work experience to showcase your professional journey</div>
  </div>
  `}
  
  ${cvData.education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${cvData.education.map(edu => `
      <div class="education-item">
        <div class="degree">${edu.degree || 'Degree'}</div>
        <div class="institution">${edu.institution || 'Institution'}</div>
        <div class="date-location">
          ${edu.startDate ? new Date(edu.startDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Start'} - 
          ${edu.endDate ? new Date(edu.endDate + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'End'}
          ${edu.location ? ` | ${edu.location}` : ''}
        </div>
        ${edu.grade ? `<div class="description">Grade: ${edu.grade}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills-grid">
      ${cvData.skills.technical.length > 0 ? `
        <div class="skill-category">
          <div class="skill-category-title">Technical Skills</div>
          <div class="skill-items">${cvData.skills.technical.join(' • ')}</div>
        </div>
      ` : ''}
      ${cvData.skills.soft.length > 0 ? `
        <div class="skill-category">
          <div class="skill-category-title">Soft Skills</div>
          <div class="skill-items">${cvData.skills.soft.join(' • ')}</div>
        </div>
      ` : ''}
      ${cvData.skills.languages.length > 0 ? `
        <div class="skill-category">
          <div class="skill-category-title">Languages</div>
          <div class="skill-items">${cvData.skills.languages.join(' • ')}</div>
        </div>
      ` : ''}
      ${cvData.skills.technical.length === 0 && cvData.skills.soft.length === 0 && cvData.skills.languages.length === 0 ? `
        <div class="empty-state">Add your skills to highlight your capabilities</div>
      ` : ''}
    </div>
  </div>
</body>
</html>`;
  };

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 'header':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Personal Information</h2>
              <p className="text-gray-600 mb-6">Let's start with your basic contact information</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={cvData.personal.firstName}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personal: { ...prev.personal, firstName: e.target.value }
                }))}
                placeholder="John"
              />
              <Input
                label="Last Name"
                value={cvData.personal.lastName}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personal: { ...prev.personal, lastName: e.target.value }
                }))}
                placeholder="Doe"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City"
                value={cvData.personal.city}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personal: { ...prev.personal, city: e.target.value }
                }))}
                placeholder="New York"
              />
              <Input
                label="State/Province"
                value={cvData.personal.stateProvince}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personal: { ...prev.personal, stateProvince: e.target.value }
                }))}
                placeholder="NY"
              />
              <Input
                label="Postal Code"
                value={cvData.personal.postalCode}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personal: { ...prev.personal, postalCode: e.target.value }
                }))}
                placeholder="10001"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone"
                value={cvData.personal.phone}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personal: { ...prev.personal, phone: e.target.value }
                }))}
                placeholder="+1 (555) 123-4567"
              />
              <Input
                label="Email"
                type="email"
                value={cvData.personal.email}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personal: { ...prev.personal, email: e.target.value }
                }))}
                placeholder="john.doe@email.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="LinkedIn Profile (optional)"
                value={cvData.personal.linkedin}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personal: { ...prev.personal, linkedin: e.target.value }
                }))}
                placeholder="linkedin.com/in/johndoe"
              />
              <Input
                label="Website/Portfolio (optional)"
                value={cvData.personal.website}
                onChange={(e) => setCvData(prev => ({
                  ...prev,
                  personal: { ...prev.personal, website: e.target.value }
                }))}
                placeholder="johndoe.com"
              />
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Professional Summary</h2>
              <p className="text-gray-600 mb-6">Write a compelling summary that highlights your key strengths and career goals</p>
            </div>
            
            <Textarea
              label="Professional Summary"
              value={cvData.summary}
              onChange={(e) => setCvData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Write 2-3 sentences that showcase your professional background, key skills, and career objectives..."
              rows={6}
            />
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900 mb-1">AI Writing Tips</div>
                  <div className="text-sm text-blue-700">
                    • Start with your years of experience and field<br/>
                    • Highlight 2-3 key skills or achievements<br/>
                    • End with your career goal or value proposition
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-100"
                    icon={<Zap className="w-4 h-4" />}
                    onClick={() => setShowChat(true)}
                  >
                    Get AI Help
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Work Experience</h2>
              <p className="text-gray-600 mb-6">Add your work history, focusing on achievements and quantifiable results</p>
            </div>

            {cvData.experience.map((exp, index) => (
              <div key={exp.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Experience #{index + 1}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCvData(prev => ({
                        ...prev,
                        experience: prev.experience.filter((_, i) => i !== index)
                      }));
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Job Title"
                    value={exp.jobTitle}
                    onChange={(e) => {
                      const newExp = [...cvData.experience];
                      newExp[index] = { ...exp, jobTitle: e.target.value };
                      setCvData(prev => ({ ...prev, experience: newExp }));
                    }}
                    placeholder="Software Engineer"
                  />
                  <Input
                    label="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...cvData.experience];
                      newExp[index] = { ...exp, company: e.target.value };
                      setCvData(prev => ({ ...prev, experience: newExp }));
                    }}
                    placeholder="Tech Company Inc."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <Input
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => {
                      const newExp = [...cvData.experience];
                      newExp[index] = { ...exp, startDate: e.target.value };
                      setCvData(prev => ({ ...prev, experience: newExp }));
                    }}
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => {
                      const newExp = [...cvData.experience];
                      newExp[index] = { ...exp, endDate: e.target.value };
                      setCvData(prev => ({ ...prev, experience: newExp }));
                    }}
                    disabled={exp.isCurrentRole}
                    placeholder={exp.isCurrentRole ? "Present" : ""}
                  />
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      id={`current-${index}`}
                      checked={exp.isCurrentRole}
                      onChange={(e) => {
                        const newExp = [...cvData.experience];
                        newExp[index] = { ...exp, isCurrentRole: e.target.checked, endDate: e.target.checked ? '' : exp.endDate };
                        setCvData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor={`current-${index}`} className="text-sm text-gray-600">Current role</label>
                  </div>
                </div>

                <div className="mb-4">
                  <Input
                    label="Location (optional)"
                    value={exp.location}
                    onChange={(e) => {
                      const newExp = [...cvData.experience];
                      newExp[index] = { ...exp, location: e.target.value };
                      setCvData(prev => ({ ...prev, experience: newExp }));
                    }}
                    placeholder="New York, NY"
                  />
                </div>

                <Textarea
                  label="Job Description"
                  value={exp.description}
                  onChange={(e) => {
                    const newExp = [...cvData.experience];
                    newExp[index] = { ...exp, description: e.target.value };
                    setCvData(prev => ({ ...prev, experience: newExp }));
                  }}
                  placeholder="Describe your role and key responsibilities..."
                  rows={3}
                />
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() => {
                const newExp: WorkExperience = {
                  id: Date.now().toString(),
                  jobTitle: '',
                  company: '',
                  startDate: '',
                  endDate: '',
                  isCurrentRole: false,
                  location: '',
                  description: '',
                  achievements: []
                };
                setCvData(prev => ({ ...prev, experience: [...prev.experience, newExp] }));
              }}
              icon={<Plus className="w-4 h-4" />}
              className="w-full border-dashed border-2 border-gray-300 py-4"
            >
              Add Work Experience
            </Button>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900 mb-1">AI Enhancement Tips</div>
                  <div className="text-sm text-blue-700">
                    • Use action verbs like "Led", "Developed", "Increased"<br/>
                    • Quantify achievements with numbers and percentages<br/>
                    • Focus on results and impact, not just duties
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-100"
                    icon={<Zap className="w-4 h-4" />}
                    onClick={() => setShowChat(true)}
                  >
                    Enhance with AI
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Education</h2>
              <p className="text-gray-600 mb-6">Add your educational background and qualifications</p>
            </div>

            {cvData.education.map((edu, index) => (
              <div key={edu.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Education #{index + 1}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCvData(prev => ({
                        ...prev,
                        education: prev.education.filter((_, i) => i !== index)
                      }));
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...edu, degree: e.target.value };
                      setCvData(prev => ({ ...prev, education: newEdu }));
                    }}
                    placeholder="Bachelor of Science in Computer Science"
                  />
                  <Input
                    label="Institution"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...edu, institution: e.target.value };
                      setCvData(prev => ({ ...prev, education: newEdu }));
                    }}
                    placeholder="University of Technology"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <Input
                    label="Start Date"
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...edu, startDate: e.target.value };
                      setCvData(prev => ({ ...prev, education: newEdu }));
                    }}
                  />
                  <Input
                    label="End Date"
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...edu, endDate: e.target.value };
                      setCvData(prev => ({ ...prev, education: newEdu }));
                    }}
                  />
                  <Input
                    label="Grade (optional)"
                    value={edu.grade}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...edu, grade: e.target.value };
                      setCvData(prev => ({ ...prev, education: newEdu }));
                    }}
                    placeholder="3.8 GPA / First Class"
                  />
                </div>

                <Input
                  label="Location (optional)"
                  value={edu.location}
                  onChange={(e) => {
                    const newEdu = [...cvData.education];
                    newEdu[index] = { ...edu, location: e.target.value };
                    setCvData(prev => ({ ...prev, education: newEdu }));
                  }}
                  placeholder="Boston, MA"
                />
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() => {
                const newEdu: Education = {
                  id: Date.now().toString(),
                  degree: '',
                  institution: '',
                  startDate: '',
                  endDate: '',
                  grade: '',
                  location: ''
                };
                setCvData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
              }}
              icon={<Plus className="w-4 h-4" />}
              className="w-full border-dashed border-2 border-gray-300 py-4"
            >
              Add Education
            </Button>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Skills & Competencies</h2>
              <p className="text-gray-600 mb-6">Highlight your technical and soft skills</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Skills
                </label>
                <Textarea
                  value={cvData.skills.technical.join(', ')}
                  onChange={(e) => {
                    const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setCvData(prev => ({
                      ...prev,
                      skills: { ...prev.skills, technical: skills }
                    }));
                  }}
                  placeholder="JavaScript, React, Node.js, Python, AWS, Docker, PostgreSQL..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soft Skills
                </label>
                <Textarea
                  value={cvData.skills.soft.join(', ')}
                  onChange={(e) => {
                    const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setCvData(prev => ({
                      ...prev,
                      skills: { ...prev.skills, soft: skills }
                    }));
                  }}
                  placeholder="Leadership, Communication, Problem Solving, Teamwork, Project Management..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages
                </label>
                <Textarea
                  value={cvData.skills.languages.join(', ')}
                  onChange={(e) => {
                    const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setCvData(prev => ({
                      ...prev,
                      skills: { ...prev.skills, languages: skills }
                    }));
                  }}
                  placeholder="English (Native), Spanish (Fluent), French (Conversational)..."
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">Include proficiency levels</p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Award className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900 mb-1">AI Skill Suggestions</div>
                  <div className="text-sm text-green-700">
                    Get personalized skill recommendations based on your target role and industry trends
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-green-300 text-green-700 hover:bg-green-100"
                    icon={<Sparkles className="w-4 h-4" />}
                    onClick={() => setShowChat(true)}
                  >
                    Get AI Suggestions
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'sections':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Additional Sections</h2>
              <p className="text-gray-600 mb-6">Add optional sections to strengthen your resume</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Projects</h3>
                <p className="text-sm text-gray-600 mb-4">Showcase your notable projects and achievements</p>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  className="w-full"
                >
                  Add Projects
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
                <p className="text-sm text-gray-600 mb-4">List your professional certifications and licenses</p>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  className="w-full"
                >
                  Add Certifications
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Awards</h3>
                <p className="text-sm text-gray-600 mb-4">Highlight your professional recognitions</p>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  className="w-full"
                >
                  Add Awards
                </Button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Volunteer Work</h3>
                <p className="text-sm text-gray-600 mb-4">Show your community involvement</p>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  className="w-full"
                >
                  Add Volunteer Work
                </Button>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <div className="font-medium text-purple-900 mb-1">Premium Sections</div>
                  <div className="text-sm text-purple-700">
                    Unlock additional sections like Publications, Speaking Engagements, and more
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-purple-300 text-purple-700 hover:bg-purple-100"
                    icon={<Crown className="w-4 h-4" />}
                  >
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Section under development</div>
            <Button
              variant="outline"
              onClick={() => setShowChat(true)}
              icon={<MessageCircle className="w-4 h-4" />}
            >
              Get AI Assistance
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <div className="w-80 bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">AI Resume Builder</h2>
          </div>
          <p className="text-sm text-gray-600">Powered by AI assistance</p>
        </div>
        
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {sidebarSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.completed;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                      : isCompleted
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive 
                      ? 'bg-blue-100' 
                      : isCompleted
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{step.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {index === 0 && 'Contact information'}
                      {index === 1 && 'Professional overview'}
                      {index === 2 && 'Work history'}
                      {index === 3 && 'Educational background'}
                      {index === 4 && 'Skills & competencies'}
                      {index === 5 && 'Projects & certifications'}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Progress & Actions */}
        <div className="p-4 border-t border-gray-200 space-y-4">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span>Progress</span>
              <span>2 of 6 sections</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: '33%' }}></div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChat(!showChat)}
              icon={<MessageCircle className="w-4 h-4" />}
              className="flex-1"
            >
              AI Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
              icon={previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              className="flex-1"
            >
              {previewMode ? 'Hide' : 'Show'}
            </Button>
          </div>

          {lastSaved && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Saved {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Form Section */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            {renderCurrentStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={onBack}
                icon={<ArrowLeft className="w-4 h-4" />}
                className="px-6 py-3"
              >
                Back
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {/* Handle save */}}
                  icon={<Save className="w-4 h-4" />}
                  loading={isSaving}
                  className="px-6 py-3"
                >
                  Save Draft
                </Button>
                <Button
                  onClick={() => {/* Handle next */}}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* CV Preview Section */}
        {previewMode && (
          <div className="w-96 bg-gray-100 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Live Preview</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Auto-saved</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" icon={<Download className="w-3 h-3" />}>
                  Download
                </Button>
                <Button size="sm" variant="outline" icon={<RefreshCw className="w-3 h-3" />}>
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4">
              <div className="bg-white rounded-lg shadow-xl border border-gray-200 h-full overflow-hidden">
                <div 
                  className="w-full h-full"
                  style={{ aspectRatio: '0.7076648841354723' }}
                >
                  <iframe
                    src={`data:text/html;charset=utf-8,${encodeURIComponent(generateCVHTML())}`}
                    className="w-full h-full border-0 rounded-lg"
                    style={{ 
                      transform: 'scale(0.85)',
                      transformOrigin: 'top center'
                    }}
                    title="CV Preview"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Chat Panel */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-end z-50">
          <div className="w-96 h-[600px] bg-white rounded-t-xl shadow-2xl flex flex-col m-4">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold">AI Resume Assistant</div>
                    <div className="text-xs text-blue-100">
                      {isAITyping ? 'Typing...' : 'Online'}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowChat(false)}
                  className="text-white hover:bg-white/20"
                >
                  ×
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="text-sm">{message.content}</div>
                    {message.suggestions && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs bg-white/10 hover:bg-white/20 rounded px-2 py-1 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isAITyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Ask me anything about your resume..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isAITyping}
                  icon={<Send className="w-4 h-4" />}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIResumeBuilder;