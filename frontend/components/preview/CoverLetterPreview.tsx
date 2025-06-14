import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import CoverLetterMobilePreview from '@/components/mobile/CoverLetterMobilePreview';

interface CoverLetterData {
  personal_details: {
    full_name: string;
    email: string;
    phone: string;
    linkedin_url?: string;
    location: string;
  };
  company_name: string;
  company_address?: string;
  job_title: string;
  cover_letter_body: string;
  generation_date: string;
  include_company_address?: boolean;
  theme?: string;
}

interface CoverLetterPreviewProps {
  data: CoverLetterData;
  onEdit: () => void;
  onDownload: () => void;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ data, onEdit, onDownload }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-IE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format Irish phone numbers
    if (phone.startsWith('+353')) {
      return phone.replace(/(\+353)(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4');
    }
    return phone;
  };

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'modern':
        return {
          fontFamily: 'Arial, sans-serif',
          headerStyle: { borderBottom: '2px solid #3B82F6', paddingBottom: '10px' },
          nameStyle: { color: '#1E40AF', fontSize: '20pt' },
          subjectLine: true
        };
      case 'academic':
        return {
          fontFamily: 'Times New Roman, serif',
          headerStyle: { borderBottom: '1px solid #6B7280' },
          nameStyle: { fontSize: '16pt', fontWeight: 'normal' },
          formalClosing: true
        };
      default: // classic
        return {
          fontFamily: 'Arial, sans-serif',
          headerStyle: { borderBottom: '1px solid #d1d5db' },
          nameStyle: { fontSize: '18pt' }
        };
    }
  };

  const theme = data.theme || 'classic';
  const themeStyles = getThemeStyles(theme);

  // Use mobile preview for mobile devices
  if (isMobile) {
    return (
      <CoverLetterMobilePreview
        data={data}
        onEdit={onEdit}
        onDownload={onDownload}
        className="mx-4"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Dublin Standards Badge */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-medium rounded-full w-fit">
            🇮🇪 Dublin Format
          </span>
          <span className="text-sm text-gray-600">
            Optimized for Irish employers
          </span>
        </div>
        <div className="flex gap-2 justify-end sm:justify-start">
          <Button variant="outline" onClick={onEdit} size="sm" className="flex-1 sm:flex-none">
            Edit Content
          </Button>
          <Button onClick={onDownload} size="sm" className="flex-1 sm:flex-none">
            Download PDF
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div style={{ padding: '20mm', fontFamily: themeStyles.fontFamily, lineHeight: '1.6' }}>
          
          {/* Header Section */}
          <div className="mb-5 pb-5" style={themeStyles.headerStyle}>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="font-semibold text-gray-900 mb-1 break-words" style={themeStyles.nameStyle}>
                  {data.personal_details.full_name}
                </h1>
                <div className="text-sm text-gray-600 space-y-0" style={{ fontSize: '10pt', lineHeight: '1.25' }}>
                  <div className="break-all" style={{ marginBottom: '2px' }}>{data.personal_details.email}</div>
                  <div style={{ marginBottom: '2px' }}>{formatPhoneNumber(data.personal_details.phone)}</div>
                  <div style={{ marginBottom: '2px' }}>{data.personal_details.location}</div>
                  {data.personal_details.linkedin_url && (
                    <div className="text-blue-600 break-all">{data.personal_details.linkedin_url}</div>
                  )}
                </div>
              </div>
              
              <div className="text-right text-sm text-gray-600" style={{ fontSize: '10pt' }}>
                {formatDate(data.generation_date)}
              </div>
            </div>
          </div>

          {/* Recipient Section */}
          <div className="mb-4">
            <div className="text-gray-600 space-y-0" style={{ fontSize: '10pt', lineHeight: '1.25' }}>
              <div className="font-medium break-words text-gray-900" style={{ marginBottom: '1px' }}>{data.company_name}</div>
              {data.job_title && (
                <div className="italic" style={{ marginBottom: '1px' }}>{data.job_title}</div>
              )}
              {data.include_company_address && data.company_address && (
                <div className="whitespace-pre-line">{data.company_address}</div>
              )}
            </div>
          </div>

          {/* Subject Line (Modern theme only) */}
          {themeStyles.subjectLine && data.job_title && (
            <div className="mb-4 font-medium" style={{ fontSize: '11pt' }}>
              <strong>Re: {data.job_title}</strong>
            </div>
          )}

          {/* Salutation */}
          <div className="mb-4 font-medium break-words" style={{ fontSize: '11pt' }}>
            {theme === 'academic' ? `Dear ${data.company_name} Selection Committee,` : `Dear ${data.company_name} Hiring Team,`}
          </div>

          {/* Letter Body */}
          <div className="text-gray-700" style={{ fontSize: '11pt', lineHeight: '1.75' }}>
            {data.cover_letter_body.includes('<p>') && data.cover_letter_body.includes('</p>') ? (
              <div 
                className="text-justify space-y-3"
                dangerouslySetInnerHTML={{ __html: data.cover_letter_body }}
                style={{ 
                  '& p': { marginBottom: '12px' }
                } as React.CSSProperties}
              />
            ) : (
              <div className="space-y-3">
                {data.cover_letter_body.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-justify" style={{ marginBottom: '12px' }}>
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Closing */}
          <div className="mt-6">
            <div className="mb-4" style={{ fontSize: '11pt' }}>Yours sincerely,</div>
            {themeStyles.formalClosing && (
              <div className="mb-4" style={{ fontSize: '11pt', borderBottom: '1px solid #000', width: '200px', height: '40px' }}></div>
            )}
            <div className="font-medium break-words" style={{ fontSize: '11pt' }}>{data.personal_details.full_name}</div>
          </div>
        </div>

        {/* Format Info Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-600">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span>✓ A4 Format</span>
              <span>✓ ATS-Friendly</span>
              <span>✓ Dublin Standards</span>
            </div>
            <div className="text-right sm:text-left">
              Character count: {data.cover_letter_body.length}
            </div>
          </div>
        </div>
      </div>

      {/* Dublin Tips */}
      <div className="mt-4 p-3 sm:p-4 bg-blue-50 rounded-lg text-sm">
        <h4 className="font-medium text-blue-900 mb-2">Dublin Cover Letter Tips</h4>
        <ul className="space-y-1 text-blue-800">
          <li>• This format follows Irish business communication standards</li>
          <li>• Professional tone balances British formality with directness</li>
          <li>• Ensure it prints perfectly on A4 paper (standard in Ireland)</li>
          <li>• Save as PDF to preserve formatting when emailing</li>
        </ul>
      </div>
    </div>
  );
};

export default CoverLetterPreview;