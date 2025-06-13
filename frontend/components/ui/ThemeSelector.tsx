import React from 'react';
import { Check } from 'lucide-react';
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
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'modern' as CoverLetterTheme,
    name: 'Modern Business',
    description: 'Contemporary style with clear structure',
    preview: 'Re: Market Research Assistant\n\nFollowing on from our conversation yesterday...',
    features: ['Clear subject line', 'Direct approach', 'Professional yet approachable'],
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'academic' as CoverLetterTheme,
    name: 'Academic Formal',
    description: 'Scholarly format for academic positions',
    preview: 'Dear Dr Murphy,\n\nI am writing with reference to your recent advertisement...',
    features: ['Academic tone', 'Detailed qualifications', 'Research-focused'],
    color: 'from-purple-500 to-violet-600'
  }
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onThemeChange,
  error
}) => {
  return (
    <div className="space-y-4">
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
              'relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-lg',
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

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="text-xs text-gray-700 font-mono leading-relaxed">
                {theme.preview}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-1">
              {theme.features.map((feature, index) => (
                <div key={index} className="flex items-center text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
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