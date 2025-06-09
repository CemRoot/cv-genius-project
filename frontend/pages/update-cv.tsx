import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, Download, FileText, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import FileUpload from '@/components/updater/FileUpload';
import { cvAPI, downloadPDF, getErrorMessage } from '@/utils/api';
import { PDFResponse } from '@/types';

const UpdateCVPage: React.FC = () => {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PDFResponse | null>(null);
  const [errors, setErrors] = useState<{ file?: string; jobDescription?: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { file?: string; jobDescription?: string } = {};
    
    if (!selectedFile) {
      newErrors.file = 'Please upload your CV file';
    }
    
    if (!jobDescription.trim()) {
      newErrors.jobDescription = 'Job description is required';
    } else if (jobDescription.trim().length < 50) {
      newErrors.jobDescription = 'Job description must be at least 50 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await cvAPI.generateFromUpload(selectedFile!, jobDescription);
      
      // Store results in session storage and redirect to results page
      const resultsData = {
        cvPdf: response.cv_pdf_base64,
        coverLetterPdf: response.cover_letter_pdf_base64,
        filenameCV: response.filename_cv,
        filenameCoverLetter: response.filename_cover_letter,
        cvData: response.cv_data || {
          job_description: jobDescription,
          // Fallback data structure if cv_data not available
        }
      };
      
      sessionStorage.setItem('cvResults', JSON.stringify(resultsData));
      router.push('/results');
      toast.success('CV optimized successfully!');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      console.error('CV generation failed:', error);
    } finally {
      setLoading(false);
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
    setSelectedFile(null);
    setJobDescription('');
    setResult(null);
    setErrors({});
  };

  return (
    <>
      <Head>
        <title>Update CV - CVGenius | Optimize Your Existing CV with AI</title>
        <meta name="description" content="Upload your existing CV and optimize it for specific job applications with AI. Get ATS-friendly improvements in seconds." />
        <meta name="keywords" content="CV optimizer, resume updater, ATS optimization, job application, AI CV improvement" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!result ? (
            <>
              {/* Page Header */}
              <div className="text-center mb-16">
                <div className="relative">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                      Update Your Existing CV
                    </span>
                  </h1>
                  <div className="absolute -top-2 -right-4 text-2xl animate-bounce">🔄</div>
                </div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
                  📤 Upload your current CV and provide a job description. Our AI will optimize 
                  your CV to better match the role and create a tailored cover letter.
                </p>
                <div className="inline-flex items-center bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full px-6 py-3 border border-emerald-200">
                  <span className="text-sm font-medium text-emerald-800">⚡ Instant optimization for better ATS compatibility</span>
                </div>
              </div>

              {/* Main Form */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 border-b border-emerald-200/50">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <span className="mr-3">🎯</span>
                    Optimize Your CV
                  </h2>
                  <p className="text-gray-600 mt-2">Two simple steps to transform your CV</p>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-10">
                  {/* File Upload Section */}
                  <div className="relative">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                        Upload Your CV
                      </h3>
                      <FileUpload
                        onFileSelect={setSelectedFile}
                        selectedFile={selectedFile}
                        error={errors.file}
                      />
                    </div>
                  </div>

                  {/* Job Description Section */}
                  <div className="relative">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                        Job Description
                      </h3>
                      <Textarea
                        label="Paste the job description you're applying for"
                        placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        error={errors.jobDescription}
                        rows={8}
                        required
                        helpText="The more detailed the job description, the better we can optimize your CV"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-8">
                    <div className="text-center">
                      <Button
                        type="submit"
                        size="lg"
                        loading={loading}
                        disabled={loading || !selectedFile || !jobDescription.trim()}
                        className="px-16 py-4 text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
                      >
                        {loading ? '⚙️ Optimizing Your CV...' : '🚀 Optimize My CV'}
                      </Button>
                      {selectedFile && jobDescription.trim().length >= 50 && (
                        <p className="text-sm text-emerald-600 mt-3 font-medium">✓ Ready for optimization!</p>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="mt-12 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-3xl animate-pulse"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-white/30 shadow-2xl">
                      <LoadingSpinner size="lg" message="Our AI is analyzing your CV and optimizing it for the job..." />
                      <div className="mt-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-4 border border-emerald-200/50">
                        <p className="text-sm text-emerald-700 font-medium">
                          ⏱️ This usually takes 15-30 seconds
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Results Section */
            <div className="text-center">
              <div className="mb-12">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
                    <FileText className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-8 text-3xl animate-pulse">🎉</div>
                  <div className="absolute -top-4 -left-8 text-2xl animate-bounce delay-300">✨</div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    Your CV Has Been Optimized!
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  🎯 Your updated CV and tailored cover letter are ready for download. 
                  Both documents have been optimized for ATS systems and the specific job requirements.
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button
                  onClick={resetForm}
                  variant="secondary"
                >
                  Optimize Another CV
                </Button>
                
                <Link href="/create-new-cv">
                  <Button variant="outline">
                    Create New CV Instead
                  </Button>
                </Link>
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

export default UpdateCVPage;