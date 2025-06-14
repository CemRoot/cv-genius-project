import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Sparkles, ArrowLeft, ExternalLink, FileText, Users, CheckCircle, Globe } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const DublinFAQPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqData: FAQItem[] = [
    {
      id: 'dublin-cv-format',
      question: 'How Should I Format My CV for Dublin/Ireland Job Market?',
      answer: `
        <div class="space-y-6">
          <div class="bg-emerald-50 rounded-lg p-4">
            <h4 class="font-bold text-emerald-800 mb-2">🇮🇪 Irish CV Basics</h4>
            <p class="text-emerald-700">Irish CV standards differ significantly from other countries. Here's what Dublin employers expect:</p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-red-50 rounded-lg p-4">
              <h4 class="font-bold text-red-800 mb-2">❌ Don't Include</h4>
              <ul class="text-red-700 text-sm space-y-1">
                <li>• Photos or headshots</li>
                <li>• Age or date of birth</li>
                <li>• Marital status</li>
                <li>• Nationality details</li>
              </ul>
            </div>
            
            <div class="bg-blue-50 rounded-lg p-4">
              <h4 class="font-bold text-blue-800 mb-2">📏 Length Rules</h4>
              <ul class="text-blue-700 text-sm space-y-1">
                <li>• Maximum 2 pages</li>
                <li>• 1 page for graduates</li>
                <li>• Concise and focused</li>
                <li>• Quality over quantity</li>
              </ul>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4">
              <h4 class="font-bold text-green-800 mb-2">✅ Must Include</h4>
              <ul class="text-green-700 text-sm space-y-1">
                <li>• Irish phone (+353)</li>
                <li>• Dublin address</li>
                <li>• LinkedIn profile</li>
                <li>• Professional email</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-purple-50 rounded-lg p-4">
            <h4 class="font-bold text-purple-800 mb-3">📋 Perfect CV Structure (Top to Bottom)</h4>
            <div class="space-y-2 text-purple-700">
              <div class="flex items-center"><span class="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">1</span><strong>Personal Information</strong> - Name, location, contact details</div>
              <div class="flex items-center"><span class="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">2</span><strong>Professional Summary</strong> - 3-4 lines of career highlights</div>
              <div class="flex items-center"><span class="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">3</span><strong>Work Experience</strong> - Reverse chronological with achievements</div>
              <div class="flex items-center"><span class="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">4</span><strong>Education</strong> - Degrees, institutions, dates</div>
              <div class="flex items-center"><span class="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">5</span><strong>Skills</strong> - Technical and soft skills</div>
              <div class="flex items-center"><span class="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">6</span><strong>References</strong> - "Available upon request"</div>
            </div>
          </div>
          
          <div class="bg-orange-50 rounded-lg p-4">
            <h4 class="font-bold text-orange-800 mb-3">🎯 Dublin-Specific Tips</h4>
            <div class="grid md:grid-cols-2 gap-3 text-orange-700 text-sm">
              <div>✅ Mention EU work authorization</div>
              <div>✅ Use Irish English spelling (organise, colour)</div>
              <div>✅ Highlight Irish qualifications (TCD, UCD)</div>
              <div>✅ Show European market experience</div>
            </div>
          </div>
        </div>
      `
    },
    {
      id: 'cover-letter-dublin',
      question: 'How Should I Write a Cover Letter for Dublin Job Applications?',
      answer: `
        <div class="space-y-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-2">🇮🇪 Dublin Cover Letter Essentials</h4>
            <p class="text-blue-700">Cover letters are CRITICAL in Dublin job applications. 89% of Dublin hiring managers read cover letters first to decide if they'll review your CV. It's your chance to show cultural fit and genuine interest.</p>
          </div>
          
          <div class="bg-emerald-50 rounded-lg p-4">
            <h4 class="font-bold text-emerald-800 mb-3">📋 Perfect Structure for Dublin</h4>
            <div class="space-y-2 text-emerald-700">
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span><div><strong>Header (Your Details):</strong> Name, Dublin address, +353 phone, email, LinkedIn</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span><div><strong>Date & Company Address:</strong> Current date, hiring manager name if known</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span><div><strong>Salutation:</strong> "Dear Ms. O'Connor" or "Dear Hiring Manager" (NEVER "To Whom It May Concern")</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">4</span><div><strong>Opening Paragraph:</strong> Position, where you saw it, genuine company interest</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">5</span><div><strong>Body (1-2 paragraphs):</strong> Relevant experience with quantifiable achievements</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">6</span><div><strong>Closing:</strong> Interest reiteration, interview request, appreciation</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">7</span><div><strong>Sign-off:</strong> "Yours sincerely" (name known) or "Yours faithfully" (unknown)</div></div>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-red-50 rounded-lg p-4">
              <h4 class="font-bold text-red-800 mb-2">❌ Dublin Cover Letter Mistakes</h4>
              <ul class="text-red-700 text-sm space-y-1">
                <li>• Using same letter for every application</li>
                <li>• Mentioning salary expectations (unless asked)</li>
                <li>• Being too American-direct or British-formal</li>
                <li>• Using clichés: "team player", "hardworking"</li>
                <li>• Exceeding one page (A4 format)</li>
                <li>• Not researching company's Dublin operations</li>
                <li>• Missing job description keywords</li>
              </ul>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4">
              <h4 class="font-bold text-green-800 mb-2">✅ Dublin Success Formula</h4>
              <ul class="text-green-700 text-sm space-y-1">
                <li>• Show genuine company research</li>
                <li>• Use storytelling (Irish culture loves it)</li>
                <li>• Include quantifiable achievements</li>
                <li>• Mention Dublin business context</li>
                <li>• Balance humility with confidence</li>
                <li>• Demonstrate multicultural competence</li>
                <li>• Reference EU work authorization</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-purple-50 rounded-lg p-4">
            <h4 class="font-bold text-purple-800 mb-3">🏢 Sector-Specific Tips for Dublin</h4>
            <div class="grid md:grid-cols-2 gap-3 text-purple-700 text-sm">
              <div><strong>Tech (Silicon Docks):</strong> Mention Dublin's tech hub status, specific technologies, agile experience</div>
              <div><strong>Finance (IFSC):</strong> Reference regulatory knowledge (GDPR, MiFID II), international experience</div>
              <div><strong>Healthcare:</strong> Show HSE system understanding, patient care focus, Irish qualifications</div>
              <div><strong>Sales/Marketing:</strong> Demonstrate Irish market knowledge, B2B/B2C experience, CRM tools</div>
            </div>
          </div>
          
          <div class="bg-orange-50 rounded-lg p-4">
            <h4 class="font-bold text-orange-800 mb-3">📝 Sample Opening Paragraph</h4>
            <div class="bg-white rounded border-l-4 border-orange-400 p-3 text-orange-900 text-sm italic">
              "I am writing to express my strong interest in the Marketing Coordinator position advertised on LinkedIn. Having followed your company's innovative campaigns in Dublin's competitive fintech market, I am excited about the opportunity to contribute to your dynamic team's continued success in Ireland's thriving financial services sector."
            </div>
          </div>
          
          <div class="bg-cyan-50 rounded-lg p-3 text-center">
            <p class="text-cyan-700 text-sm"><strong>📈 Dublin Fact:</strong> Cover letters increase interview chances by 47% in the Dublin job market when properly customized</p>
          </div>
        </div>
      `
    },
    {
      id: 'dublin-interview-tips',
      question: 'What Should I Expect in Dublin Job Interviews?',
      answer: `
        <div class="space-y-6">
          <div class="bg-emerald-50 rounded-lg p-4">
            <h4 class="font-bold text-emerald-800 mb-2">🎤 Dublin Interview Process</h4>
            <p class="text-emerald-700">Dublin interviews typically follow a structured 2-3 stage process, with cultural nuances specific to Irish business practices and European workplace standards.</p>
          </div>
          
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-3">📋 Interview Stages</h4>
            <div class="space-y-2 text-blue-700">
              <div class="flex items-center"><span class="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">1</span><strong>Phone/Video Screening (20-30 mins):</strong> HR or recruiter discussing basics, salary expectations, visa status</div>
              <div class="flex items-center"><span class="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">2</span><strong>Technical/Competency Interview (45-60 mins):</strong> Department manager assessing skills and cultural fit</div>
              <div class="flex items-center"><span class="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">3</span><strong>Final Panel Interview:</strong> Senior management, sometimes including company culture assessment</div>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-purple-50 rounded-lg p-4">
              <h4 class="font-bold text-purple-800 mb-2">💬 Common Questions</h4>
              <ul class="text-purple-700 text-sm space-y-1">
                <li>• "Why do you want to work in Dublin?"</li>
                <li>• "Tell me about solving complex problems"</li>
                <li>• "How do you handle diverse teams?"</li>
                <li>• "What interests you about our Irish operations?"</li>
              </ul>
            </div>
            
            <div class="bg-orange-50 rounded-lg p-4">
              <h4 class="font-bold text-orange-800 mb-2">🤝 Cultural Considerations</h4>
              <ul class="text-orange-700 text-sm space-y-1">
                <li>• <strong>Tone:</strong> Friendly but professional</li>
                <li>• <strong>Punctuality:</strong> Arrive 10-15 mins early</li>
                <li>• <strong>Small Talk:</strong> Weather/Dublin chat is normal</li>
                <li>• <strong>Questions:</strong> Ask about Dublin market growth</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold text-gray-800 mb-3">👔 Dress Code by Sector</h4>
            <div class="grid md:grid-cols-2 gap-3 text-gray-700 text-sm">
              <div><strong>Financial Services/Law:</strong> Formal business attire (suit required)</div>
              <div><strong>Tech Companies:</strong> Smart-casual (button-down, chinos)</div>
              <div><strong>Startups:</strong> Business casual to smart-casual</div>
              <div><strong>Pharmaceuticals:</strong> Business professional</div>
            </div>
          </div>
          
          <div class="bg-indigo-50 rounded-lg p-4">
            <h4 class="font-bold text-indigo-800 mb-3">🎯 Interview Preparation</h4>
            <div class="space-y-1 text-indigo-700 text-sm">
              <p>• Research the company's Irish operations and recent Dublin announcements</p>
              <p>• Understand Ireland's role in their European strategy</p>
              <p>• Prepare examples demonstrating adaptability and international mindset</p>
              <p>• Know basic facts about Dublin's business districts (IFSC, Docklands, Sandyford)</p>
            </div>
          </div>
          
          <div class="bg-green-50 rounded-lg p-3 text-center">
            <p class="text-green-700 text-sm"><strong>🍀 Irish Tip:</strong> Use STAR method (Situation, Task, Action, Result) - Dublin employers love structured answers</p>
          </div>
        </div>
      `
    },
    {
      id: 'cover-letter-dublin',
      question: 'How Should I Write a Cover Letter for Dublin Job Applications?',
      answer: `
        <div class="space-y-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-2">🇮🇪 Dublin Cover Letter Essentials</h4>
            <p class="text-blue-700">Cover letters are CRITICAL in Dublin job applications. 89% of Dublin hiring managers read cover letters first to decide if they'll review your CV. It's your chance to show cultural fit and genuine interest.</p>
          </div>
          
          <div class="bg-emerald-50 rounded-lg p-4">
            <h4 class="font-bold text-emerald-800 mb-3">📋 Perfect Structure for Dublin</h4>
            <div class="space-y-2 text-emerald-700">
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span><div><strong>Header (Your Details):</strong> Name, Dublin address, +353 phone, email, LinkedIn</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span><div><strong>Date & Company Address:</strong> Current date, hiring manager name if known</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span><div><strong>Salutation:</strong> "Dear Ms. O'Connor" or "Dear Hiring Manager" (NEVER "To Whom It May Concern")</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">4</span><div><strong>Opening Paragraph:</strong> Position, where you saw it, genuine company interest</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">5</span><div><strong>Body (1-2 paragraphs):</strong> Relevant experience with quantifiable achievements</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">6</span><div><strong>Closing:</strong> Interest reiteration, interview request, appreciation</div></div>
              <div class="flex items-start"><span class="bg-emerald-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">7</span><div><strong>Sign-off:</strong> "Yours sincerely" (name known) or "Yours faithfully" (unknown)</div></div>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-red-50 rounded-lg p-4">
              <h4 class="font-bold text-red-800 mb-2">❌ Dublin Cover Letter Mistakes</h4>
              <ul class="text-red-700 text-sm space-y-1">
                <li>• Using same letter for every application</li>
                <li>• Mentioning salary expectations (unless asked)</li>
                <li>• Being too American-direct or British-formal</li>
                <li>• Using clichés: "team player", "hardworking"</li>
                <li>• Exceeding one page (A4 format)</li>
                <li>• Not researching company's Dublin operations</li>
                <li>• Missing job description keywords</li>
              </ul>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4">
              <h4 class="font-bold text-green-800 mb-2">✅ Dublin Success Formula</h4>
              <ul class="text-green-700 text-sm space-y-1">
                <li>• Show genuine company research</li>
                <li>• Use storytelling (Irish culture loves it)</li>
                <li>• Include quantifiable achievements</li>
                <li>• Mention Dublin business context</li>
                <li>• Balance humility with confidence</li>
                <li>• Demonstrate multicultural competence</li>
                <li>• Reference EU work authorization</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-purple-50 rounded-lg p-4">
            <h4 class="font-bold text-purple-800 mb-3">🏢 Sector-Specific Tips for Dublin</h4>
            <div class="grid md:grid-cols-2 gap-3 text-purple-700 text-sm">
              <div><strong>Tech (Silicon Docks):</strong> Mention Dublin's tech hub status, specific technologies, agile experience</div>
              <div><strong>Finance (IFSC):</strong> Reference regulatory knowledge (GDPR, MiFID II), international experience</div>
              <div><strong>Healthcare:</strong> Show HSE system understanding, patient care focus, Irish qualifications</div>
              <div><strong>Sales/Marketing:</strong> Demonstrate Irish market knowledge, B2B/B2C experience, CRM tools</div>
            </div>
          </div>
          
          <div class="bg-orange-50 rounded-lg p-4">
            <h4 class="font-bold text-orange-800 mb-3">📝 Sample Opening Paragraph</h4>
            <div class="bg-white rounded border-l-4 border-orange-400 p-3 text-orange-900 text-sm italic">
              "I am writing to express my strong interest in the Marketing Coordinator position advertised on LinkedIn. Having followed your company's innovative campaigns in Dublin's competitive fintech market, I am excited about the opportunity to contribute to your dynamic team's continued success in Ireland's thriving financial services sector."
            </div>
          </div>
          
          <div class="bg-cyan-50 rounded-lg p-3 text-center">
            <p class="text-cyan-700 text-sm"><strong>📈 Dublin Fact:</strong> Cover letters increase interview chances by 47% in the Dublin job market when properly customized</p>
          </div>
        </div>
      `
    },
    {
      id: 'work-visa-ireland',
      question: 'Do I Need a Work Visa for Dublin? What Are the Requirements?',
      answer: `
        <div class="space-y-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-2">🛂 Work Authorization in Ireland</h4>
            <p class="text-blue-700">Ireland has specific work visa requirements depending on your nationality, skills, and the type of position. Understanding these is crucial for Dublin job applications.</p>
          </div>
          
          <div class="grid md:grid-cols-3 gap-4">
            <div class="bg-green-50 rounded-lg p-4">
              <h4 class="font-bold text-green-800 mb-2">✅ No Visa Needed</h4>
              <ul class="text-green-700 text-sm space-y-1">
                <li>• EU/EEA citizens</li>
                <li>• Swiss nationals</li>
                <li>• UK citizens (Brexit arrangements)</li>
                <li>• Irish citizens returning</li>
              </ul>
            </div>
            
            <div class="bg-orange-50 rounded-lg p-4">
              <h4 class="font-bold text-orange-800 mb-2">📋 Work Permits Required</h4>
              <ul class="text-orange-700 text-sm space-y-1">
                <li>• Non-EU/EEA nationals</li>
                <li>• Most international applicants</li>
                <li>• Specific visa categories apply</li>
                <li>• Employer sponsorship usually required</li>
              </ul>
            </div>
            
            <div class="bg-purple-50 rounded-lg p-4">
              <h4 class="font-bold text-purple-800 mb-2">🎓 Special Categories</h4>
              <ul class="text-purple-700 text-sm space-y-1">
                <li>• Irish graduates (1-year extension)</li>
                <li>• Critical Skills Employment Permit</li>
                <li>• General Employment Permit</li>
                <li>• Atypical Working Scheme</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-emerald-50 rounded-lg p-4">
            <h4 class="font-bold text-emerald-800 mb-3">🎯 Critical Skills Employment Permit</h4>
            <div class="space-y-2 text-emerald-700">
              <p><strong>Salary Threshold:</strong> €32,000+ annually (€64,000+ for some roles)</p>
              <p><strong>Eligible Occupations:</strong> Tech, Engineering, Healthcare, Finance professionals</p>
              <p><strong>Benefits:</strong> Immediate family reunification, path to permanent residence</p>
              <p><strong>Processing Time:</strong> 8-12 weeks typically</p>
            </div>
          </div>
          
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-3">📝 Application Process</h4>
            <div class="space-y-2 text-blue-700">
              <div class="flex items-center"><span class="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">1</span><strong>Job Offer:</strong> Secure employment with Dublin-based company</div>
              <div class="flex items-center"><span class="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">2</span><strong>Employer Application:</strong> Company applies for employment permit</div>
              <div class="flex items-center"><span class="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">3</span><strong>Visa Application:</strong> Apply for entry visa (if required)</div>
              <div class="flex items-center"><span class="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">4</span><strong>IRP Registration:</strong> Register with Garda within 90 days</div>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-gray-50 rounded-lg p-4">
              <h4 class="font-bold text-gray-800 mb-2">📄 Required Documents</h4>
              <ul class="text-gray-700 text-sm space-y-1">
                <li>• Passport (6+ months validity)</li>
                <li>• Degree certificates (translated)</li>
                <li>• Employment contract/job offer</li>
                <li>• Criminal background check</li>
                <li>• Medical insurance evidence</li>
                <li>• Bank statements (financial proof)</li>
              </ul>
            </div>
            
            <div class="bg-yellow-50 rounded-lg p-4">
              <h4 class="font-bold text-yellow-800 mb-2">💰 Associated Costs</h4>
              <ul class="text-yellow-700 text-sm space-y-1">
                <li>• Employment Permit: €1,000</li>
                <li>• Entry Visa: €60-€100</li>
                <li>• IRP Registration: €300</li>
                <li>• Document translations: €100-€300</li>
                <li>• Total estimated: €1,500-€1,700</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-indigo-50 rounded-lg p-4">
            <h4 class="font-bold text-indigo-800 mb-3">🏢 Cover Letter Mention Tips</h4>
            <div class="space-y-1 text-indigo-700 text-sm">
              <p><strong>EU Citizens:</strong> "As an EU citizen, I have the right to work in Ireland without restrictions."</p>
              <p><strong>Non-EU with Permit:</strong> "I currently hold a Critical Skills Employment Permit valid until [date]."</p>
              <p><strong>Visa Required:</strong> "I am eligible for an employment permit and ready to begin the application process upon job offer."</p>
            </div>
          </div>
          
          <div class="bg-red-50 rounded-lg p-3 text-center">
            <p class="text-red-700 text-sm"><strong>⚠️ Important:</strong> Always check latest requirements at enterprise.gov.ie - visa rules change frequently</p>
          </div>
        </div>
      `
    },
    {
      id: 'dublin-cv-mistakes',
      question: 'What Are the Most Common CV Mistakes for Dublin Job Applications?',
      answer: `
        <div class="space-y-6">
          <div class="bg-red-50 rounded-lg p-4">
            <h4 class="font-bold text-red-800 mb-2">⚠️ Common CV Mistakes in Dublin</h4>
            <p class="text-red-700">Understanding these common mistakes can significantly improve your chances in Dublin's competitive job market and help you avoid instant rejection.</p>
          </div>
          
          <div class="bg-orange-50 rounded-lg p-4">
            <h4 class="font-bold text-orange-800 mb-3">📏 Format and Length Errors</h4>
            <div class="space-y-2 text-orange-700">
              <p><strong>❌ Too Long:</strong> CVs over 2 pages are automatically rejected by most Dublin employers</p>
              <p><strong>❌ Creative Layouts:</strong> Graphics, unusual fonts, or complex designs confuse ATS systems</p>
              <p><strong>❌ Including Photos:</strong> Unlike Germany or France, Irish CVs never include photographs</p>
              <p><strong>❌ Irrelevant Personal Info:</strong> Age, marital status, or nationality are not required and can lead to bias</p>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-purple-50 rounded-lg p-4">
              <h4 class="font-bold text-purple-800 mb-2">📝 Content Mistakes</h4>
              <ul class="text-purple-700 text-sm space-y-1">
                <li>• <strong>Vague Achievements:</strong> "Good team player"</li>
                <li>• <strong>Missing Keywords:</strong> Ignoring job description terms</li>
                <li>• <strong>Wrong English:</strong> American vs. Irish spelling</li>
                <li>• <strong>Weak Summary:</strong> Generic statements</li>
              </ul>
            </div>
            
            <div class="bg-cyan-50 rounded-lg p-4">
              <h4 class="font-bold text-cyan-800 mb-2">🇮🇪 Dublin-Specific Errors</h4>
              <ul class="text-cyan-700 text-sm space-y-1">
                <li>• <strong>Work Authorization:</strong> Not mentioning EU status</li>
                <li>• <strong>Local Knowledge:</strong> Ignoring Irish market</li>
                <li>• <strong>Currency:</strong> Using GBP/USD not EUR (€)</li>
                <li>• <strong>Contact Info:</strong> Wrong country code</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-3">🌍 Translation & Localization Issues</h4>
            <div class="space-y-2 text-blue-700">
              <p><strong>Direct Translation:</strong> Don't directly translate foreign qualifications - explain Irish equivalents</p>
              <p><strong>Job Title Confusion:</strong> Use standard Irish/UK job titles (e.g., "Managing Director" not "CEO" for smaller companies)</p>
              <p><strong>Education Format:</strong> Clearly explain international degrees in Irish context (e.g., "Masters equivalent to Irish Level 9")</p>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold text-gray-800 mb-3">💻 Technical Mistakes</h4>
            <div class="grid md:grid-cols-3 gap-3 text-gray-700 text-sm">
              <div><strong>File Naming:</strong> Use "FirstName_LastName_CV.pdf"</div>
              <div><strong>Email Address:</strong> Professional email only</div>
              <div><strong>LinkedIn URL:</strong> Customized, not random numbers</div>
            </div>
          </div>
          
          <div class="bg-green-50 rounded-lg p-4">
            <h4 class="font-bold text-green-800 mb-2">✅ Better Example</h4>
            <p class="text-green-700 text-sm"><strong>Instead of:</strong> "Good team player" <strong>Write:</strong> "Led cross-functional team of 6 to deliver €2M project 3 weeks ahead of schedule"</p>
          </div>
          
          <div class="bg-yellow-50 rounded-lg p-3 text-center">
            <p class="text-yellow-700 text-sm"><strong>🎯 Success Tip:</strong> Use Irish English spelling (specialise, colour, centre) and terminology throughout your CV</p>
          </div>
        </div>
      `
    },
    {
      id: 'dublin-job-platforms',
      question: 'Which Job Platforms Are Most Effective for Finding Work in Dublin?',
      answer: `
        <div class="space-y-6">
          <div class="bg-emerald-50 rounded-lg p-4">
            <h4 class="font-bold text-emerald-800 mb-2">🌐 Dublin Job Market Overview</h4>
            <p class="text-emerald-700">Dublin's job market utilizes both local and international platforms. Here's a comprehensive guide to the most effective job search channels for maximum success.</p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-blue-50 rounded-lg p-4">
              <h4 class="font-bold text-blue-800 mb-2">🇮🇪 Primary Irish Platforms</h4>
              <ul class="text-blue-700 text-sm space-y-1">
                <li>• <strong>IrishJobs.ie:</strong> Ireland's largest job site</li>
                <li>• <strong>Jobs.ie:</strong> Great for retail, hospitality</li>
                <li>• <strong>Recruiters.ie:</strong> Finance & tech roles</li>
                <li>• <strong>TheJournal.ie Jobs:</strong> Dublin startups</li>
              </ul>
            </div>
            
            <div class="bg-purple-50 rounded-lg p-4">
              <h4 class="font-bold text-purple-800 mb-2">🌍 International Platforms</h4>
              <ul class="text-purple-700 text-sm space-y-1">
                <li>• <strong>LinkedIn Jobs:</strong> Professional roles</li>
                <li>• <strong>Indeed.ie:</strong> Comprehensive coverage</li>
                <li>• <strong>Glassdoor.ie:</strong> Company research</li>
                <li>• <strong>Monster.ie:</strong> Multinational companies</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-orange-50 rounded-lg p-4">
            <h4 class="font-bold text-orange-800 mb-3">🎯 Sector-Specific Platforms</h4>
            <div class="grid md:grid-cols-2 gap-3 text-orange-700 text-sm">
              <div><strong>Technology:</strong> Stack Overflow Jobs, AngelList, GitHub Jobs</div>
              <div><strong>Finance:</strong> eFinancialCareers, Michael Page, Morgan McKinley</div>
              <div><strong>Healthcare:</strong> HSEJobs.ie, Irish Medical Jobs</div>
              <div><strong>Pharmaceuticals:</strong> BioPharma Dive Jobs, PharmaJobs.ie</div>
            </div>
          </div>
          
          <div class="bg-cyan-50 rounded-lg p-4">
            <h4 class="font-bold text-cyan-800 mb-3">🏢 Company Direct Applications</h4>
            <div class="space-y-2 text-cyan-700">
              <p><strong>Multinational HQs:</strong> Google Careers, Microsoft Careers, Facebook Careers</p>
              <p><strong>Irish Companies:</strong> Apply directly through company websites (AIB, Bank of Ireland, CRH)</p>
              <p><strong>Startups:</strong> AngelList, F6S, or directly through company websites</p>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-red-50 rounded-lg p-4">
              <h4 class="font-bold text-red-800 mb-2">🤝 Recruitment Agencies</h4>
              <ul class="text-red-700 text-sm space-y-1">
                <li>• <strong>Technology:</strong> Reperio, Matrix, Version 1</li>
                <li>• <strong>Finance:</strong> Mason Alexander, Sigmar</li>
                <li>• <strong>General:</strong> CPL, Adecco, Manpower</li>
              </ul>
            </div>
            
            <div class="bg-indigo-50 rounded-lg p-4">
              <h4 class="font-bold text-indigo-800 mb-2">📅 Networking & Events</h4>
              <ul class="text-indigo-700 text-sm space-y-1">
                <li>• <strong>Tech Meetups:</strong> Meetup.com events</li>
                <li>• <strong>Professional Bodies:</strong> Engineers Ireland</li>
                <li>• <strong>Alumni Networks:</strong> TCD, UCD, DCU</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-green-50 rounded-lg p-4">
            <h4 class="font-bold text-green-800 mb-3">⚡ Platform Usage Strategy</h4>
            <div class="space-y-2 text-green-700">
              <div class="flex items-center"><span class="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">1</span><strong>Start with IrishJobs.ie and LinkedIn</strong> for maximum coverage</div>
              <div class="flex items-center"><span class="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">2</span><strong>Set up job alerts</strong> with specific Dublin location filters</div>
              <div class="flex items-center"><span class="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">3</span><strong>Apply directly to target companies</strong> for senior roles</div>
              <div class="flex items-center"><span class="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">4</span><strong>Use recruitment agencies</strong> for specialized positions</div>
              <div class="flex items-center"><span class="bg-green-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">5</span><strong>Network actively</strong> through professional events and online communities</div>
            </div>
          </div>
          
          <div class="bg-yellow-50 rounded-lg p-3 text-center">
            <p class="text-yellow-700 text-sm"><strong>💡 Success Tip:</strong> Apply within 48 hours of job posting for 3x higher response rate in Dublin's fast-moving market</p>
          </div>
        </div>
      `
    },
    {
      id: 'post-interview-followup',
      question: 'How Should I Follow Up After a Dublin Job Interview?',
      answer: `
        <div class="space-y-6">
          <div class="bg-green-50 rounded-lg p-4">
            <h4 class="font-bold text-green-800 mb-2">📧 Post-Interview Follow-Up in Dublin</h4>
            <p class="text-green-700">Professional follow-up is crucial in Dublin's business culture. Here's the definitive guide to post-interview etiquette that Dublin employers expect.</p>
          </div>
          
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-3">⏰ Immediate Follow-Up (Within 24 Hours)</h4>
            <div class="space-y-2 text-blue-700">
              <p><strong>Thank You Email:</strong> Send to each interviewer individually if possible</p>
              <p><strong>Subject Line:</strong> "Thank you - [Position Title] Interview - [Your Name]"</p>
              <p><strong>Content Structure:</strong> Express appreciation, reiterate interest, mention specific discussion points, address concerns, professional closing</p>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold text-gray-800 mb-3">✉️ Sample Thank You Email</h4>
            <div class="bg-white border-l-4 border-blue-500 p-4 text-sm text-gray-700 font-mono">
              <p><strong>Subject:</strong> Thank you - Senior Marketing Manager Interview - Sarah Johnson</p>
              <p class="mt-2"><strong>Dear Ms. Murphy,</strong></p>
              <p class="mt-2">Thank you for taking the time to meet with me yesterday to discuss the Senior Marketing Manager position. I enjoyed our conversation about Dublin's evolving fintech landscape and your team's innovative approach to digital customer acquisition.</p>
              <p class="mt-2">Our discussion reinforced my enthusiasm for contributing to [Company]'s continued growth in the Irish market. I'm particularly excited about the opportunity to lead the expansion into the Dublin startup ecosystem that we discussed.</p>
              <p class="mt-2">Please let me know if you need any additional information. I look forward to hearing about the next steps in your process.</p>
              <p class="mt-2"><strong>Best regards,<br>Sarah Johnson</strong></p>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-purple-50 rounded-lg p-4">
              <h4 class="font-bold text-purple-800 mb-2">📅 Follow-Up Timeline</h4>
              <ul class="text-purple-700 text-sm space-y-1">
                <li>• <strong>Week 1:</strong> Thank you email (24hrs)</li>
                <li>• <strong>Week 2:</strong> Brief check-in if needed</li>
                <li>• <strong>Week 3:</strong> Final polite follow-up</li>
                <li>• <strong>After Week 3:</strong> Move on gracefully</li>
              </ul>
            </div>
            
            <div class="bg-orange-50 rounded-lg p-4">
              <h4 class="font-bold text-orange-800 mb-2">💡 Follow-Up Content Ideas</h4>
              <ul class="text-orange-700 text-sm space-y-1">
                <li>• Additional portfolio items</li>
                <li>• Dublin market insights</li>
                <li>• Clarifications from interview</li>
                <li>• References if requested</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-cyan-50 rounded-lg p-4">
            <h4 class="font-bold text-cyan-800 mb-3">📱 Communication Channels</h4>
            <div class="grid md:grid-cols-2 gap-3 text-cyan-700 text-sm">
              <div><strong>✅ Preferred:</strong> Email (primary), LinkedIn message</div>
              <div><strong>📞 Phone:</strong> Only if explicitly encouraged</div>
              <div><strong>❌ Avoid:</strong> Text messages, social media, unannounced visits</div>
              <div><strong>⏰ Timing:</strong> Business hours (9 AM - 5 PM Irish time)</div>
            </div>
          </div>
          
          <div class="bg-yellow-50 rounded-lg p-4">
            <h4 class="font-bold text-yellow-800 mb-3">🇮🇪 Dublin Business Culture</h4>
            <div class="space-y-1 text-yellow-700 text-sm">
              <p>• <strong>Tone:</strong> Professional but warm - Irish business culture appreciates genuine personality</p>
              <p>• <strong>Length:</strong> Keep emails concise but personalized</p>
              <p>• <strong>Approach:</strong> Be persistent but not pushy - respect their timeline</p>
            </div>
          </div>
          
          <div class="bg-red-50 rounded-lg p-4">
            <h4 class="font-bold text-red-800 mb-2">🚫 Red Flags to Avoid</h4>
            <ul class="text-red-700 text-sm space-y-1">
              <li>• Generic, copy-paste thank you messages</li>
              <li>• Following up too frequently (more than once per week)</li>
              <li>• Being overly casual or too formal for company culture</li>
              <li>• Pressuring for immediate decisions</li>
              <li>• Contacting outside business hours</li>
            </ul>
          </div>
          
          <div class="bg-indigo-50 rounded-lg p-3 text-center">
            <p class="text-indigo-700 text-sm"><strong>🍀 Dublin Success Tip:</strong> 68% of Dublin employers say thoughtful follow-up emails positively influence their hiring decisions</p>
          </div>
        </div>
      `
    },
    {
      id: 'cover-letter-guide',
      question: 'How Do I Write an Effective Cover Letter for Dublin Jobs?',
      answer: `
        <div class="space-y-6">
          <div class="bg-emerald-50 rounded-lg p-4">
            <h4 class="font-bold text-emerald-800 mb-2">📝 Cover Letter Essentials</h4>
            <p class="text-emerald-700">A well-crafted cover letter can be the difference between landing an interview and being overlooked. Dublin employers expect professional, personalized letters that demonstrate genuine interest and cultural fit.</p>
          </div>
          
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-3">📋 Perfect Structure (3-4 Paragraphs)</h4>
            <div class="space-y-3 text-blue-700">
              <div class="flex items-start">
                <span class="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-1">1</span>
                <div>
                  <strong>Opening Paragraph:</strong> Outline what you have to offer that's directly relevant to the role. State the position you're applying for and where you learned about it. Avoid rambling - you'll immediately lose the reader.
                </div>
              </div>
              <div class="flex items-start">
                <span class="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-1">2</span>
                <div>
                  <strong>Middle Paragraphs:</strong> Detail how your skills, experience and education make you ideal for the specific requirements. Include company research to show you've done your homework. Mention why you specifically want to work for them.
                </div>
              </div>
              <div class="flex items-start">
                <span class="bg-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-1">3</span>
                <div>
                  <strong>Final Paragraph:</strong> Thank the reader for their consideration and state that you would welcome the opportunity for an interview. Close with confidence that encourages a positive response.
                </div>
              </div>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-green-50 rounded-lg p-4">
              <h4 class="font-bold text-green-800 mb-3">✅ DO These Things</h4>
              <ul class="text-green-700 text-sm space-y-2">
                <li>• <strong>Start with qualifications</strong> relevant to the job opening</li>
                <li>• <strong>Show genuine interest</strong> in the field and company</li>
                <li>• <strong>Include company research</strong> and historical facts</li>
                <li>• <strong>Use varied sentence structures</strong> and openings</li>
                <li>• <strong>Be specific</strong> about achievements with metrics</li>
                <li>• <strong>Research the company</strong> and mention relevant details</li>
                <li>• <strong>Show personality</strong> while staying professional</li>
              </ul>
            </div>
            
            <div class="bg-red-50 rounded-lg p-4">
              <h4 class="font-bold text-red-800 mb-3">❌ DON'T Do These</h4>
              <ul class="text-red-700 text-sm space-y-2">
                <li>• <strong>Begin with your name</strong> (it's already on your CV)</li>
                <li>• <strong>Repeat your CV content</strong> word for word</li>
                <li>• <strong>Use repetitive sentence starters</strong> like "for", "I am", "my"</li>
                <li>• <strong>Add references</strong> or justify previous job changes</li>
                <li>• <strong>Use clichés</strong> or generic phrases</li>
                <li>• <strong>Make it too long</strong> (keep to one page)</li>
                <li>• <strong>Send generic letters</strong> to multiple companies</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-purple-50 rounded-lg p-4">
            <h4 class="font-bold text-purple-800 mb-3">✍️ Writing Style Requirements</h4>
            <div class="grid md:grid-cols-2 gap-3 text-purple-700 text-sm">
              <div>• <strong>Vary sentence openings</strong> - avoid repetitive starts</div>
              <div>• <strong>Use active voice</strong> and strong action verbs</div>
              <div>• <strong>Include specific metrics</strong> and achievements</div>
              <div>• <strong>Balance professionalism</strong> with Irish directness</div>
              <div>• <strong>Show genuine enthusiasm</strong> for the role</div>
              <div>• <strong>Demonstrate cultural fit</strong> with company values</div>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-bold text-gray-800 mb-3">📄 Cover Letter Example</h4>
            <div class="bg-white border-l-4 border-purple-500 p-4 text-sm text-gray-700">
              <p class="mb-3"><strong>Dear Mr. Jones,</strong></p>
              <p class="mb-3">I am applying for the available marketing assistant role advertised at www.jobs.ie.</p>
              <p class="mb-3">As well as having experience in the marketing field, I graduated from University College Dublin (UCD) with a BA in Marketing. I am now looking to use the knowledge gained so far in my career to further help clients achieve their sales targets and the opening at Acme Business presents me with the ideal opportunity to achieve this goal.</p>
              <p class="mb-3">I believe I meet all the criteria needed for the role. In the course of my studies, I learned a great deal about the financial side of running a business including details on setting a budget. I worked as part of a group for a number of projects and feel comfortable as part of a team due to my interpersonal and communication skills.</p>
              <p class="mb-3">At Johnson Marketing, I worked for a variety of major international firms and helped them learn crucial details about customer behaviour. As a result, we were able to streamline the marketing campaigns of these clients to reduce costs while increasing ROI. I worked with five different clients during my tenure at Johnson Marketing and all five enjoyed a sales increase of at least 10%.</p>
              <p class="mb-3">In addition to this extensive marketing campaign experience, I also have strong administrative, communication, problem solving and time management skills. This broad background makes me an ideal candidate for this position and I believe I will bring flexibility, efficiency, reliability and innovation to your company. Please read the accompanying CV which will provide you with further details of my skill set and academic qualifications.</p>
              <p class="mb-3">I appreciate you taking the time to read my application and I look forward to hearing from you.</p>
              <p><strong>Kind Regards,<br>Jane Smith</strong></p>
            </div>
          </div>
          
          <div class="bg-orange-50 rounded-lg p-4">
            <h4 class="font-bold text-orange-800 mb-3">🎯 Dublin-Specific Tips</h4>
            <div class="space-y-2 text-orange-700 text-sm">
              <p>• <strong>Irish Business Culture:</strong> Professional but warm - show genuine personality</p>
              <p>• <strong>Company Research:</strong> Mention Dublin office specifics, recent company news, or Irish market expansion</p>
              <p>• <strong>Local Knowledge:</strong> Reference understanding of Irish business practices or European market</p>
              <p>• <strong>Networking:</strong> Mention any Irish professional connections or industry involvement</p>
            </div>
          </div>
          
          <div class="bg-yellow-50 rounded-lg p-3 text-center">
            <p class="text-yellow-700 text-sm"><strong>💡 Pro Tip:</strong> 73% of Dublin hiring managers read cover letters first before looking at CVs - make yours count!</p>
          </div>
        </div>
      `
    }
  ];

  return (
    <>
      <Head>
        <title>Dublin Job Application & Career Guide - CVGenius FAQ | ATS Tips, Interview Advice & CV Standards</title>
        <meta name="description" content="🇮🇪 Your complete guide to Dublin's job market! Master ATS systems, perfect your Irish CV, leverage LinkedIn, nail interviews & discover top job platforms. Expert Dublin career strategies inside." />
        <meta name="keywords" content="Dublin jobs, Ireland CV, ATS tips, Dublin interview, LinkedIn Ireland, Irish job market, Dublin career advice, job application Dublin" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <Sparkles className="h-8 w-8 text-primary-600 mr-2" />
                  <span className="text-xl font-bold text-gray-900">CVGenius</span>
                </Link>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <a href="/#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Features
                </a>
                <a href="/#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                  How It Works
                </a>
                <span className="text-primary-600 font-semibold">
                  FAQ
                </span>
              </nav>
            </div>
          </div>
        </header>

        {/* Breadcrumb and Back Button */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex flex-col md:flex-row items-center justify-center mb-6">
              <div className="relative mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <Globe className="w-16 h-16 text-primary-600 animate-pulse" />
                <div className="absolute -top-2 -right-2 text-2xl">🇮🇪</div>
              </div>
              <div className="text-center">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Dublin Career <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Mastery</span> Guide
                </h1>
                <div className="text-base md:text-lg text-gray-500 mt-2 font-medium">🚀 Your pathway to Irish job market success</div>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              🎯 <strong>Master Dublin&apos;s competitive job market</strong> with insider strategies! From ATS optimization to Irish business culture, 
              this guide reveals the secrets that land interviews at Google Dublin, AIB, Stripe, and Ireland&apos;s top employers.
            </p>
            

            

          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {faqData.map((item, index) => {
                const isOpen = openItems.includes(item.id);
                const gradientColors = [
                  'from-blue-500 to-purple-600',
                  'from-emerald-500 to-teal-600', 
                  'from-orange-500 to-red-600',
                  'from-pink-500 to-rose-600',
                  'from-indigo-500 to-blue-600',
                  'from-cyan-500 to-blue-600'
                ];
                
                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden transform transition-all duration-300 ${isOpen ? 'border-primary-200 shadow-2xl scale-[1.02]' : 'border-gray-100 hover:border-primary-100 hover:shadow-xl'}`}
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-full px-4 md:px-8 py-6 md:py-8 text-left flex justify-between items-start hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300"
                    >
                      <div className="flex items-start flex-1 min-w-0">
                        <span className={`bg-gradient-to-r ${gradientColors[index % gradientColors.length]} text-white text-xs md:text-sm font-bold px-3 md:px-4 py-2 rounded-full mr-3 md:mr-6 mt-1 flex-shrink-0 shadow-lg`}>
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-6 md:leading-7 mb-2 pr-2">
                            {item.question}
                          </h3>
                          <div className="text-xs md:text-sm text-gray-500 font-medium">
                            {isOpen ? '📖 Reading...' : '🚀 Click to unlock insider knowledge'}
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 md:ml-4 flex-shrink-0">
                        <div className={`p-1.5 md:p-2 rounded-full transition-all duration-300 ${isOpen ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}`}>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 md:w-6 md:h-6" />
                          ) : (
                            <ChevronDown className="w-5 h-5 md:w-6 md:h-6" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {isOpen && (
                      <div className="px-4 md:px-8 pb-6 md:pb-8">
                        <div className="pl-0 md:pl-20">
                          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 md:p-6 border-l-4 border-primary-400">
                            <div 
                              className="prose prose-sm md:prose-lg prose-gray max-w-none text-gray-700 leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: item.answer }}
                            />
                            <div className="mt-4 md:mt-6 text-xs text-gray-500 font-medium flex items-center">
                              <span className="mr-2">💡</span>
                              Expert insights for Dublin job market success
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="mt-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-600 rounded-3xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-secondary-600/90 rounded-3xl"></div>
              <div className="relative px-8 py-12 text-center text-white">
                <div className="flex items-center justify-center mb-6">
                  <span className="text-5xl mr-4">🚀</span>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Launch Your Dublin Career Today!
                  </h2>
                </div>
                <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto leading-relaxed">
                  🎯 Apply the strategies above with our <strong>AI-powered CV builder</strong> - specifically designed for Irish ATS systems and Dublin employers!
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link href="/create-new-cv" className="group bg-white text-primary-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center">
                    <span className="mr-2">✨</span>
                    Create Dublin-Ready CV
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link href="/update-cv" className="group bg-primary-800/80 backdrop-blur text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-primary-900/80 transition-all duration-300 transform hover:scale-105 shadow-xl border-2 border-white/20 flex items-center">
                    <span className="mr-2">🔄</span>
                    Optimize Existing CV
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
                <div className="mt-6 text-sm text-blue-200 font-medium">
                  ⚡ Instant generation • 🔒 Privacy-first • 📊 ATS-optimized
                </div>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg border border-blue-200 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-600 rounded-full p-3 mr-4">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900">Useful Resources</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/70 rounded-lg p-4 hover:bg-white/90 transition-colors">
                    <a href="https://www.irishjobs.ie" target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-900 flex items-center font-semibold">
                      <ExternalLink className="w-4 h-4 mr-3 text-blue-600" />
                      IrishJobs.ie - Ireland&apos;s largest job site
                    </a>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 hover:bg-white/90 transition-colors">
                    <a href="https://www.citizensinformation.ie/en/employment/" target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-900 flex items-center font-semibold">
                      <ExternalLink className="w-4 h-4 mr-3 text-blue-600" />
                      Citizens Information - Employment Rights
                    </a>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 hover:bg-white/90 transition-colors">
                    <a href="https://enterprise.gov.ie/" target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-900 flex items-center font-semibold">
                      <ExternalLink className="w-4 h-4 mr-3 text-blue-600" />
                      Enterprise Ireland - Business Support
                    </a>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4 hover:bg-white/90 transition-colors">
                    <a href="https://enterprise.gov.ie/en/publications/employment-permit-statistics-2025.html" target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:text-blue-900 flex items-center font-semibold">
                      <ExternalLink className="w-4 h-4 mr-3 text-blue-600" />
                      Employment Permit Statistics 2025 - Official Government Data
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 shadow-lg border border-emerald-200 transform hover:scale-105 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-emerald-600 rounded-full p-3 mr-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-900">Key Dublin Business Districts</h3>
                </div>
                <div className="bg-emerald-600/10 rounded-lg p-4 mb-6 border border-emerald-300">
                  <div className="flex items-center mb-2">
                    <span className="text-lg mr-2">💡</span>
                    <span className="font-semibold text-emerald-800 text-sm">Why This Matters</span>
                  </div>
                  <p className="text-emerald-700 text-sm">Understanding Dublin&apos;s business districts helps you target the right companies, choose optimal commute routes, and demonstrate local market knowledge in interviews.</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/70 rounded-lg p-4 hover:bg-white/90 transition-colors">
                    <a href="https://www.ifsc.ie/" target="_blank" rel="noopener noreferrer" className="text-emerald-800 hover:text-emerald-900 font-semibold flex items-center">
                      <ExternalLink className="w-4 h-4 mr-3 text-emerald-600" />
                      <span>
                        <strong>IFSC (International Financial Services Centre):</strong> 
                        <span className="font-normal"> Major banks and financial services</span>
                      </span>
                    </a>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4">
                    <span className="text-emerald-800 font-semibold">
                      <strong>Docklands:</strong> 
                      <span className="font-normal"> Google, Facebook, LinkedIn, and other tech giants</span>
                    </span>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4">
                    <span className="text-emerald-800 font-semibold">
                      <strong>Sandyford:</strong> 
                      <span className="font-normal"> Microsoft, Oracle, and pharmaceutical companies</span>
                    </span>
                  </div>
                  <div className="bg-white/70 rounded-lg p-4">
                    <span className="text-emerald-800 font-semibold">
                      <strong>Citywest:</strong> 
                      <span className="font-normal"> Startups and emerging tech companies</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <Sparkles className="h-8 w-8 text-primary-400 mr-2" />
                  <span className="text-xl font-bold">CVGenius</span>
                </div>
                <p className="text-gray-400 mb-6">
                  AI-powered CV and cover letter generation for the modern job seeker. 
                  Privacy-first, ATS-friendly, and designed for success in Dublin&apos;s competitive job market.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/create-new-cv" className="hover:text-white transition-colors">Create New CV</Link></li>
                  <li><Link href="/update-cv" className="hover:text-white transition-colors">Update Existing CV</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/#faq" className="hover:text-white transition-colors">General FAQ</Link></li>
                  <li><Link href="/dublin-faq" className="hover:text-white transition-colors">Dublin Job Guide</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><a href="mailto:emincem@live.com" className="hover:text-white transition-colors">emincem@live.com</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <p>&copy; 2025 CVGenius. All rights reserved. | Specialized guidance for Dublin and Irish job markets.</p>
                <p className="mt-2 sm:mt-0">
                  Created voluntarily by{' '}
                  <a 
                    href="https://www.linkedin.com/in/cem-koyluoglu/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Cem Koyluoglu
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default DublinFAQPage; 