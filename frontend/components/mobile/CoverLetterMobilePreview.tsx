import React, { useState } from 'react';
import { Eye, Download, Edit3, Smartphone, Monitor, Tablet, ZoomIn, ZoomOut } from 'lucide-react';

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

interface CoverLetterMobilePreviewProps {
  data: CoverLetterData;
  onEdit: () => void;
  onDownload: () => void;
  className?: string;
}

const CoverLetterMobilePreview: React.FC<CoverLetterMobilePreviewProps> = ({ 
  data, 
  onEdit, 
  onDownload, 
  className = '' 
}) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showFullPreview, setShowFullPreview] = useState(false);

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
          headerStyle: { borderBottom: '2px solid #3B82F6', paddingBottom: '8px' },
          nameStyle: { color: '#1E40AF', fontSize: '18px', fontWeight: 'bold' },
          accentColor: '#3B82F6'
        };
      case 'academic':
        return {
          fontFamily: 'Times New Roman, serif',
          headerStyle: { borderBottom: '1px solid #6B7280', paddingBottom: '8px' },
          nameStyle: { fontSize: '16px', fontWeight: 'normal' },
          accentColor: '#6B7280'
        };
      default: // classic
        return {
          fontFamily: 'Arial, sans-serif',
          headerStyle: { borderBottom: '1px solid #d1d5db', paddingBottom: '8px' },
          nameStyle: { fontSize: '17px', fontWeight: '600' },
          accentColor: '#374151'
        };
    }
  };

  const theme = data.theme || 'classic';
  const themeStyles = getThemeStyles(theme);

  const getViewportStyles = () => {
    switch (viewMode) {
      case 'mobile':
        return { maxWidth: '375px', fontSize: '14px' };
      case 'tablet':
        return { maxWidth: '768px', fontSize: '15px' };
      case 'desktop':
        return { maxWidth: '1024px', fontSize: '16px' };
      default:
        return { maxWidth: '375px', fontSize: '14px' };
    }
  };

  const viewportStyles = getViewportStyles();

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Mobile Preview Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Eye className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Mobile Preview</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Zoom:</span>
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
              className="p-1 hover:bg-white rounded"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono bg-white px-2 py-1 rounded">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}
              className="p-1 hover:bg-white rounded"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Device Selector */}
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('mobile')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
              viewMode === 'mobile' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Smartphone className="w-4 h-4 mr-1" />
            Mobile
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
              viewMode === 'tablet' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Tablet className="w-4 h-4 mr-1" />
            Tablet
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
              viewMode === 'desktop' 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Monitor className="w-4 h-4 mr-1" />
            Desktop
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="p-4 bg-gray-50">
        <div 
          className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
          style={{ 
            ...viewportStyles,
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'all 0.3s ease'
          }}
        >
          {/* PDF-like Document */}
          <div 
            className="p-6 bg-white"
            style={{ 
              fontFamily: themeStyles.fontFamily,
              fontSize: viewportStyles.fontSize,
              lineHeight: '1.6'
            }}
          >
            {/* Header Section */}
            <div className="mb-4 pb-3" style={themeStyles.headerStyle}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h1 
                    className="font-semibold text-gray-900 mb-2 break-words" 
                    style={themeStyles.nameStyle}
                  >
                    {data.personal_details.full_name}
                  </h1>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="break-all">{data.personal_details.email}</div>
                    <div>{formatPhoneNumber(data.personal_details.phone)}</div>
                    <div>{data.personal_details.location}</div>
                    {data.personal_details.linkedin_url && (
                      <div className="text-blue-600 break-all text-xs">
                        {data.personal_details.linkedin_url}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right text-xs text-gray-600 ml-4">
                  {formatDate(data.generation_date)}
                </div>
              </div>
            </div>

            {/* Recipient Section */}
            <div className="mb-3">
              <div className="text-gray-600 space-y-0 text-xs">
                <div className="font-medium break-words text-gray-900">
                  {data.company_name}
                </div>
                {data.job_title && (
                  <div className="italic">{data.job_title}</div>
                )}
                {data.include_company_address && data.company_address && (
                  <div className="whitespace-pre-line text-xs">
                    {data.company_address}
                  </div>
                )}
              </div>
            </div>

            {/* Salutation */}
            <div className="mb-3 font-medium break-words text-sm">
              {theme === 'academic' 
                ? `Dear ${data.company_name} Selection Committee,` 
                : `Dear ${data.company_name} Hiring Team,`
              }
            </div>

            {/* Letter Body - Truncated for mobile */}
            <div className="text-gray-700 text-sm leading-relaxed">
              {showFullPreview ? (
                <div className="space-y-2">
                  {data.cover_letter_body.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-justify">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-justify">
                    {data.cover_letter_body.split('\n\n')[0]?.trim()}
                  </p>
                  {data.cover_letter_body.split('\n\n').length > 1 && (
                    <div className="text-center py-2">
                      <button
                        onClick={() => setShowFullPreview(true)}
                        className="text-blue-600 text-xs hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full"
                      >
                        Show Full Content ({data.cover_letter_body.split('\n\n').length - 1} more paragraphs)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Closing */}
            <div className="mt-4">
              <div className="mb-2 text-sm">Yours sincerely,</div>
              <div className="font-medium break-words text-sm">
                {data.personal_details.full_name}
              </div>
            </div>
          </div>

          {/* Mobile-Specific Info Bar */}
          <div className="bg-gray-100 px-4 py-2 border-t">
            <div className="flex justify-between items-center text-xs text-gray-600">
              <div className="flex items-center space-x-3">
                <span>📄 A4 Format</span>
                <span>✓ ATS-Ready</span>
              </div>
              <div>
                {data.cover_letter_body.length} chars
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-white border-t">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onEdit}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Content
          </button>
          <button
            onClick={onDownload}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Mobile Tips */}
      <div className="p-4 bg-blue-50 border-t">
        <h4 className="font-medium text-blue-900 mb-2 text-sm">📱 Mobile Viewing Tips</h4>
        <ul className="space-y-1 text-blue-800 text-xs">
          <li>• PDF will look exactly like this on any device</li>
          <li>• Use zoom controls to see details clearly</li>
          <li>• Switch between device views to test readability</li>
          <li>• Download preserves all formatting perfectly</li>
        </ul>
      </div>
    </div>
  );
};

export default CoverLetterMobilePreview; 