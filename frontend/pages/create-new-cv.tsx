import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Download, FileText, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

import FormStepper from '@/components/creator/FormStepper';
import Step1_Personal from '@/components/creator/Step1_Personal';
import Step2_Experience from '@/components/creator/Step2_Experience';
import Step3_Education from '@/components/creator/Step3_Education';
import Step4_Skills from '@/components/creator/Step4_Skills';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';

import { cvAPI, downloadPDF, getErrorMessage } from '@/utils/api';
import { PersonalDetails, WorkExperience, Education, CVFormData, PDFResponse } from '@/types';
import safeStorage from '@/utils/storage';

const steps = [
  { id: 1, title: 'Personal Info', description: 'Contact details' },
  { id: 2, title: 'Experience', description: 'Work history' },
  { id: 3, title: 'Education', description: 'Qualifications' },
  { id: 4, title: 'Skills', description: 'Skills & targeting' },
];

const CreateNewCVPage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PDFResponse | null>(null);

  // Form data state
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string | undefined>();
  const [selectedTheme, setSelectedTheme] = useState<string>('classic');

  const handleStep1Next = (data: PersonalDetails) => {
    setPersonalDetails(data);
    setCompletedSteps(prev => [...prev.filter(s => s !== 1), 1]);
    setCurrentStep(2);
  };

  const handleStep2Next = (data: WorkExperience[]) => {
    setWorkExperience(data);
    setCompletedSteps(prev => [...prev.filter(s => s !== 2), 2]);
    setCurrentStep(3);
  };

  const handleStep3Next = (data: Education[]) => {
    setEducation(data);
    setCompletedSteps(prev => [...prev.filter(s => s !== 3), 3]);
    setCurrentStep(4);
  };

  const handleStep4Next = async (data: { skills: string; job_description?: string; theme?: string }) => {
    setSkills(data.skills);
    setJobDescription(data.job_description);
    if (data.theme) {
      setSelectedTheme(data.theme);
    }
    setCompletedSteps(prev => [...prev.filter(s => s !== 4), 4]);
    
    // Generate CV
    await generateCV(data.skills, data.job_description);
  };

  const generateCV = async (skillsData: string, jobDescriptionData?: string) => {
    if (!personalDetails) {
      toast.error('Personal details are missing');
      return;
    }

    setLoading(true);

    try {
      const formData: CVFormData = {
        personal_details: personalDetails,
        work_experience: workExperience,
        education: education,
        skills: skillsData,
        job_description: jobDescriptionData,
        theme: selectedTheme
      };

      // Debug logging to see what's being sent
      console.log('Form data being sent to API:', JSON.stringify(formData, null, 2));
      
      // Validate required fields before sending
      if (!personalDetails.full_name || !personalDetails.email || !personalDetails.phone) {
        throw new Error('Personal details are incomplete');
      }
      
      if (workExperience.length === 0) {
        throw new Error('At least one work experience entry is required');
      }
      
      if (education.length === 0) {
        throw new Error('At least one education entry is required');
      }
      
      if (!skillsData || skillsData.trim().length < 10) {
        throw new Error('Skills section must be at least 10 characters');
      }

      const response = await cvAPI.generateFromForm(formData);
      
      // Store results in session storage and redirect to results page
      const resultsData = {
        cvPdf: response.cv_pdf_base64,
        coverLetterPdf: response.cover_letter_pdf_base64,
        filenameCV: response.filename_cv,
        filenameCoverLetter: response.filename_cover_letter,
        cvData: response.cv_data || {
          personal_details: formData.personal_details,
          professional_summary: '',
          work_experience: formData.work_experience,
          education: formData.education,
          skills: { technical: [], soft: [], languages: [] },
          cover_letter_body: '',
          company_name: '[Company Name]',
          job_title: 'the position'
        }
      };
      
      const stored = safeStorage.setItem('cvResults', resultsData);
      
      if (stored) {
        router.push('/results');
        toast.success('CV generated successfully!');
      } else {
        toast.error('Error processing results. Please try again.');
      }
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      console.error('CV generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDownload = (type: 'cv' | 'cover_letter') => {
    if (!result) return;
    
    try {
      if (type === 'cv') {
        downloadPDF(result.cv_pdf_base64, result.filename_cv);
        toast.success('CV downloaded successfully!');
      } else {
        downloadPDF(result.cover_letter_pdf_base64, result.filename_cover_letter);
        toast.success('Cover letter downloaded successfully!');
      }
    } catch (error) {
      toast.error('Download failed. Please try again.');
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setPersonalDetails(null);
    setWorkExperience([]);
    setEducation([]);
    setSkills('');
    setJobDescription(undefined);
    setSelectedTheme('classic');
    setResult(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1_Personal
            initialData={personalDetails || undefined}
            onNext={handleStep1Next}
            isFirstStep={true}
          />
        );
      case 2:
        return (
          <Step2_Experience
            initialData={workExperience}
            onNext={handleStep2Next}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <Step3_Education
            initialData={education}
            onNext={handleStep3Next}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <Step4_Skills
            initialData={{ skills, job_description: jobDescription, theme: selectedTheme }}
            onNext={handleStep4Next}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Head>
        <title>Create New CV - CVGenius | AI-Powered CV Builder</title>
        <meta name="description" content="Build a professional CV from scratch with our AI-powered guided form. Create ATS-friendly CVs and cover letters in minutes." />
        <meta name="keywords" content="CV builder, resume creator, AI CV maker, professional CV, ATS friendly" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center text-gray-600 hover:text-primary-600 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-900">CVGenius</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!result && !loading ? (
            <>
              {/* Page Header */}
              <div className="text-center mb-12">
                <div className="relative">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                      Create Your Professional CV
                    </span>
                  </h1>
                  <div className="absolute -top-2 -right-4 text-2xl animate-bounce">✨</div>
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  🚀 Follow our step-by-step guide to build a compelling CV. 
                  Our AI will transform your information into professional, ATS-friendly content.
                </p>
                <div className="mt-6 inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 rounded-full px-6 py-3 border border-blue-200">
                  <span className="text-sm font-medium text-blue-800">🎯 Optimized for Dublin & European job markets</span>
                </div>
              </div>

              {/* Progress Stepper */}
              <FormStepper
                steps={steps}
                currentStep={currentStep}
                completedSteps={completedSteps}
              />

              {/* Current Step Content */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 transform hover:scale-[1.01] transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep - 1]?.title}</h2>
                  <p className="text-gray-600">{steps[currentStep - 1]?.description}</p>
                </div>
                {renderCurrentStep()}
              </div>
            </>
          ) : loading ? (
            /* Loading State */
            <div className="text-center py-20">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl animate-pulse"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-12 border border-white/30 shadow-2xl">
                  <LoadingSpinner size="xl" message="Our AI is crafting your professional CV..." />
                  <div className="mt-8 max-w-lg mx-auto">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/50 rounded-2xl p-6">
                      <h3 className="font-bold text-blue-900 mb-4 text-lg">✨ AI Magic in Progress:</h3>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li className="flex items-center"><span className="mr-2">🔍</span> Analyzing your experience and skills</li>
                        <li className="flex items-center"><span className="mr-2">✍️</span> Creating compelling professional content</li>
                        <li className="flex items-center"><span className="mr-2">🎯</span> Optimizing for ATS systems</li>
                        <li className="flex items-center"><span className="mr-2">💌</span> Generating your cover letter</li>
                        <li className="flex items-center"><span className="mr-2">📄</span> Formatting beautiful PDFs</li>
                      </ul>
                    </div>
                    <p className="text-sm text-gray-500 mt-6 font-medium">
                      ⏱️ This usually takes 20-40 seconds
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Results Section */
            <div className="text-center py-12">
              <div className="mb-12">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
                    <FileText className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-8 text-3xl animate-pulse">🎉</div>
                  <div className="absolute -top-4 -left-8 text-2xl animate-bounce delay-300">✨</div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Your Professional CV is Ready!
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  🎯 Your CV and cover letter have been generated with AI-enhanced content. 
                  Both documents are professionally formatted and optimized for ATS systems.
                </p>
              </div>

              {/* Download Buttons */}
              <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto mb-12">
                <Button
                  onClick={() => handleDownload('cv')}
                  icon={<Download className="w-5 h-5" />}
                  size="lg"
                  className="w-full"
                >
                  Download CV
                </Button>
                
                <Button
                  onClick={() => handleDownload('cover_letter')}
                  icon={<Mail className="w-5 h-5" />}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Download Cover Letter
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  onClick={resetForm}
                  variant="secondary"
                >
                  Create Another CV
                </Button>
                
                <Link href="/update-cv">
                  <Button variant="outline">
                    Update Existing CV Instead
                  </Button>
                </Link>
              </div>

              {/* Tips */}
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/50 rounded-2xl p-8 text-left shadow-xl">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">🚀</span>
                  <h3 className="font-bold text-blue-900 text-xl">Next Steps to Land Your Dream Job:</h3>
                </div>
                <ul className="text-blue-800 space-y-3">
                  <li className="flex items-start"><span className="mr-3 text-lg">📝</span><span>Review your CV and make any personal adjustments</span></li>
                  <li className="flex items-start"><span className="mr-3 text-lg">🎯</span><span>Customize the cover letter with specific company details</span></li>
                  <li className="flex items-start"><span className="mr-3 text-lg">💾</span><span>Save both documents for your job applications</span></li>
                  <li className="flex items-start"><span className="mr-3 text-lg">💼</span><span>Update your LinkedIn profile with the enhanced content</span></li>
                </ul>
              </div>

              {/* Generation Info */}
              <div className="mt-8 text-sm text-gray-500">
                <p>Generated on {result ? new Date(result.generation_timestamp).toLocaleString() : 'Unknown'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateNewCVPage;