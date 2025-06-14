import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, Smartphone, FileText, Palette, CheckCircle } from 'lucide-react';

interface StyleExample {
  id: string;
  name: string;
  description: string;
  preview: {
    headerStyle: string;
    nameColor: string;
    fontFamily: string;
    borderStyle: string;
  };
  features: string[];
  bestFor: string;
}

const styleExamples: StyleExample[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional business format, perfect for conservative industries',
    preview: {
      headerStyle: 'border-b border-gray-300',
      nameColor: 'text-gray-900',
      fontFamily: 'font-serif',
      borderStyle: 'border-gray-300'
    },
    features: ['Times New Roman font', 'Traditional layout', 'Conservative styling'],
    bestFor: 'Banking, Law, Government'
  },
  {
    id: 'modern',
    name: 'Modern Business',
    description: 'Clean, contemporary design with subtle color accents',
    preview: {
      headerStyle: 'border-b-2 border-blue-500',
      nameColor: 'text-blue-700',
      fontFamily: 'font-sans',
      borderStyle: 'border-blue-500'
    },
    features: ['Arial font', 'Blue accents', 'Subject line included'],
    bestFor: 'Tech, Startups, Creative'
  },
  {
    id: 'academic',
    name: 'Academic Formal',
    description: 'Scholarly format ideal for research and education roles',
    preview: {
      headerStyle: 'border-b border-gray-400',
      nameColor: 'text-gray-800',
      fontFamily: 'font-serif',
      borderStyle: 'border-gray-400'
    },
    features: ['Formal tone', 'Selection Committee address', 'Research-focused'],
    bestFor: 'Universities, Research, Education'
  }
];

const CoverLetterStyleShowcase: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string>('modern');
  const [showMobileView, setShowMobileView] = useState(false);

  const selectedExample = styleExamples.find(style => style.id === selectedStyle) || styleExamples[1];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Palette className="w-8 h-8 text-purple-600 mr-3" />
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
            Cover Letter Styles
          </h3>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          See exactly how your cover letter will look on any device. 
          Choose from professional styles optimized for Irish employers.
        </p>
      </div>

      {/* Style Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {styleExamples.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedStyle === style.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                style.id === 'classic' ? 'bg-gray-600' :
                style.id === 'modern' ? 'bg-blue-600' : 'bg-gray-500'
              }`} />
              <h4 className="font-semibold text-gray-900">{style.name}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">{style.description}</p>
            <div className="text-xs text-purple-600 font-medium">
              Best for: {style.bestFor}
            </div>
          </button>
        ))}
      </div>

      {/* Mobile/Desktop Toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setShowMobileView(false)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !showMobileView
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Desktop View
          </button>
          <button
            onClick={() => setShowMobileView(true)}
            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              showMobileView
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile View
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Eye className="w-5 h-5 text-gray-600 mr-2" />
            <span className="font-medium text-gray-900">
              {selectedExample.name} Preview
            </span>
          </div>
          <div className="text-sm text-gray-600">
            {showMobileView ? '📱 Mobile' : '💻 Desktop'} View
          </div>
        </div>

        {/* Preview Document */}
        <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${
          showMobileView ? 'max-w-sm' : 'max-w-2xl'
        }`}>
          <div className={`p-6 ${selectedExample.preview.fontFamily}`}>
            {/* Header */}
            <div className={`mb-4 pb-3 ${selectedExample.preview.headerStyle}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h1 className={`text-lg font-semibold mb-2 ${selectedExample.preview.nameColor}`}>
                    John Smith
                  </h1>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>john.smith@email.com</div>
                    <div>+353 87 123 4567</div>
                    <div>Dublin, Ireland</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-IE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="mb-4">
              <div className="text-sm text-gray-700">
                <div className="font-medium">TechCorp Ireland</div>
                <div className="italic">Software Developer Position</div>
              </div>
            </div>

            {/* Salutation */}
            <div className="mb-4 font-medium text-sm">
              {selectedStyle === 'academic' 
                ? 'Dear TechCorp Ireland Selection Committee,' 
                : 'Dear TechCorp Ireland Hiring Team,'
              }
            </div>

            {/* Sample Content */}
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              <p>
                I am writing to express my keen interest in the Software Developer position 
                at TechCorp Ireland. With my background in full-stack development and 
                passion for innovative technology solutions...
              </p>
              
              {!showMobileView && (
                <>
                  <p>
                    During my previous role at Dublin Tech Solutions, I successfully led 
                    the development of three major client applications, resulting in a 
                    40% increase in user engagement...
                  </p>
                  <p>
                    I am particularly excited about TechCorp&apos;s commitment to sustainable 
                    technology and would welcome the opportunity to contribute to your 
                    innovative projects.
                  </p>
                </>
              )}
              
              {showMobileView && (
                <div className="text-center py-2">
                  <span className="text-blue-600 text-xs bg-blue-50 px-3 py-1 rounded-full">
                    + 2 more paragraphs
                  </span>
                </div>
              )}
            </div>

            {/* Closing */}
            <div className="mt-4">
              <div className="mb-2 text-sm">Yours sincerely,</div>
              <div className="font-medium text-sm">John Smith</div>
            </div>
          </div>

          {/* Info Bar */}
          <div className="bg-gray-100 px-4 py-2 border-t">
            <div className="flex justify-between items-center text-xs text-gray-600">
              <div className="flex items-center space-x-3">
                <span>📄 A4 Format</span>
                <span>✓ ATS-Ready</span>
                <span>🇮🇪 Dublin Standard</span>
              </div>
              <div>Perfect on any device</div>
            </div>
          </div>
        </div>

        {/* Style Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Style Features</h4>
            <ul className="space-y-2">
              {selectedExample.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Mobile Benefits</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Perfect readability on phones
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Maintains formatting when shared
              </li>
              <li className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                Professional appearance on all devices
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">
          Ready to create your professional cover letter?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/create-new-cv"
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <FileText className="w-5 h-5 mr-2" />
            Create New CV + Cover Letter
          </Link>
          <Link
            href="/update-cv"
            className="inline-flex items-center px-6 py-3 bg-white border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium"
          >
            <Smartphone className="w-5 h-5 mr-2" />
            Upload & Optimize Existing CV
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterStyleShowcase; 