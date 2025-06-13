import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export interface CoverLetterData {
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
}

interface CoverLetterEditorProps {
  initialData: CoverLetterData;
  onSave: (data: CoverLetterData) => void;
  onCancel: () => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export const CoverLetterEditor: React.FC<CoverLetterEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  onRegenerate,
  isRegenerating = false,
}) => {
  const [editableData, setEditableData] = useState<CoverLetterData>({
    ...initialData,
    include_company_address: false,
    company_address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showEditPrompt, setShowEditPrompt] = useState(false);
  const [realTimePreview, setRealTimePreview] = useState(true);

  useEffect(() => {
    setEditableData(initialData);
  }, [initialData]);

  const handleInputChange = (field: keyof CoverLetterData, value: string) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePersonalDetailChange = (field: keyof CoverLetterData['personal_details'], value: string) => {
    setEditableData(prev => ({
      ...prev,
      personal_details: {
        ...prev.personal_details,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(editableData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (isEditing) {
      setEditableData(initialData);
      setIsEditing(false);
    } else {
      onCancel();
    }
  };

  const handlePreviewClick = () => {
    if (!isEditing) {
      setShowEditPrompt(true);
      setTimeout(() => setShowEditPrompt(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cover Letter Preview & Editor</h2>
          <p className="text-sm text-gray-600 mt-1">🇮🇪 Optimized for Dublin/Ireland job market standards</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2"
          >
            {isRegenerating ? <LoadingSpinner size="sm" /> : null}
            Regenerate with AI
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className={`${isEditing ? 'bg-blue-50 border-blue-300' : ''} ${showEditPrompt ? 'animate-pulse bg-yellow-50 border-yellow-300' : ''}`}
          >
            {isEditing ? 'Preview Mode' : 'Edit Mode'}
          </Button>
          {isEditing && (
            <Button
              variant="outline"
              onClick={() => setRealTimePreview(!realTimePreview)}
              className={`${realTimePreview ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50'}`}
            >
              🔄 Real-time Preview
            </Button>
          )}
        </div>
      </div>

      {/* Dublin Standards Notice */}
      <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-emerald-800">Dublin Cover Letter Standards</h3>
            <div className="mt-2 text-sm text-emerald-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Maximum 1 page (A4 format)</li>
                <li>Professional tone balancing British formality with American directness</li>
                <li>Include specific company research and Dublin business context</li>
                <li>Use quantifiable achievements with Irish phone format (+353)</li>
                <li>Avoid clichés like "team player" - focus on concrete examples</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {isEditing ? 'Edit Cover Letter' : 'Cover Letter Details'}
          </h3>
          
          {/* Personal Details */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700">Personal Details</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableData.personal_details.full_name}
                    onChange={(e) => handlePersonalDetailChange('full_name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="p-2 bg-white rounded border cursor-pointer hover:bg-gray-50" onClick={handlePreviewClick}>{editableData.personal_details.full_name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editableData.personal_details.email}
                    onChange={(e) => handlePersonalDetailChange('email', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="p-2 bg-white rounded border break-words overflow-hidden">{editableData.personal_details.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone 
                  <span className="text-xs text-blue-600 ml-1">(Dublin format: +353 87 123 4567)</span>
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      value={editableData.personal_details.phone}
                      onChange={(e) => handlePersonalDetailChange('phone', e.target.value)}
                      placeholder="+353 87 123 4567"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {editableData.personal_details.phone && !editableData.personal_details.phone.startsWith('+353') && (
                      <p className="text-xs text-amber-600 mt-1">💡 Dublin tip: Use Irish format (+353) for better local appeal</p>
                    )}
                  </div>
                ) : (
                  <p className="p-2 bg-white rounded border">{editableData.personal_details.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Location 
                  <span className="text-xs text-blue-600 ml-1">(e.g., Dublin 2, Ireland)</span>
                </label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={editableData.personal_details.location}
                      onChange={(e) => handlePersonalDetailChange('location', e.target.value)}
                      placeholder="Dublin 2, Ireland"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {editableData.personal_details.location && !editableData.personal_details.location.toLowerCase().includes('dublin') && (
                      <p className="text-xs text-amber-600 mt-1">💡 Dublin employers prefer Dublin addresses or mention "relocating to Dublin"</p>
                    )}
                  </div>
                ) : (
                  <p className="p-2 bg-white rounded border">{editableData.personal_details.location}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">LinkedIn URL</label>
              {isEditing ? (
                <input
                  type="url"
                  value={editableData.personal_details.linkedin_url || ''}
                  onChange={(e) => handlePersonalDetailChange('linkedin_url', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="p-2 bg-white rounded border">{editableData.personal_details.linkedin_url || 'Not provided'}</p>
              )}
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700">Company & Position</h4>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="p-2 bg-white rounded border">{editableData.company_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Job Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editableData.job_title}
                  onChange={(e) => handleInputChange('job_title', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="p-2 bg-white rounded border">{editableData.job_title}</p>
              )}
            </div>
            
            {/* Company Address Toggle */}
            <div className="mt-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={editableData.include_company_address || false}
                  onChange={(e) => {
                    setEditableData(prev => ({
                      ...prev,
                      include_company_address: e.target.checked,
                      company_address: e.target.checked ? prev.company_address : ''
                    }));
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  disabled={!isEditing}
                />
                <span className="text-sm font-medium text-gray-600">Include Company Address</span>
              </label>
            </div>
            
            {/* Company Address Input */}
            {editableData.include_company_address && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-600 mb-1">Company Address</label>
                {isEditing ? (
                  <textarea
                    value={editableData.company_address || ''}
                    onChange={(e) => handleInputChange('company_address', e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter company address...\ne.g., 123 Business Street\nDublin 2, Ireland"
                  />
                ) : (
                  <p className="p-2 bg-white rounded border min-h-[80px] whitespace-pre-wrap">
                    {editableData.company_address || 'Not provided'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Cover Letter Body */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-600">Cover Letter Content</label>
              <span className="text-xs text-gray-500">
                {editableData.cover_letter_body?.length || 0} characters
              </span>
            </div>
            
            {isEditing && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <h4 className="font-medium text-blue-800 mb-2">🇮🇪 Dublin Writing Tips</h4>
                <div className="grid md:grid-cols-2 gap-2 text-blue-700 text-xs">
                  <div>✅ Start with specific position & company research</div>
                  <div>✅ Include quantifiable achievements</div>
                  <div>✅ Mention Dublin business context</div>
                  <div>✅ Balance humility with confidence</div>
                  <div>❌ Avoid "To Whom It May Concern"</div>
                  <div>❌ No salary expectations unless asked</div>
                </div>
              </div>
            )}
            
            {isEditing ? (
              <div>
                <textarea
                  value={editableData.cover_letter_body}
                  onChange={(e) => handleInputChange('cover_letter_body', e.target.value)}
                  rows={12}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-sans text-sm leading-relaxed"
                  placeholder="Enter your cover letter content here..."
                />
                <div className="mt-2 flex justify-between text-xs text-gray-500">
                  <span>
                    {editableData.cover_letter_body?.length > 2000 && (
                      <span className="text-amber-600">⚠️ Consider shortening for Dublin standard (aim for ~1500 chars)</span>
                    )}
                  </span>
                  <span>Target: 1500-2000 characters for Dublin employers</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded border min-h-[300px] cursor-pointer hover:bg-gray-100" onClick={handlePreviewClick}>
                <div className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {editableData.cover_letter_body}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              {isEditing ? 'Cancel Changes' : 'Back'}
            </Button>
            {isEditing && (
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Save Changes
              </Button>
            )}
            {!isEditing && (
              <Button onClick={() => onSave(editableData)} className="bg-blue-600 hover:bg-blue-700">
                Generate PDF
              </Button>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
            {isEditing && realTimePreview && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Real-time updates
              </div>
            )}
          </div>
          
          <div className={`bg-white border border-gray-300 rounded-lg p-6 shadow-sm min-h-[600px] font-serif text-sm leading-relaxed transition-all duration-200 ${isEditing && realTimePreview ? 'border-green-300 shadow-green-100' : ''}`}>
            {/* Header */}
            <div className="mb-8">
              <div className="text-lg font-bold text-gray-900 mb-2">
                {(isEditing && realTimePreview) ? editableData.personal_details.full_name : initialData.personal_details.full_name}
              </div>
              <div className="text-gray-600 text-sm space-y-1">
                <div className="break-words overflow-hidden">{(isEditing && realTimePreview) ? editableData.personal_details.email : initialData.personal_details.email}</div>
                <div>{(isEditing && realTimePreview) ? editableData.personal_details.phone : initialData.personal_details.phone}</div>
                <div>{(isEditing && realTimePreview) ? editableData.personal_details.location : initialData.personal_details.location}</div>
                {((isEditing && realTimePreview) ? editableData.personal_details.linkedin_url : initialData.personal_details.linkedin_url) && (
                  <div className="break-words overflow-hidden">{(isEditing && realTimePreview) ? editableData.personal_details.linkedin_url : initialData.personal_details.linkedin_url}</div>
                )}
              </div>
              
              <div className="text-right text-gray-600 text-sm mt-4">
                {(isEditing && realTimePreview) ? editableData.generation_date : initialData.generation_date}
              </div>
            </div>

            {/* Recipient */}
            <div className="mb-6 text-gray-700 text-sm">
              <div>Hiring Manager</div>
              <div>{(isEditing && realTimePreview) ? editableData.company_name : initialData.company_name}</div>
              {((isEditing && realTimePreview) ? editableData.include_company_address && editableData.company_address : initialData.include_company_address && initialData.company_address) && (
                <div className="whitespace-pre-wrap">{(isEditing && realTimePreview) ? editableData.company_address : initialData.company_address}</div>
              )}
            </div>

            {/* Salutation */}
            <div className="mb-4 text-gray-900">
              {((isEditing && realTimePreview) ? editableData.company_name : initialData.company_name) && ((isEditing && realTimePreview) ? editableData.company_name : initialData.company_name) !== "[Company Name]" 
                ? `Dear ${(isEditing && realTimePreview) ? editableData.company_name : initialData.company_name} Hiring Team,`
                : "Dear Hiring Manager,"
              }
            </div>

            {/* Body */}
            <div className="mb-6 text-gray-900 text-justify">
              <div className="whitespace-pre-wrap">
                {(isEditing && realTimePreview) ? editableData.cover_letter_body : initialData.cover_letter_body}
              </div>
            </div>

            {/* Closing */}
            <div className="space-y-4">
              <div>Sincerely,</div>
              <div className="font-semibold">{(isEditing && realTimePreview) ? editableData.personal_details.full_name : initialData.personal_details.full_name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterEditor;