import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Award, 
  FileText, 
  Plus,
  ArrowLeft,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface PersonalData {
  firstName: string;
  lastName: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  phone: string;
  email: string;
}

interface CVBuilderStepProps {
  onBack?: () => void;
  onContinue?: (data: PersonalData) => void;
}

const CVBuilderStep: React.FC<CVBuilderStepProps> = ({ onBack, onContinue }) => {
  const [formData, setFormData] = useState<PersonalData>({
    firstName: 'John',
    lastName: 'Doe',
    city: 'New York',
    stateProvince: 'NY',
    postalCode: '10001',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com'
  });

  const [currentStep, setCurrentStep] = useState('header');
  const [iframeKey, setIframeKey] = useState(0);

  const sidebarSteps = [
    { id: 'header', label: 'Header', icon: User, completed: false, active: true },
    { id: 'experience', label: 'Experience', icon: Briefcase, completed: false, active: false },
    { id: 'education', label: 'Education', icon: GraduationCap, completed: false, active: false },
    { id: 'skills', label: 'Skills', icon: Award, completed: false, active: false },
    { id: 'summary', label: 'Summary', icon: FileText, completed: false, active: false },
    { id: 'other', label: 'Other sections', icon: Plus, completed: false, active: false }
  ];

  const handleInputChange = (field: keyof PersonalData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Trigger iframe update by changing key
    setIframeKey(prev => prev + 1);
  };

  // Generate CV HTML content
  const generateCVHTML = () => {
    const name = (formData.firstName && formData.lastName) 
      ? `${formData.firstName} ${formData.lastName}` 
      : 'FIRST NAME LAST NAME';
    
    const location = [formData.city, formData.stateProvince, formData.postalCode]
      .filter(Boolean)
      .join(', ') || 'City, State 12345';
    
    const phone = formData.phone || '+1 (555) 123-4567';
    const email = formData.email || 'john.doe@email.com';

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 40px;
      line-height: 1.6;
      color: #333;
      background: white;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .name {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .contact {
      font-size: 14px;
      color: #666;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 5px;
      margin-bottom: 15px;
    }
    .job {
      margin-bottom: 15px;
    }
    .job-title {
      font-weight: bold;
      font-size: 14px;
    }
    .company {
      font-style: italic;
      color: #666;
      font-size: 13px;
    }
    .achievement {
      font-size: 13px;
      margin-left: 15px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${name}</div>
    <div class="contact">
      ${location}<br>
      ${phone}<br>
      ${email}
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">SUMMARY</div>
    <p>Experienced professional with a strong background in delivering results and driving innovation. Proven track record of success in dynamic environments.</p>
  </div>
  
  <div class="section">
    <div class="section-title">EXPERIENCE</div>
    <div class="job">
      <div class="job-title">Senior Position</div>
      <div class="company">Company Name | 2020 - Present</div>
      <div class="achievement">• Led cross-functional teams to deliver key projects</div>
      <div class="achievement">• Increased efficiency by 30% through process optimization</div>
    </div>
    <div class="job">
      <div class="job-title">Previous Role</div>
      <div class="company">Previous Company | 2018 - 2020</div>
      <div class="achievement">• Managed multiple client accounts successfully</div>
      <div class="achievement">• Implemented new strategies resulting in growth</div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">SKILLS</div>
    <p>Project Management • Leadership • Strategic Planning • Communication • Problem Solving • Data Analysis</p>
  </div>
  
  <div class="section">
    <div class="section-title">EDUCATION</div>
    <div class="job-title">Master of Business Administration</div>
    <div class="company">University Name | 2018</div>
  </div>
</body>
</html>`;
  };

  const handleContinue = () => {
    if (onContinue) {
      onContinue(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-80 bg-white shadow-lg flex flex-col lg:sticky lg:top-0 lg:h-screen">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">CV Builder</h2>
          <p className="text-sm text-gray-600 mt-1">Step by step creation</p>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <nav className="space-y-2 lg:space-y-1 flex lg:flex-col gap-2 lg:gap-0 overflow-x-auto lg:overflow-x-visible">
            {sidebarSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.completed;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`w-full lg:w-auto flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left whitespace-nowrap ${
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
                    {index === 0 && (
                      <div className="text-xs text-gray-500 mt-0.5 hidden lg:block">Contact information</div>
                    )}
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Progress</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: '16.67%' }}></div>
          </div>
          <div className="text-xs text-gray-600 mt-1">1 of 6 sections</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col xl:flex-row">
        {/* Form Section */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-none xl:max-w-2xl">
          <div className="max-w-xl">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                How do you want recruiters to contact you?
              </h1>
              <p className="text-gray-600 leading-relaxed">
                We suggest including an email and phone number. This information will be displayed at the top of your resume.
              </p>
            </div>

            <form className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Input
                  label="First name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="e.g. John"
                  className="font-medium"
                />
                <Input
                  label="Last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="e.g. Doe"
                  className="font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="e.g. New York"
                />
                <Input
                  label="State/Province"
                  value={formData.stateProvince}
                  onChange={(e) => handleInputChange('stateProvince', e.target.value)}
                  placeholder="e.g. NY"
                />
                <Input
                  label="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="e.g. 10001"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Input
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="e.g. +1 (555) 123-4567"
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="e.g. john.doe@email.com"
                />
              </div>
            </form>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={onBack}
                icon={<ArrowLeft className="w-4 h-4" />}
                className="px-6 py-3 w-full sm:w-auto"
              >
                Back
              </Button>
              <Button
                onClick={handleContinue}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 w-full sm:w-auto"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>

        {/* CV Preview Section */}
        <div className="w-full xl:w-96 bg-gray-100 p-4 sm:p-6 border-t xl:border-t-0 xl:border-l border-gray-200">
          <div className="xl:sticky xl:top-6">
            {/* CV Iframe Preview Container */}
            <div className="relative bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden mb-4">
              <div className="text-xs text-gray-500 mb-4 p-4 pb-0 text-center">Live Preview</div>
              
              {/* Iframe Container with Aspect Ratio */}
              <div 
                className="relative bg-white"
                                  style={{ 
                    aspectRatio: '0.7076648841354723'
                  }}
              >
                <iframe
                  key={iframeKey}
                  src={`data:text/html;charset=utf-8,${encodeURIComponent(generateCVHTML())}`}
                  width="794"
                  height="1122"
                  scrolling="no"
                  tabIndex={-1}
                  className="absolute inset-0 w-full h-full border-0"
                  style={{ 
                    transform: 'scale(0.979495)',
                    transformOrigin: 'top left'
                  }}
                  title="CV Preview"
                />

                {/* Status Label */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-gray-200 flex items-center gap-2">
                  <div className="w-4 h-4 text-green-600">
                    <svg fill="none" viewBox="0 0 24 24" className="w-full h-full">
                      <path 
                        stroke="currentColor" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="1.5" 
                        d="M4.75 12A7.25 7.25 0 0 1 12 4.75v0A7.25 7.25 0 0 1 19.25 12v0A7.25 7.25 0 0 1 12 19.25v0A7.25 7.25 0 0 1 4.75 12v0Z"
                      />
                      <path 
                        stroke="currentColor" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="1.5" 
                        d="m9.75 12.75.434.924a1 1 0 0 0 1.772.073L14.25 9.75"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-700">Saved</span>
                </div>
              </div>
            </div>

            {/* Preview Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText className="w-3 h-3 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-blue-900 mb-1">Live Preview</div>
                  <div className="text-xs text-blue-700 leading-relaxed">
                    Your changes appear here instantly. This is how your CV will look to recruiters.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVBuilderStep;