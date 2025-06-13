import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CoverLetterEditor from '@/components/editor/CoverLetterEditor';
import CoverLetterPreview from '@/components/preview/CoverLetterPreview';
import CVEditor from '@/components/editor/CVEditor';
// import CVEditorEnhanced from '@/components/editor/CVEditorEnhanced';
import type { CoverLetterData } from '@/components/editor/CoverLetterEditor';
import { downloadPDF, cvAPI } from '@/utils/api';
import safeStorage from '@/utils/storage';

interface CVData {
  personal_details: {
    full_name: string;
    email: string;
    phone: string;
    linkedin_url?: string;
    location: string;
  };
  professional_summary: string;
  work_experience: Array<{
    job_title: string;
    company: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    location: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    start_date: string;
    end_date: string;
    grade: string;
    location: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  cover_letter_body: string;
  company_name: string;
  job_title: string;
  job_description?: string;
}

interface ResultsData {
  cvPdf: string;
  coverLetterPdf: string;
  filenameCV: string;
  filenameCoverLetter: string;
  cvData: CVData;
}

const ResultsPage = () => {
  const router = useRouter();
  const [resultsData, setResultsData] = useState<ResultsData | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showCoverLetterPreview, setShowCoverLetterPreview] = useState(false);
  const [showCVEditor, setShowCVEditor] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  // const [useEnhancedEditor] = useState(false); // TODO: Add toggle for enhanced editor

  useEffect(() => {
    // Get data from session storage using safe storage utility
    const parsedData = safeStorage.getItem<ResultsData>('cvResults');
    
    if (parsedData) {
      setResultsData(parsedData);
    } else {
      // Redirect back if no data
      router.push('/');
    }
  }, [router]);

  const handleDownloadCV = () => {
    if (resultsData) {
      downloadPDF(resultsData.cvPdf, resultsData.filenameCV);
    }
  };

  const handleDownloadCoverLetter = () => {
    if (resultsData) {
      downloadPDF(resultsData.coverLetterPdf, resultsData.filenameCoverLetter);
    }
  };

  const handleDownloadBoth = () => {
    if (resultsData) {
      downloadPDF(resultsData.cvPdf, resultsData.filenameCV);
      downloadPDF(resultsData.coverLetterPdf, resultsData.filenameCoverLetter);
    }
  };

  const handleEditCoverLetter = () => {
    setShowCoverLetterPreview(true);
  };

  const handleEditCV = () => {
    setShowCVEditor(true);
  };

  const handleRegenerateCoverLetter = async () => {
    if (!resultsData) return;
    
    setIsRegenerating(true);
    try {
      // Call API to regenerate cover letter
      const updatedData = await cvAPI.regenerateCoverLetter(
        resultsData.cvData,
        resultsData.cvData.job_description
      );
      
      // Update the results data with new cover letter content
      setResultsData(prev => prev ? {
        ...prev,
        cvData: {
          ...prev.cvData,
          ...updatedData
        }
      } : null);
      
    } catch (error) {
      console.error('Error regenerating cover letter:', error);
      alert('Failed to regenerate cover letter. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSaveCoverLetter = async (updatedData: CoverLetterData) => {
    try {
      // Call API to generate new PDF with updated data
      const pdfResponse = await cvAPI.generateCoverLetterPDF(updatedData);
      
      // Update the results data with new PDF
      setResultsData(prev => prev ? {
        ...prev,
        coverLetterPdf: pdfResponse.cover_letter_pdf_base64,
        filenameCoverLetter: pdfResponse.filename_cover_letter,
        cvData: {
          ...prev.cvData,
          ...updatedData
        }
      } : null);
      
      setShowEditor(false);
      setShowCoverLetterPreview(false);
      
      // Show success message
      alert('Cover letter updated successfully!');
      
    } catch (error) {
      console.error('Error generating updated PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleSaveCV = async (updatedData: any) => {
    try {
      // Call API to generate new PDF with updated CV data
      const pdfResponse = await cvAPI.generateCVPDF(updatedData);
      
      // Update the results data with new PDF
      setResultsData(prev => prev ? {
        ...prev,
        cvPdf: pdfResponse.cv_pdf_base64,
        filenameCV: pdfResponse.filename_cv,
        cvData: {
          ...prev.cvData,
          ...updatedData
        }
      } : null);
      
      setShowCVEditor(false);
      
      // Show success message
      alert('CV updated successfully!');
      
    } catch (error) {
      console.error('Error generating updated CV PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setShowCVEditor(false);
    setShowCoverLetterPreview(false);
  };

  const handleStartOver = () => {
    safeStorage.removeItem('cvResults');
    router.push('/');
  };

  if (!resultsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (showEditor) {
    return (
      <>
        <Head>
          <title>Edit Cover Letter - CVGenius</title>
          <meta name="description" content="Edit and customize your AI-generated cover letter" />
        </Head>
        <CoverLetterEditor
          initialData={{
            personal_details: resultsData.cvData.personal_details,
            company_name: resultsData.cvData.company_name || '[Company Name]',
            job_title: resultsData.cvData.job_title || 'the position',
            cover_letter_body: resultsData.cvData.cover_letter_body,
            generation_date: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          }}
          onSave={handleSaveCoverLetter}
          onCancel={handleCancelEdit}
          onRegenerate={handleRegenerateCoverLetter}
          isRegenerating={isRegenerating}
        />
      </>
    );
  }

  if (showCoverLetterPreview) {
    return (
      <>
        <Head>
          <title>Cover Letter Preview - CVGenius</title>
          <meta name="description" content="Preview and edit your AI-generated cover letter" />
        </Head>
        <CoverLetterPreview
          data={{
            personal_details: resultsData.cvData.personal_details,
            company_name: resultsData.cvData.company_name || '[Company Name]',
            job_title: resultsData.cvData.job_title || 'the position',
            cover_letter_body: resultsData.cvData.cover_letter_body,
            generation_date: new Date().toLocaleDateString('en-IE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })
          }}
          onEdit={() => {
            setShowCoverLetterPreview(false);
            setShowEditor(true);
          }}
          onDownload={handleDownloadCoverLetter}
        />
      </>
    );
  }

  if (showCVEditor) {
    return (
      <>
        <Head>
          <title>Edit CV - CVGenius</title>
          <meta name="description" content="Edit and customize your AI-generated CV" />
        </Head>
        <CVEditor
          initialData={resultsData.cvData}
          originalPdfBase64={resultsData.cvPdf}
          originalFilename={resultsData.filenameCV}
          onSave={handleSaveCV}
          onBack={() => setShowCVEditor(false)}
        />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Your CV & Cover Letter - CVGenius</title>
        <meta name="description" content="Download your professional CV and cover letter" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🎉 Your Professional Documents Are Ready!
              </h1>
              <p className="text-xl text-gray-600">
                Your AI-generated CV and cover letter are optimized for your target role
              </p>
            </div>

            {/* Results Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* CV Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Professional CV</h3>
                    <p className="text-gray-600">ATS-optimized and tailored</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Filename</div>
                    <div className="font-medium">{resultsData.filenameCV}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={handleEditCV}
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Preview & Edit
                    </Button>
                    <Button 
                      onClick={handleDownloadCV}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Download CV
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cover Letter Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Cover Letter</h3>
                    <p className="text-gray-600">Personalized and compelling</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Filename</div>
                    <div className="font-medium">{resultsData.filenameCoverLetter}</div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={handleEditCoverLetter}
                      variant="outline"
                      className="w-full border-green-300 text-green-700 hover:bg-green-50"
                    >
                      🇮🇪 Dublin Preview
                    </Button>
                    <Button 
                      onClick={handleDownloadCoverLetter}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Download Cover Letter
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleDownloadBoth}
                className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3"
              >
                Download Both Documents
              </Button>
              <Button 
                onClick={handleStartOver}
                variant="outline"
                className="text-lg px-8 py-3"
              >
                Create Another CV
              </Button>
            </div>

            {/* Tips Section */}
            <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Next Steps</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Review Before Sending</h4>
                  <p className="text-sm text-gray-600">Always double-check your documents for accuracy and tailor them further if needed.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2H8a2 2 0 00-2-2V6m8 0H8m0 0v-.571c0-.621.504-1.125 1.125-1.125h5.75c.621 0 1.125.504 1.125 1.125V6H8z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Save Multiple Versions</h4>
                  <p className="text-sm text-gray-600">Keep different versions for different types of roles and companies.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Apply with Confidence</h4>
                  <p className="text-sm text-gray-600">Your documents are professionally formatted and ready for job applications.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultsPage;