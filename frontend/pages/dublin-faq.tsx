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
      id: 'ats-systems',
      question: 'What are ATS (Applicant Tracking Systems) and How Do They Work?',
      answer: `
        <div class="space-y-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-2">📊 What is ATS?</h4>
            <p class="text-blue-700">ATS (Applicant Tracking Systems) are software applications that help employers manage hiring by automatically filtering and ranking job applications. Major Dublin companies like Google, Meta, LinkedIn, Amazon, and Accenture all use these systems.</p>
          </div>
          
          <div class="bg-green-50 rounded-lg p-4">
            <h4 class="font-bold text-green-800 mb-3">⚙️ How ATS Works</h4>
            <div class="space-y-2 text-green-700">
              <p><strong>1. Keyword Scanning:</strong> Scans CVs for specific keywords from job descriptions</p>
              <p><strong>2. Automatic Filtering:</strong> Eliminates CVs that don't match required qualifications</p>
              <p><strong>3. Ranking System:</strong> Ranks applications based on keyword density and relevance</p>
            </div>
          </div>
          
          <div class="bg-purple-50 rounded-lg p-4">
            <h4 class="font-bold text-purple-800 mb-3">✅ ATS-Friendly CV Tips</h4>
            <div class="grid md:grid-cols-2 gap-3 text-purple-700 text-sm">
              <div><strong>Format:</strong> Clean layouts, no graphics</div>
              <div><strong>Fonts:</strong> Arial, Calibri, Times New Roman</div>
              <div><strong>Keywords:</strong> Use exact terms from job descriptions</div>
              <div><strong>File Type:</strong> Save as .docx or PDF</div>
              <div><strong>Headers:</strong> Use standard section titles</div>
              <div><strong>Size:</strong> 11-12pt for body text</div>
            </div>
          </div>
          
          <div class="bg-orange-50 rounded-lg p-3 text-center">
            <p class="text-orange-700 text-sm"><strong>📈 Key Stat:</strong> 98% of Fortune 500 companies and 75% of Dublin companies use ATS systems</p>
          </div>
        </div>
      `
    },
    {
      id: 'dublin-cv-standards',
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
      id: 'linkedin-dublin-jobs',
      question: 'How Can I Use LinkedIn Effectively for Dublin Job Applications?',
      answer: `
        <div class="space-y-6">
          <div class="bg-blue-50 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-2">💼 LinkedIn Power in Dublin</h4>
            <p class="text-blue-700">LinkedIn is the most powerful platform for Dublin job seekers, with 85% of local recruiters actively using it for talent acquisition and networking.</p>
          </div>
          
          <div class="bg-green-50 rounded-lg p-4">
            <h4 class="font-bold text-green-800 mb-3">🎯 Profile Optimization</h4>
            <div class="space-y-2 text-green-700">
              <p><strong>Headline:</strong> Include your target role and location (e.g., "Software Engineer | Dublin | Full-Stack Developer specializing in React & Node.js")</p>
              <p><strong>Location:</strong> Set to "Dublin, Ireland" to appear in local searches</p>
              <p><strong>Open to Work Badge:</strong> Enable "Share with recruiters only" for discreet job searching</p>
              <p><strong>Summary:</strong> Mention your passion for Dublin's tech/business ecosystem</p>
            </div>
          </div>
          
          <div class="bg-purple-50 rounded-lg p-4">
            <h4 class="font-bold text-purple-800 mb-3">📋 Job Application Strategy</h4>
            <div class="space-y-2 text-purple-700">
              <div class="flex items-center"><span class="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">1</span><strong>Use Advanced Filters:</strong> Search by "Dublin", "Ireland", and set date filters for recent postings</div>
              <div class="flex items-center"><span class="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">2</span><strong>Easy Apply:</strong> Your LinkedIn profile auto-populates applications</div>
              <div class="flex items-center"><span class="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">3</span><strong>Personalized Messages:</strong> Add notes like "Excited to contribute to Dublin's thriving fintech sector"</div>
              <div class="flex items-center"><span class="bg-purple-200 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-2">4</span><strong>Follow Companies:</strong> Track updates from major Dublin employers (Google Dublin, Accenture, Bank of Ireland)</div>
            </div>
          </div>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div class="bg-cyan-50 rounded-lg p-4">
              <h4 class="font-bold text-cyan-800 mb-2">🤝 Networking in Dublin</h4>
              <ul class="text-cyan-700 text-sm space-y-1">
                <li>• Join groups: "Dublin Tech Professionals"</li>
                <li>• "Irish Tech Community", "Dublin Startups"</li>
                <li>• Attend virtual events by Dublin companies</li>
                <li>• Connect with Dublin professionals</li>
                <li>• Engage with Irish industry leaders</li>
              </ul>
            </div>
            
            <div class="bg-orange-50 rounded-lg p-4">
              <h4 class="font-bold text-orange-800 mb-2">🏢 Top Dublin Companies</h4>
              <ul class="text-orange-700 text-sm space-y-1">
                <li><strong>Tech:</strong> Google Dublin, Meta Dublin</li>
                <li><strong>Finance:</strong> Bank of Ireland, AIB, Stripe</li>
                <li><strong>Pharma:</strong> Pfizer Ireland, J&J Dublin</li>
                <li><strong>Consulting:</strong> Accenture, Deloitte</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-indigo-50 rounded-lg p-3 text-center">
            <p class="text-indigo-700 text-sm"><strong>🔍 Pro Tip:</strong> 75% of Dublin tech jobs are filled through LinkedIn networking before being posted publicly</p>
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
                <Link href="/#features" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Features
                </Link>
                <Link href="/#how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
                  How It Works
                </Link>
                <Link href="/#faq" className="text-gray-600 hover:text-primary-600 transition-colors">
                  FAQ
                </Link>
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
            
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 mb-8 max-w-2xl mx-auto border border-emerald-200">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl mr-2">✨</span>
                <span className="font-semibold text-gray-800">Success-Proven Strategies Inside</span>
              </div>
              <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                <div>📊 ATS System Mastery</div>
                <div>🎯 Interview Excellence</div>
                <div>💼 LinkedIn Optimization</div>
                <div>📝 Irish CV Standards</div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200 transform hover:scale-105 transition-transform">
                <FileText className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-blue-900 mb-1">98%</div>
                <div className="text-sm text-blue-700 font-medium">of Dublin companies use ATS</div>
                <div className="text-xs text-blue-600 mt-2">📈 Critical for job success</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 shadow-lg border border-emerald-200 transform hover:scale-105 transition-transform">
                <Users className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-emerald-900 mb-1">3.8%</div>
                <div className="text-sm text-emerald-700 font-medium">unemployment in Dublin</div>
                <div className="text-xs text-emerald-600 mt-2">🎯 High opportunity market</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200 transform hover:scale-105 transition-transform">
                <CheckCircle className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-purple-900 mb-1">2 pages</div>
                <div className="text-sm text-purple-700 font-medium">max CV length in Ireland</div>
                <div className="text-xs text-purple-600 mt-2">📝 Strict formatting rules</div>
              </div>
            </div>
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
                  Created by{' '}
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