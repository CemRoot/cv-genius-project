import React, { useState, useRef, useEffect } from 'react';
import { Check, Eye, X } from 'lucide-react';
import clsx from 'clsx';

export type CoverLetterTheme = 'classic' | 'modern' | 'academic';

interface ThemeSelectorProps {
  selectedTheme: CoverLetterTheme;
  onThemeChange: (theme: CoverLetterTheme) => void;
  error?: string;
}

const themes = [
  {
    id: 'classic' as CoverLetterTheme,
    name: 'Classic Professional',
    description: 'Traditional business format with formal tone',
    preview: 'Dear Ms. Noonan,\n\nI am writing in response to your advertisement for a trainee accountant...',
    features: ['Formal business tone', 'Traditional layout', 'Conservative approach'],
    color: 'from-blue-500 to-indigo-600',
    mockup: {
      header: 'ANNE McMANUS',
      contact: '123 Paul Street, Cork\nTel:021 503020\nMay 20__',
      recipient: 'Ms. Josephine Noonan,\nNoonan and Murphy Accountants,\n23 North Mall,\nCork.',
      salutation: 'Dear Ms. Noonan,',
      body: 'I am writing in response to your advertisement for a trainee accountant, which is currently advertised on the Careers Service website at University College Cork, where I am a final year Economics student.\n\nDuring my studies at University College Cork, I have opted for modules relating to accounting and business economics, and have achieved excellent results...',
      closing: 'Yours sincerely,\n\nANNE McMANUS'
    }
  },
  {
    id: 'modern' as CoverLetterTheme,
    name: 'Modern Business',
    description: 'Contemporary style with clear structure',
    preview: 'Re: Market Research Assistant\n\nFollowing on from our conversation yesterday...',
    features: ['Clear subject line', 'Direct approach', 'Professional yet approachable'],
    color: 'from-emerald-500 to-teal-600',
    mockup: {
      header: 'Joe Bloggs',
      contact: '123, High Street\nCork\n\nDaytime Tel: 01 4567 890\nEvening Tel: 089 123 456\nEmail: joebloggs@timbucktoo.ie',
      date: '10 June, 200_',
      recipient: 'Mr Jon Jones,\nHR Executive,\nABC123 Corporation,\n123 Kings Avenue,\nBirmingham,\nB12 5QP.',
      subject: 'Re: Market Research Assistant (as advertised on Careers Service Website UCC April 200_)',
      salutation: 'Dear Mr Jones,',
      body: 'Following on from our conversation yesterday, I would like to apply for the market research position you advertised in April on the Careers Service Website of University College Cork. I believe that my background in undergraduate research, my training in psychology and sociology and my work experience equip me to make a valuable contribution to ABC123 Corporation...',
      closing: 'Yours sincerely\n\nJoe Bloggs'
    }
  },
  {
    id: 'academic' as CoverLetterTheme,
    name: 'Academic Formal',
    description: 'Scholarly format for academic positions',
    preview: 'Dear Dr Murphy,\n\nI am writing with reference to your recent advertisement...',
    features: ['Academic tone', 'Detailed qualifications', 'Research-focused'],
    color: 'from-purple-500 to-violet-600',
    mockup: {
      header: 'Jane Terry',
      contact: '4 The Drive\nCollege Road\nCork',
      date: '01 July 200_',
      salutation: 'Dear Dr Murphy,',
      body: 'I am writing with reference to your recent advertisement in the Irish Examiner for a Network Engineer (Ref. ABC123).\n\nI have recently completed my BSc degree in Computer Science with an Upper Second Class Honours from University College Cork.\n\nAs you can see from my Curriculum Vitae, I can offer a considerable amount of relevant experience, including:\n\n• A degree which has included several courses related to network design and topologies, network administration and TCP/IP.\n• Network management based BSc project: Managing security within a complex business environment\n• Experience in applying network design techniques to reduce network administration.\n• Familiarity with network management procedures and equipment in common use.',
      closing: 'Yours sincerely,\n\n________________\nJane Terry'
    }
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange,
  error
}) => {
  const [hoveredTheme, setHoveredTheme] = useState<CoverLetterTheme | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);



  const handlePreviewClick = (themeId: CoverLetterTheme) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setHoveredTheme(themeId);
    setShowPreview(true);
    setIsModalOpen(true);
  };

  const closePreview = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setHoveredTheme(null);
    setShowPreview(false);
    setIsModalOpen(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const previewTheme = hoveredTheme ? themes.find(t => t.id === hoveredTheme) : null;

  return (
    <div className="space-y-4 relative" ref={containerRef}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Choose Cover Letter Style
        </h3>
        <span className="text-sm text-gray-500">Select one</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={clsx(
              'relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-lg hover:scale-105',
              selectedTheme === theme.id
                ? 'border-emerald-500 bg-emerald-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300'
            )}
            onClick={() => onThemeChange(theme.id)}
          >
            {/* Selection indicator */}
            <div className={clsx(
              'absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
              selectedTheme === theme.id
                ? 'border-emerald-500 bg-emerald-500'
                : 'border-gray-300'
            )}>
              {selectedTheme === theme.id && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>



            {/* Theme header */}
            <div className="mb-3">
              <div className={clsx(
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white mb-2',
                `bg-gradient-to-r ${theme.color}`
              )}>
                {theme.name}
              </div>
              <p className="text-sm text-gray-600">{theme.description}</p>
            </div>

            {/* Mini preview */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="text-xs text-gray-700 font-mono leading-relaxed line-clamp-3">
                {theme.preview}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-1 mb-3">
              {theme.features.map((feature, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Preview button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePreviewClick(theme.id);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-gray-200 hover:border-blue-300"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Style
            </button>
          </div>
        ))}
      </div>

      {/* Large Preview Modal */}
      {showPreview && previewTheme && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{previewTheme.name}</h3>
                  <p className="text-gray-600">{previewTheme.description}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={clsx(
                    'px-4 py-2 rounded-full text-sm font-medium text-white',
                    `bg-gradient-to-r ${previewTheme.color}`
                  )}>
                    Preview
                  </div>
                  <button
                    onClick={closePreview}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label="Close preview"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mock Cover Letter Preview */}
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm max-w-2xl mx-auto">
                {/* Header styling based on theme */}
                <div className={clsx(
                  'mb-6',
                  previewTheme.id === 'classic' && 'text-right',
                  previewTheme.id === 'modern' && 'border-b-2 border-blue-500 pb-4',
                  previewTheme.id === 'academic' && 'text-right border-b border-black pb-2'
                )}>
                  <div className={clsx(
                    'font-bold mb-2',
                    previewTheme.id === 'classic' && 'text-lg',
                    previewTheme.id === 'modern' && 'text-xl text-blue-600',
                    previewTheme.id === 'academic' && 'text-lg italic'
                  )}>
                    {previewTheme.mockup.header}
                  </div>
                  <div className="text-sm text-gray-600 whitespace-pre-line">
                    {previewTheme.mockup.contact}
                  </div>
                </div>

                {/* Date */}
                {previewTheme.mockup.date && (
                  <div className={clsx(
                    'mb-4 text-sm',
                    previewTheme.id === 'academic' ? 'text-left' : 'text-right'
                  )}>
                    {previewTheme.mockup.date}
                  </div>
                )}

                {/* Recipient */}
                {previewTheme.mockup.recipient && (
                  <div className="mb-4 text-sm whitespace-pre-line">
                    {previewTheme.mockup.recipient}
                  </div>
                )}

                {/* Subject line for modern */}
                {previewTheme.mockup.subject && (
                  <div className="mb-4 font-bold text-blue-600 underline">
                    {previewTheme.mockup.subject}
                  </div>
                )}

                {/* Salutation */}
                <div className="mb-4 font-medium">
                  {previewTheme.mockup.salutation}
                </div>

                {/* Body */}
                <div className="mb-6 text-sm leading-relaxed whitespace-pre-line text-justify">
                  {previewTheme.mockup.body}
                </div>

                {/* Closing */}
                <div className="whitespace-pre-line">
                  {previewTheme.mockup.closing}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-4 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Hover over themes to preview • Click to select
                </div>
                <button
                  onClick={() => onThemeChange(previewTheme.id)}
                  className={clsx(
                    'px-6 py-2 rounded-lg font-medium text-white transition-all',
                    `bg-gradient-to-r ${previewTheme.color} hover:shadow-lg`
                  )}
                >
                  Select This Style
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default ThemeSelector; 