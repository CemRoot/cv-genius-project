import React, { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface CVData {
  personal_details: {
    full_name: string;
    email: string;
    phone: string;
    linkedin_url?: string;
    location?: string;
    desired_position?: string;
  };
  professional_summary: string;
  skills: {
    technical?: string[];
    soft?: string[];
    languages?: string[];
  };
  work_experience: Array<{
    job_title: string;
    company: string;
    start_date: string;
    end_date?: string;
    is_current?: boolean;
    location?: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    start_date: string;
    end_date?: string;
    grade?: string;
    location?: string;
  }>;
}

interface CVEditorEnhancedProps {
  cvData: CVData;
  onUpdate?: (data: CVData) => void;
  isEditing?: boolean;
}

export default function CVEditorEnhanced({ cvData: initialData, onUpdate, isEditing = true }: CVEditorEnhancedProps) {
  const [cvData, setCvData] = useState<CVData>(initialData);
  const [history, setHistory] = useState<CVData[]>([initialData]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const cvRef = useRef<HTMLDivElement>(null);

  // Update content handler
  const handleContentChange = (path: string[], value: any) => {
    const newData = { ...cvData };
    let current: any = newData;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    
    setCvData(newData);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    if (onUpdate) {
      onUpdate(newData);
    }
  };

  // Undo/Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCvData(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCvData(history[historyIndex + 1]);
    }
  };

  // Download as PDF
  const handleDownloadPDF = async () => {
    if (!cvRef.current) return;
    
    const canvas = await html2canvas(cvRef.current, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${cvData.personal_details.full_name}_CV.pdf`);
  };

  // Add section handler
  const handleAddSection = (section: string) => {
    const newData = { ...cvData };
    
    switch (section) {
      case 'experience':
        newData.work_experience.push({
          job_title: 'New Position',
          company: 'Company Name',
          start_date: 'MM/YYYY',
          achievements: ['Achievement 1']
        });
        break;
      case 'education':
        newData.education.push({
          degree: 'Degree Name',
          institution: 'Institution Name',
          start_date: 'MM/YYYY'
        });
        break;
    }
    
    setCvData(newData);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    if (onUpdate) {
      onUpdate(newData);
    }
  };

  return (
    <div className="cv-editor-enhanced">
      {/* Toolbar */}
      {isEditing && (
        <div className="editor-toolbar">
          <div className="toolbar-section">
            <button onClick={handleUndo} disabled={historyIndex === 0}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Undo
            </button>
            <button onClick={handleRedo} disabled={historyIndex === history.length - 1}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
              Redo
            </button>
          </div>
          <div className="toolbar-section">
            <button onClick={() => handleAddSection('experience')}>Add Experience</button>
            <button onClick={() => handleAddSection('education')}>Add Education</button>
          </div>
          <div className="toolbar-section">
            <button onClick={handleDownloadPDF} className="download-btn">
              Download PDF
            </button>
          </div>
        </div>
      )}

      {/* CV Content */}
      <div ref={cvRef} className="resume-page-wrapper">
        {/* Header */}
        <div className="header-holder">
          <div className="resume-header">
            <h1 
              className="header-name"
              contentEditable={isEditing}
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange(['personal_details', 'full_name'], e.currentTarget.textContent || '')}
            >
              {cvData.personal_details.full_name}
            </h1>
            {cvData.personal_details.desired_position && (
              <div 
                className="header-title"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange(['personal_details', 'desired_position'], e.currentTarget.textContent || '')}
              >
                {cvData.personal_details.desired_position}
              </div>
            )}
            <div className="contact-info-container">
              <span 
                className="contact-info-item"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange(['personal_details', 'phone'], e.currentTarget.textContent || '')}
              >
                {cvData.personal_details.phone}
              </span>
              <span 
                className="contact-info-item"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange(['personal_details', 'email'], e.currentTarget.textContent || '')}
              >
                {cvData.personal_details.email}
              </span>
              {cvData.personal_details.linkedin_url && (
                <span 
                  className="contact-info-item"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange(['personal_details', 'linkedin_url'], e.currentTarget.textContent || '')}
                >
                  {cvData.personal_details.linkedin_url}
                </span>
              )}
              {cvData.personal_details.location && (
                <span 
                  className="contact-info-item"
                  contentEditable={isEditing}
                  suppressContentEditableWarning
                  onBlur={(e) => handleContentChange(['personal_details', 'location'], e.currentTarget.textContent || '')}
                >
                  {cvData.personal_details.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="resume-content">
          {/* Summary */}
          {cvData.professional_summary && (
            <div className="section">
              <h2 className="section-name">Summary</h2>
              <div 
                className="summary-text"
                contentEditable={isEditing}
                suppressContentEditableWarning
                onBlur={(e) => handleContentChange(['professional_summary'], e.currentTarget.textContent || '')}
              >
                {cvData.professional_summary}
              </div>
            </div>
          )}

          {/* Skills */}
          {cvData.skills && (
            <div className="section">
              <h2 className="section-name">Skills</h2>
              <div className="skills-container">
                {Object.entries(cvData.skills).map(([category, skills]) => skills && skills.length > 0 && (
                  <div key={category} className="skill-row">
                    <div className="skill-category">{category.charAt(0).toUpperCase() + category.slice(1)}:</div>
                    <div className="skill-items">
                      {skills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="skill-tag"
                          contentEditable={isEditing}
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newSkills = [...skills];
                            newSkills[index] = e.currentTarget.textContent || '';
                            handleContentChange(['skills', category], newSkills);
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {cvData.work_experience && cvData.work_experience.length > 0 && (
            <div className="section">
              <h2 className="section-name">Experience</h2>
              {cvData.work_experience.map((exp, index) => (
                <div key={index} className="section-item">
                  <div className="item-header">
                    <div className="item-left">
                      <div 
                        className="item-position"
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newExp = [...cvData.work_experience];
                          newExp[index].job_title = e.currentTarget.textContent || '';
                          handleContentChange(['work_experience'], newExp);
                        }}
                      >
                        {exp.job_title}
                      </div>
                      <div 
                        className="item-company"
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newExp = [...cvData.work_experience];
                          newExp[index].company = e.currentTarget.textContent || '';
                          handleContentChange(['work_experience'], newExp);
                        }}
                      >
                        {exp.company}
                      </div>
                    </div>
                    <div>
                      <div className="item-dates">
                        {exp.start_date} - {exp.is_current ? 'Present' : exp.end_date}
                      </div>
                      {exp.location && <div className="item-location">{exp.location}</div>}
                    </div>
                  </div>
                  {exp.achievements && (
                    <ul className="achievements">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li key={achIndex}>
                          <span className="bullet-dot">•</span>
                          <span
                            contentEditable={isEditing}
                            suppressContentEditableWarning
                            onBlur={(e) => {
                              const newExp = [...cvData.work_experience];
                              newExp[index].achievements[achIndex] = e.currentTarget.textContent || '';
                              handleContentChange(['work_experience'], newExp);
                            }}
                          >
                            {achievement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {cvData.education && cvData.education.length > 0 && (
            <div className="section">
              <h2 className="section-name">Education</h2>
              {cvData.education.map((edu, index) => (
                <div key={index} className="section-item">
                  <div className="item-header">
                    <div className="item-left">
                      <div 
                        className="item-position"
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newEdu = [...cvData.education];
                          newEdu[index].degree = e.currentTarget.textContent || '';
                          handleContentChange(['education'], newEdu);
                        }}
                      >
                        {edu.degree}
                      </div>
                      <div 
                        className="item-company"
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const newEdu = [...cvData.education];
                          newEdu[index].institution = e.currentTarget.textContent || '';
                          handleContentChange(['education'], newEdu);
                        }}
                      >
                        {edu.institution}
                      </div>
                      {edu.grade && <div className="item-location">{edu.grade}</div>}
                    </div>
                    <div>
                      <div className="item-dates">
                        {edu.start_date}{edu.end_date && ` - ${edu.end_date}`}
                      </div>
                      {edu.location && <div className="item-location">{edu.location}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .cv-editor-enhanced {
          max-width: 1200px;
          margin: 0 auto;
        }

        .editor-toolbar {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 16px 20px;
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .toolbar-section {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .editor-toolbar button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: white;
          border: 1px solid #cbd5e0;
          border-radius: 6px;
          font-size: 14px;
          color: #2d3748;
          cursor: pointer;
          transition: all 0.2s;
        }

        .editor-toolbar button:hover:not(:disabled) {
          background: #edf2f7;
          border-color: #a0aec0;
        }

        .editor-toolbar button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .download-btn {
          background: #3182ce !important;
          color: white !important;
          border-color: #3182ce !important;
        }

        .download-btn:hover {
          background: #2c5282 !important;
        }

        /* Resume Styles */
        .resume-page-wrapper {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          font-family: 'Open Sans', Arial, sans-serif;
          color: #000;
          font-size: 15px;
        }

        @media screen and (max-width: 800px) {
          .resume-page-wrapper {
            width: 100%;
            box-shadow: none;
          }
        }

        .header-holder {
          padding: 20px 20px 10px;
          margin-bottom: 4px;
        }

        .resume-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .header-name {
          font-family: 'Oswald', Arial, sans-serif;
          font-size: 28px;
          line-height: 1.5;
          font-weight: 700;
          text-transform: uppercase;
          color: #000;
          margin-bottom: 4px;
          outline: none;
          transition: background-color 0.2s;
        }

        .header-name:hover[contenteditable="true"] {
          background-color: #f0f4f8;
        }

        .header-title {
          font-size: 20px;
          line-height: 1.35;
          color: #6f7878;
          font-weight: 400;
          margin-bottom: 8px;
          outline: none;
        }

        .contact-info-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          line-height: 1.35;
          color: #333;
        }

        .contact-info-item {
          position: relative;
          padding: 0 10px;
          outline: none;
          transition: background-color 0.2s;
        }

        .contact-info-item:hover[contenteditable="true"] {
          background-color: #f0f4f8;
        }

        .contact-info-item:not(:last-child)::after {
          content: '|';
          position: absolute;
          right: -5px;
          color: #ccc;
        }

        .resume-content {
          padding: 0 20px 20px;
        }

        .section {
          margin-bottom: 20px;
        }

        .section-name {
          font-family: 'Oswald', Arial, sans-serif;
          font-size: 20px;
          line-height: 1.5;
          color: #000;
          border-bottom: 1px solid #000;
          padding-bottom: 4px;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .summary-text {
          font-size: 15px;
          line-height: 1.5;
          text-align: justify;
          color: #333;
          outline: none;
          transition: background-color 0.2s;
          padding: 2px 4px;
          margin: -2px -4px;
        }

        .summary-text:hover[contenteditable="true"] {
          background-color: #f0f4f8;
        }

        .section-item {
          margin-bottom: 16px;
          padding: 0;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }

        .item-left {
          flex: 1;
        }

        .item-position {
          font-size: 16px;
          line-height: 1.4;
          font-weight: 600;
          color: #000;
          margin-bottom: 2px;
          outline: none;
          transition: background-color 0.2s;
          padding: 1px 4px;
          margin: -1px -4px;
        }

        .item-position:hover[contenteditable="true"] {
          background-color: #f0f4f8;
        }

        .item-company {
          font-size: 16px;
          line-height: 1.4;
          color: #6f7878;
          font-weight: 400;
          outline: none;
          transition: background-color 0.2s;
          padding: 1px 4px;
          margin: -1px -4px;
        }

        .item-company:hover[contenteditable="true"] {
          background-color: #f0f4f8;
        }

        .item-dates {
          font-size: 16px;
          line-height: 1.4;
          color: #333;
          text-align: right;
          white-space: nowrap;
        }

        .item-location {
          font-size: 16px;
          line-height: 1.4;
          color: #6f7878;
          text-align: right;
        }

        .achievements {
          list-style: none;
          margin-top: 6px;
          padding-left: 0;
        }

        .achievements li {
          display: flex;
          align-items: flex-start;
          margin-bottom: 4px;
          font-size: 15px;
          line-height: 1.5;
        }

        .bullet-dot {
          margin-right: 8px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .achievements span:last-child {
          outline: none;
          flex: 1;
          transition: background-color 0.2s;
          padding: 1px 4px;
          margin: -1px -4px;
        }

        .achievements span:last-child:hover[contenteditable="true"] {
          background-color: #f0f4f8;
        }

        .skills-container {
          margin-top: 10px;
        }

        .skill-row {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
        }

        .skill-category {
          font-size: 15px;
          font-weight: 400;
          color: #000;
          min-width: 180px;
          margin-right: 20px;
        }

        .skill-items {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .skill-tag {
          font-size: 15px;
          line-height: 1.3;
          color: #333;
          padding: 2px 8px;
          white-space: nowrap;
          outline: none;
          transition: background-color 0.2s;
        }

        .skill-tag:hover[contenteditable="true"] {
          background-color: #f0f4f8;
        }

        .skill-tag:not(:last-child)::after {
          content: ',';
        }

        @media print {
          .editor-toolbar {
            display: none;
          }
          
          .resume-page-wrapper {
            width: 100%;
            margin: 0;
            box-shadow: none;
          }
          
          [contenteditable] {
            background: none !important;
          }
        }
      `}</style>
    </div>
  );
}