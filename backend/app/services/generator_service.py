"""
Core CV generation service using Google Gemini AI
"""

import json
import base64
from typing import Dict, Any
from datetime import datetime
from io import BytesIO

import httpx
try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None
try:
    from docx import Document
except ImportError:
    Document = None
from jinja2 import Environment, FileSystemLoader
try:
    from weasyprint import HTML, CSS
except ImportError:
    HTML = None

from app.core.config import settings
from app.schemas.models import CVFormData, PDFResponse


class CVGeneratorService:
    """Service for generating CVs using AI"""
    
    def __init__(self):
        self.gemini_api_key = settings.GEMINI_API_KEY
        self.gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.GEMINI_MODEL}:generateContent"
        
        # Initialize Jinja2 environment
        self.jinja_env = Environment(
            loader=FileSystemLoader('app/templates'),
            autoescape=True
        )
    
    async def generate_cv_only(self, form_data: CVFormData) -> dict:
        """Generate only CV content from form data"""
        try:
            # Create CV-only prompt
            cv_prompt = self._create_cv_only_prompt(form_data)
            
            # Get AI response for CV
            ai_response = await self._call_gemini(cv_prompt)
            
            # Parse CV response
            cv_data = self._parse_cv_only_response(ai_response)
            
            return cv_data
            
        except Exception as e:
            raise Exception(f"CV generation failed: {str(e)}")
    
    async def generate_cover_letter_only(self, cv_data: dict, job_description: str, company_name: str = "") -> dict:
        """Generate only cover letter using CV context"""
        try:
            # Create cover letter prompt with CV context
            cl_prompt = self._create_cover_letter_only_prompt(cv_data, job_description, company_name)
            
            # Get AI response for cover letter
            ai_response = await self._call_gemini(cl_prompt)
            
            # Parse cover letter response
            cl_data = self._parse_cover_letter_response(ai_response)
            
            return cl_data
            
        except Exception as e:
            raise Exception(f"Cover letter generation failed: {str(e)}")

    async def generate_from_form(self, form_data: CVFormData) -> PDFResponse:
        """Generate CV from form data (Creator flow) - Two-step process"""
        try:
            # Step 1: Generate CV content only
            cv_data = await self.generate_cv_only(form_data)
            
            # Step 2: Generate cover letter using CV context
            cover_letter_data = await self.generate_cover_letter_only(
                cv_data, 
                form_data.job_description or "",
                cv_data.get('company_name', '')
            )
            
            # Combine data
            complete_data = {**cv_data, **cover_letter_data, "theme": form_data.theme or "classic"}
            
            # Generate PDFs with selected theme
            cv_pdf, cover_letter_pdf = await self._generate_pdfs(complete_data, form_data.theme or "classic")
            
            return PDFResponse(
                cv_pdf_base64=base64.b64encode(cv_pdf).decode(),
                cover_letter_pdf_base64=base64.b64encode(cover_letter_pdf).decode(),
                filename_cv=f"cv_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
                filename_cover_letter=f"cover_letter_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
                generation_timestamp=datetime.now(),
                cv_data=complete_data
            )
            
        except Exception as e:
            raise Exception(f"CV generation failed: {str(e)}")
    
    async def generate_from_upload(self, cv_content: str, job_description: str, theme: str = "classic") -> PDFResponse:
        """Generate CV from uploaded file (Updater flow)"""
        try:
            # Create AI prompt for CV update
            prompt = self._create_update_prompt(cv_content, job_description)
            
            # Get AI response
            ai_response = await self._call_gemini(prompt)
            
            # Parse AI response
            cv_data = self._parse_ai_response(ai_response)
            
            # Add theme to cv_data
            cv_data["theme"] = theme
            
            # Generate PDFs
            cv_pdf, cover_letter_pdf = await self._generate_pdfs(cv_data, theme)
            
            return PDFResponse(
                cv_pdf_base64=base64.b64encode(cv_pdf).decode(),
                cover_letter_pdf_base64=base64.b64encode(cover_letter_pdf).decode(),
                filename_cv=f"updated_cv_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
                filename_cover_letter=f"cover_letter_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf",
                generation_timestamp=datetime.now(),
                cv_data=cv_data
            )
            
        except Exception as e:
            raise Exception(f"CV update failed: {str(e)}")
    
    def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        """Extract text from PDF file"""
        if PdfReader is None:
            raise Exception("PDF processing library not available. Please install pypdf")
        try:
            pdf_io = BytesIO(pdf_bytes)
            reader = PdfReader(pdf_io)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            raise Exception(f"PDF text extraction failed: {str(e)}")
    
    def extract_text_from_docx(self, docx_bytes: bytes) -> str:
        """Extract text from DOCX file"""
        if Document is None:
            raise Exception("DOCX processing library not available. Please install python-docx")
        try:
            docx_io = BytesIO(docx_bytes)
            doc = Document(docx_io)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            raise Exception(f"DOCX text extraction failed: {str(e)}")
    
    async def _call_gemini(self, prompt: str) -> str:
        """Make API call to Google Gemini"""
        # Check if API key is properly configured
        if not self.gemini_api_key or self.gemini_api_key == "your_gemini_api_key_here":
            raise Exception(
                "Gemini API key not configured. Please:\n"
                "1. Go to https://aistudio.google.com/app/apikey\n"
                "2. Create a new API key\n"
                "3. Set GEMINI_API_KEY in your .env file\n"
                "4. Restart the backend server"
            )
        
        try:
            headers = {
                "Content-Type": "application/json",
            }
            
            data = {
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.3,
                    "topK": 1,
                    "topP": 1,
                    "maxOutputTokens": 4096,
                }
            }
            
            async with httpx.AsyncClient(timeout=180.0) as client:
                response = await client.post(
                    f"{self.gemini_url}?key={self.gemini_api_key}",
                    headers=headers,
                    json=data
                )
                
                if response.status_code == 400:
                    error_detail = response.text
                    if "API_KEY_INVALID" in error_detail or "API key not valid" in error_detail:
                        raise Exception(
                            "Invalid Gemini API key. Please:\n"
                            "1. Check your API key at https://aistudio.google.com/app/apikey\n"
                            "2. Ensure the key is correctly set in your .env file\n"
                            "3. Restart the backend server"
                        )
                    else:
                        raise Exception(f"Gemini API request error: {error_detail}")
                
                response.raise_for_status()
                
                result = response.json()
                if "candidates" not in result or not result["candidates"]:
                    raise Exception("No response generated from Gemini API")
                
                return result["candidates"][0]["content"]["parts"][0]["text"]
                
        except httpx.TimeoutException:
            raise Exception("Gemini API request timed out. Please try again.")
        except httpx.RequestError as e:
            raise Exception(f"Network error calling Gemini API: {str(e)}")
        except Exception as e:
            if "Gemini API" in str(e):
                raise e
            raise Exception(f"Gemini API call failed: {str(e)}")
    
    def _create_cv_only_prompt(self, form_data: CVFormData) -> str:
        """Create AI prompt for CV generation only"""
        # Detect job sector for customization
        job_sector = self._detect_job_sector(form_data.job_description or "")
        # Extract key keywords for ATS optimization
        key_keywords = self._extract_key_keywords_from_job_description(form_data.job_description or "")
        
        return f"""Expert CV writer for Dublin/Irish job market. Generate professional CV content only (no cover letter).

DUBLIN CV REQUIREMENTS:
- 1-2 pages, reverse chronological order
- Arial/Times New Roman 11-12pt
- Quantifiable achievements with specific metrics
- Irish phone format (+353)
- ATS-friendly formatting, no photos/graphics
- Professional summary, work experience, education, skills

FORM DATA:
Personal: {form_data.personal_details.model_dump()}
Experience: {[exp.model_dump() for exp in form_data.work_experience]}
Education: {[edu.model_dump() for edu in form_data.education]}
Skills: {form_data.skills}
Job Description: {form_data.job_description or "Not provided"}

OPTIMIZATION:
Sector: {job_sector.upper()}
Keywords: Technical: {', '.join(key_keywords['technical_skills'][:5])}, Soft: {', '.join(key_keywords['soft_skills'][:5])}

TASKS:
1. Professional summary (3-4 sentences)
2. Work experience with quantifiable metrics
3. Organized skills by category
4. Extract company name and job title from job description

Output ONLY valid JSON:
{{
    "personal_details": {{
        "full_name": "string",
        "email": "string",
        "phone": "string",
        "linkedin_url": "string",
        "location": "string"
    }},
    "professional_summary": "string",
    "work_experience": [
        {{
            "job_title": "string",
            "company": "string",
            "start_date": "string",
            "end_date": "string",
            "is_current": boolean,
            "location": "string",
            "achievements": ["bullet point 1", "bullet point 2", "bullet point 3"]
        }}
    ],
    "education": [
        {{
            "degree": "string",
            "institution": "string",
            "start_date": "string",
            "end_date": "string",
            "grade": "string",
            "location": "string"
        }}
    ],
    "skills": {{
        "technical": ["skill1", "skill2"],
        "soft": ["skill1", "skill2"],
        "languages": ["language1", "language2"]
    }},
    "company_name": "string",
    "job_title": "string"
}}"""

    def _create_cover_letter_only_prompt(self, cv_data: dict, job_description: str, company_name: str = "") -> str:
        """Create AI prompt for cover letter generation only using CV context"""
        # Detect job sector for customization
        job_sector = self._detect_job_sector(job_description)
        # Detect work authorization status
        work_auth_statement = self._detect_work_authorization_status(
            cv_data.get('personal_details', {}), 
            job_description
        )
        # Extract company research insights
        company_research = self._extract_company_research_insights(
            job_description, 
            company_name or cv_data.get('company_name', '[Company Name]')
        )
        
        return f"""Expert Dublin cover letter writer. Generate professional cover letter using CV context.

CV CONTEXT:
Name: {cv_data.get('personal_details', {}).get('full_name', '')}
Summary: {cv_data.get('professional_summary', '')}
Experience: {cv_data.get('work_experience', [])}
Skills: {cv_data.get('skills', {})}

JOB CONTEXT:
Description: {job_description}
Company: {company_name or cv_data.get('company_name', '')}
Position: {cv_data.get('job_title', '')}

COVER LETTER BEST PRACTICES:
✓ DO: Start with qualifications relevant to the job opening
✓ DO: Show genuine interest in the field and company
✓ DO: Include company research and historical facts
✓ DO: Use varied sentence structures and openings
✓ DO: Be specific about achievements with metrics
✗ DON'T: Begin with your name (it's already on CV)
✗ DON'T: Repeat your CV content
✗ DON'T: Use repetitive sentence starters like "for"
✗ DON'T: Add references or justify previous job changes
✗ DON'T: Use clichés or generic phrases

CRITICAL SENTENCE STARTER RULES:
🚫 ABSOLUTELY FORBIDDEN: NEVER start sentences with "For" - this is unprofessional and repetitive
🚫 STRICTLY PROHIBITED: Avoid repetitive "I am", "My", "I have" openings
🚫 BANNED WORDS: Do not start sentences with: "For", "My", "I am", "I have", "I was", "I will"
✅ REQUIRED OPENINGS: Use varied professional openings like:
- "Having worked in..."
- "With my experience in..."
- "Through my role as..."
- "During my time at..."
- "As a professional with..."
- "Building on my background in..."
- "Given my expertise in..."
- "Leveraging my skills in..."
- "Based on my experience..."
- "Throughout my career..."

SENTENCE STARTER VALIDATION:
Before writing each sentence, check:
1. Does it start with "For"? → REWRITE IMMEDIATELY
2. Does it start with "I am/My/I have"? → REWRITE IMMEDIATELY
3. Is it similar to the previous sentence opener? → CHANGE IT
4. Does it sound professional and engaging? → IMPROVE IF NEEDED

COVER LETTER STRUCTURE (3-4 paragraphs):
1. OPENING: Outline what you offer that's directly relevant to the role. State the position and why you applied. Avoid rambling.

2. MIDDLE: Detail how your skills, experience and education make you ideal for the specific requirements. Include company research to show you've done homework.

3. FINAL: Thank reader for consideration and state you welcome interview opportunity.

WRITING STYLE REQUIREMENTS:
- Vary sentence openings (avoid starting multiple sentences with "for", "I am", "my")
- Use active voice and strong action verbs
- Include specific metrics and achievements
- Show personality and genuine interest
- Research the company and mention relevant details
- Balance professionalism with directness (Irish business culture)
- Ensure all sentences are complete and grammatically correct
- Avoid incomplete phrases or dangling words

SECTOR CONTEXT:
Sector: {job_sector.upper()}
Company Research: {company_research}

EXPECTED HTML OUTPUT FORMAT (NEVER USE "FOR" AT START):
<p>My experience in [relevant field] makes me well-suited for the [job_title] position at [company_name], as advertised on [platform]. [Brief self-identification and relevant background].</p>
<p>This role particularly interests me because [specific interest in company/role]. Having [academic background/qualifications] and [relevant experience], I am well-prepared for this position. [How your talents benefit the employer].</p>
<p>Having enclosed my CV with this application, I wish to highlight [relevant experience/achievements]. [Highlight 1-2 specific points that make you stand out for this role].</p>
<p>Thank you for considering my application. I would welcome the opportunity to discuss my qualifications further.</p>

CRITICAL EXAMPLES OF WHAT NOT TO DO:
❌ BAD: "For the Machine Vision Engineer position..."
❌ BAD: "For this exciting opportunity..."
❌ BAD: "For your consideration, I am..."
❌ BAD: "My qualifications make me ideal for..."
❌ BAD: "I am writing to apply for..."

✅ GOOD EXAMPLES:
✅ "Having reviewed the Machine Vision Engineer position..."
✅ "This exciting opportunity aligns perfectly with..."
✅ "Given my background in..."
✅ "With extensive experience in..."
✅ "As a professional specializing in..."

CRITICAL QUALITY REQUIREMENTS:
- NEVER start sentences with punctuation marks (., !, ?, etc.)
- NEVER end paragraphs with incomplete phrases or random words
- NEVER include fragments like "soon.", "at your earliest convenience.", "to hearing from you"
- Every sentence must be complete with subject, verb, and proper ending
- Final paragraph must end with a complete, professional closing statement

BEFORE OUTPUTTING JSON, REVIEW YOUR COVER LETTER:
1. Check that no sentence starts with punctuation
2. Check that no paragraph ends with incomplete phrases
3. Check that all sentences are grammatically complete
4. If you find any errors, FIX THEM before outputting

Output ONLY valid JSON:
{{
    "cover_letter_body": "string with proper paragraph spacing using \\n\\n between paragraphs",
    "generation_date": "{datetime.now().strftime('%B %d, %Y')}"
}}"""

    def _create_form_prompt(self, form_data: CVFormData) -> str:
        """Create AI prompt for form data processing"""
        # Extract company name from job description if available
        company_info = self._extract_company_info(form_data.job_description or "")
        # Detect job sector for customization
        job_sector = self._detect_job_sector(form_data.job_description or "")
        # Detect work authorization status
        work_auth_statement = self._detect_work_authorization_status(
            form_data.personal_details.model_dump(), 
            form_data.job_description or ""
        )
        # Extract company research insights
        company_research = self._extract_company_research_insights(
            form_data.job_description or "", 
            company_info.get('name', '[Company Name]')
        )
        # Extract key keywords for ATS optimization
        key_keywords = self._extract_key_keywords_from_job_description(form_data.job_description or "")
        
        return f"""Expert CV writer for Dublin/Irish job market. Transform form data into professional CV content.

DUBLIN REQUIREMENTS:
- 1-2 pages, reverse chronological
- Arial/Times New Roman 11-12pt
- Quantifiable achievements with metrics
- Irish phone format (+353)
- ATS-friendly formatting

FORM DATA:
Personal: {form_data.personal_details.model_dump()}
Experience: {[exp.model_dump() for exp in form_data.work_experience]}
Education: {[edu.model_dump() for edu in form_data.education]}
Skills: {form_data.skills}
Job Description: {form_data.job_description or "Not provided"}

COVER LETTER BEST PRACTICES:
✓ DO: Start with qualifications relevant to the job opening
✓ DO: Show genuine interest in the field and company
✓ DO: Include company research and historical facts
✓ DO: Use varied sentence structures and openings
✓ DO: Be specific about achievements with metrics
✗ DON'T: Begin with your name (it's already on CV)
✗ DON'T: Repeat your CV content
✗ DON'T: Use repetitive sentence starters like "for"
✗ DON'T: Add references or justify previous job changes
✗ DON'T: Use clichés or generic phrases

CRITICAL SENTENCE STARTER RULES:
❌ NEVER start sentences with "For" - this is unprofessional and repetitive
❌ Avoid repetitive "I am", "My", "I have" openings
✅ Use varied professional openings like:
- "Having worked in..."
- "With my experience in..."
- "Through my role as..."
- "During my time at..."
- "As a professional with..."
- "Building on my background in..."

COVER LETTER STRUCTURE (3-4 paragraphs):
1. OPENING: Outline what you offer that's directly relevant to the role. State the position and why you applied. Avoid rambling.
2. MIDDLE: Detail how your skills, experience and education make you ideal for the specific requirements. Include company research to show you've done homework.
3. FINAL: Thank reader for consideration and state you welcome interview opportunity.

WRITING STYLE REQUIREMENTS:
- Vary sentence openings (avoid starting multiple sentences with "for", "I am", "my")
- Use active voice and strong action verbs
- Include specific metrics and achievements
- Show personality and genuine interest
- Research the company and mention relevant details
- Balance professionalism with directness (Irish business culture)
- Ensure all sentences are complete and grammatically correct
- Avoid incomplete phrases or dangling words

SECTOR: {job_sector.upper()}
KEYWORDS: Technical: {', '.join(key_keywords['technical_skills'][:3])}, Soft: {', '.join(key_keywords['soft_skills'][:3])}

TASKS:
1. Professional summary (3-4 sentences)
2. Work experience with quantifiable metrics
3. Organized skills
4. Cover letter body following DCU's 4-paragraph structure

Output ONLY valid JSON in this exact format:
{{
    "personal_details": {{
        "full_name": "string",
        "email": "string",
        "phone": "string",
        "linkedin_url": "string",
        "location": "string"
    }},
    "professional_summary": "string",
    "work_experience": [
        {{
            "job_title": "string",
            "company": "string", 
            "start_date": "string",
            "end_date": "string",
            "is_current": boolean,
            "location": "string",
            "achievements": ["bullet point 1", "bullet point 2", "bullet point 3"]
        }}
    ],
    "education": [
        {{
            "degree": "string",
            "institution": "string",
            "start_date": "string", 
            "end_date": "string",
            "grade": "string",
            "location": "string"
        }}
    ],
    "skills": {{
        "technical": ["skill1", "skill2"],
        "soft": ["skill1", "skill2"],
        "languages": ["language1", "language2"]
    }},
    "cover_letter_body": "string",
    "company_name": "{company_info.get('name', '[Company Name]')}",
    "job_title": "{company_info.get('position', '')}"
}}"""
    
    def _create_update_prompt(self, cv_content: str, job_description: str) -> str:
        """Create AI prompt for CV updating"""
        # Extract company name from job description if available
        company_info = self._extract_company_info(job_description)
        # Detect job sector for customization
        job_sector = self._detect_job_sector(job_description)
        # Extract basic personal details from CV for work auth detection
        personal_details = self._extract_personal_details_from_cv(cv_content)
        # Detect work authorization status
        work_auth_statement = self._detect_work_authorization_status(personal_details, job_description)
        # Extract company research insights
        company_research = self._extract_company_research_insights(
            job_description, 
            company_info.get('name', '[Company Name]')
        )
        # Extract key keywords for ATS optimization
        key_keywords = self._extract_key_keywords_from_job_description(job_description)
        
        return f"""Expert CV optimizer for Dublin job market. Update CV to match job requirements.

CURRENT CV:
{cv_content}

JOB DESCRIPTION:
{job_description}

REQUIREMENTS:
- Use EXACT personal details from CV (especially email)
- Add quantifiable metrics to achievements  
- Include job keywords naturally
- Dublin format compliance
- Professional summary optimization

SECTOR: {job_sector.upper()}
KEYWORDS: {', '.join(key_keywords['technical_skills'][:3])}, {', '.join(key_keywords['soft_skills'][:3])}

TASKS:
1. Extract exact personal details
2. Create targeted summary
3. Optimize experience with metrics
4. Organize skills
5. Write cover letter body (3-4 well-structured paragraphs with natural opening, focused content, and confident closing)

COVER LETTER FORMATTING RULES (DCU STANDARD):
- Return content in clean HTML paragraph format: <p>paragraph content</p>
- DO NOT include any salutation (Dear...) - template handles this
- DO NOT include closing phrases (Sincerely, Best regards, etc.) - template handles this
- Follow DCU's 4-paragraph structure exactly
- Each paragraph should be 3-4 sentences with clear focus
- ENSURE all sentences are complete and properly finished

CRITICAL SENTENCE STARTER RULES:
❌ NEVER start sentences with "For" - this is unprofessional and repetitive
❌ Avoid repetitive "I am", "My", "I have" openings
✅ Use varied professional openings like:
- "Having worked in..."
- "With my experience in..."
- "Through my role as..."
- "During my time at..."
- "As a professional with..."
- "Building on my background in..."

DCU COVER LETTER STRUCTURE:
1. OPENING PARAGRAPH: Identify yourself, state the position you're applying for, and mention where you learned about the vacancy (online job board, company website, etc.)

2. INTEREST PARAGRAPH: Explain why you are interested in this work and this organisation. Briefly mention your academic background, relevant qualifications, and related work experience that qualify you for the position. Summarise your talents and how they might benefit the employer.

3. CV REFERENCE PARAGRAPH: Refer to the fact that you have enclosed your CV, and draw attention to any further points of relevance to your application. Highlight specific achievements or skills that make you stand out.

4. CLOSING PARAGRAPH: Reiterate your interest and indicate your availability for interview. Close with a confident statement that encourages a positive response.

EXPECTED HTML OUTPUT FORMAT:
<p>I am writing to apply for the [job_title] position at [company_name], as advertised on [platform]. [Brief self-identification and relevant background].</p>
<p>I am particularly interested in this role because [specific interest in company/role]. My [academic background/qualifications] and [relevant experience] have prepared me well for this position. [How your talents benefit the employer].</p>
<p>I have enclosed my CV for your consideration, which provides further details of my [relevant experience/achievements]. [Highlight 1-2 specific points that make you stand out for this role].</p>
<p>I would welcome the opportunity to discuss my application further and am available for interview at your convenience. I look forward to hearing from you.</p>

Output ONLY valid JSON in this exact format:
{{
    "personal_details": {{
        "full_name": "string",
        "email": "string", 
        "phone": "string",
        "linkedin_url": "string",
        "location": "string"
    }},
    "professional_summary": "string",
    "work_experience": [
        {{
            "job_title": "string",
            "company": "string",
            "start_date": "string", 
            "end_date": "string",
            "is_current": boolean,
            "location": "string",
            "achievements": ["bullet point 1", "bullet point 2", "bullet point 3"]
        }}
    ],
    "education": [
        {{
            "degree": "string",
            "institution": "string",
            "start_date": "string",
            "end_date": "string", 
            "grade": "string",
            "location": "string"
        }}
    ],
    "skills": {{
        "technical": ["skill1", "skill2"],
        "soft": ["skill1", "skill2"], 
        "languages": ["language1", "language2"]
    }},
    "cover_letter_body": "string",
    "company_name": "{company_info.get('name', '[Company Name]')}",
    "job_title": "{company_info.get('position', '')}"
}}"""
    
    def _extract_company_info(self, job_description: str) -> Dict[str, str]:
        """Extract company name and position from job description"""
        import re
        
        if not job_description:
            return {"name": "Atrium EMEA", "position": "Python Developer"}
        
        # Clean job description for better extraction
        cleaned_desc = re.sub(r'\n+', ' ', job_description)
        cleaned_desc = re.sub(r'\s+', ' ', cleaned_desc)
        
        # Enhanced patterns for company names - more specific and restrictive
        company_patterns = [
            # Direct company mentions
            r"(?:at|with|for|join)\s+([A-Z][a-zA-Z\s&.,'-]+?)(?:\s+(?:is|as|in|on|for|,)|\.|$)",
            r"Company:\s*([A-Z][a-zA-Z\s&.,'-]+?)(?:\n|$|\|)",
            r"Organization:\s*([A-Z][a-zA-Z\s&.,'-]+?)(?:\n|$|\|)",
            r"Client:\s*([A-Z][a-zA-Z\s&.,'-]+?)(?:\n|$|\|)",
            # Specific Dublin companies
            r"\b(Atrium EMEA|Google|Microsoft|Facebook|Meta|LinkedIn|Amazon|Apple|Stripe|Accenture|Deloitte|PwC|KPMG|Bank of Ireland|AIB|Pfizer|Johnson & Johnson|Medtronic)\b",
        ]
        
        # Enhanced patterns for job titles - more restrictive
        position_patterns = [
            r"Position:\s*([A-Za-z\s&/-]+?)(?:\n|$|\|)",
            r"Role:\s*([A-Za-z\s&/-]+?)(?:\n|$|\|)",
            r"Job Title:\s*([A-Za-z\s&/-]+?)(?:\n|$|\|)",
            r"Title:\s*([A-Za-z\s&/-]+?)(?:\n|$|\|)",
            # Look for specific role patterns
            r"(?:for|as)\s+(?:a|an)\s+([A-Za-z\s&/-]+?)(?:\s+(?:with|at|in|to)|$)",
            r"(?:seeking|hiring)\s+(?:a|an)\s+([A-Za-z\s&/-]+?)(?:\s+(?:with|at|in|to)|$)",
            # Common job titles
            r"\b(Python Developer|Software Engineer|Full Stack Developer|Backend Developer|Frontend Developer|Data Scientist|Product Manager|Business Analyst)\b",
        ]
        
        company_name = "Atrium EMEA"  # Default fallback
        position_title = "Python Developer"  # Default fallback
        
        # Try to extract company name with validation
        for pattern in company_patterns:
            match = re.search(pattern, job_description, re.IGNORECASE)
            if match:
                candidate = match.group(1).strip()
                # Validate company name - should be reasonable length and format
                if 2 <= len(candidate) <= 50 and not any(word in candidate.lower() for word in [
                    'developer', 'engineer', 'manager', 'analyst', 'specialist', 'consultant',
                    'coordinator', 'assistant', 'intern', 'senior', 'junior', 'lead',
                    'the', 'and', 'or', 'but', 'if', 'to', 'in', 'on', 'at', 'by'
                ]):
                    company_name = candidate
                    break
        
        # Try to extract position title with validation
        for pattern in position_patterns:
            match = re.search(pattern, job_description, re.IGNORECASE)
            if match:
                candidate = match.group(1).strip()
                # Validate job title - should be reasonable and contain job-related terms
                if 5 <= len(candidate) <= 80 and any(word in candidate.lower() for word in [
                    'developer', 'engineer', 'manager', 'analyst', 'specialist', 'consultant',
                    'coordinator', 'assistant', 'director', 'lead', 'senior', 'junior',
                    'scientist', 'architect', 'designer', 'admin', 'officer'
                ]):
                    position_title = candidate
                    break
        
        # Clean up extracted values
        company_name = re.sub(r'[.,]+$', '', company_name).strip()
        position_title = re.sub(r'[.,]+$', '', position_title).strip()
        
        return {"name": company_name, "position": position_title}
    
    def _detect_job_sector(self, job_description: str) -> str:
        """Detect job sector from job description for Dublin-specific customization"""
        if not job_description:
            return "general"
        
        job_desc_lower = job_description.lower()
        
        # Technology sector keywords
        tech_keywords = [
            'software', 'developer', 'programming', 'javascript', 'python', 'java', 'react', 'angular',
            'nodejs', 'vue', 'typescript', 'kubernetes', 'docker', 'aws', 'azure', 'devops',
            'frontend', 'backend', 'fullstack', 'mobile app', 'ios', 'android', 'machine learning',
            'ai', 'artificial intelligence', 'data science', 'cloud', 'api', 'microservices',
            'agile', 'scrum', 'startup', 'fintech', 'silicon docks', 'tech hub'
        ]
        
        # Finance sector keywords  
        finance_keywords = [
            'finance', 'banking', 'investment', 'trading', 'risk management', 'compliance',
            'ifsc', 'financial services', 'funds', 'asset management', 'derivatives',
            'regulatory', 'mifid', 'gdpr', 'aml', 'kyc', 'basel', 'accounting', 'audit',
            'cfa', 'frm', 'treasury', 'capital markets', 'hedge fund', 'private equity'
        ]
        
        # Healthcare sector keywords
        healthcare_keywords = [
            'healthcare', 'medical', 'nurse', 'doctor', 'clinical', 'patient', 'hospital',
            'hse', 'health service executive', 'pharmaceutical', 'medical device',
            'clinical research', 'biomedical', 'therapy', 'diagnostic', 'surgery',
            'pharmacy', 'nursing', 'physiotherapy', 'mental health', 'public health'
        ]
        
        # Sales & Marketing keywords
        sales_keywords = [
            'sales', 'marketing', 'business development', 'account management', 'crm',
            'salesforce', 'hubspot', 'lead generation', 'digital marketing', 'seo',
            'social media', 'content marketing', 'brand management', 'customer success',
            'revenue', 'targets', 'b2b', 'b2c', 'partnership', 'channel sales'
        ]
        
        # Count keyword matches
        tech_count = sum(1 for keyword in tech_keywords if keyword in job_desc_lower)
        finance_count = sum(1 for keyword in finance_keywords if keyword in job_desc_lower)
        healthcare_count = sum(1 for keyword in healthcare_keywords if keyword in job_desc_lower)
        sales_count = sum(1 for keyword in sales_keywords if keyword in job_desc_lower)
        
        # Determine sector based on highest count
        sector_counts = {
            'technology': tech_count,
            'finance': finance_count,
            'healthcare': healthcare_count,
            'sales_marketing': sales_count
        }
        
        detected_sector = max(sector_counts, key=sector_counts.get)
        
        # Return sector only if there are at least 2 keyword matches
        if sector_counts[detected_sector] >= 2:
            return detected_sector
        else:
            return "general"
    
    def _extract_personal_details_from_cv(self, cv_content: str) -> Dict[str, str]:
        """Extract basic personal details from CV text for work authorization detection"""
        import re
        
        personal_details = {
            'location': '',
            'email': ''
        }
        
        # Extract email address
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email_match = re.search(email_pattern, cv_content)
        if email_match:
            personal_details['email'] = email_match.group()
        
        # Extract location - look for common location patterns
        location_patterns = [
            r'Address:?\s*([^\n]+)',
            r'Location:?\s*([^\n]+)',
            r'Based in\s*([^\n]+)',
            r'\b([A-Za-z\s]+,\s*[A-Za-z\s]+)\b',  # City, Country format
        ]
        
        for pattern in location_patterns:
            location_match = re.search(pattern, cv_content, re.IGNORECASE)
            if location_match:
                location = location_match.group(1).strip()
                # Filter out common non-location text
                if len(location) > 3 and not any(word in location.lower() for word in ['phone', 'email', 'linkedin', 'experience', 'education']):
                    personal_details['location'] = location
                    break
        
        return personal_details
    
    def _extract_company_research_insights(self, job_description: str, company_name: str) -> str:
        """Extract company research insights from job description for personalized cover letters"""
        import re
        
        if not job_description or company_name == "[Company Name]":
            return ""
        
        insights = []
        job_desc_lower = job_description.lower()
        company_lower = company_name.lower()
        
        # Dublin-specific company insights
        dublin_insights = {
            'google': "Google Dublin serves as the European headquarters and is a major tech hub in Silicon Docks",
            'facebook': "Facebook Dublin is the international headquarters for Europe, Middle East, and Africa",
            'meta': "Meta Dublin is the international headquarters for Europe, Middle East, and Africa", 
            'microsoft': "Microsoft Ireland has been operating in Dublin since 1991 and serves as the European operations center",
            'linkedin': "LinkedIn Dublin serves as the international headquarters outside the US",
            'amazon': "Amazon has significant operations in Dublin including AWS European headquarters",
            'apple': "Apple's Cork operations complement Dublin's growing tech ecosystem",
            'stripe': "Stripe's Dublin headquarters serves as the European hub for online payments",
            'accenture': "Accenture Dublin is a major consulting hub serving clients across Europe",
            'deloitte': "Deloitte Ireland provides services across the EMEA region from Dublin",
            'pwc': "PwC Ireland is a leading professional services firm in Dublin's financial district",
            'kpmg': "KPMG Ireland serves major multinational clients from Dublin's IFSC",
            'bank of ireland': "Bank of Ireland is one of Ireland's oldest and largest financial institutions",
            'aib': "Allied Irish Banks is a major pillar bank serving the Irish market",
            'pfizer': "Pfizer Ireland operates major manufacturing and research facilities",
            'johnson & johnson': "J&J has significant pharmaceutical operations in Ireland",
            'medtronic': "Medtronic Ireland is a major medical device manufacturer",
        }
        
        # Check for specific company insights
        for company_key, insight in dublin_insights.items():
            if company_key in company_lower:
                insights.append(f"Company Research: {insight}")
                break
        
        # Extract business focus areas
        business_focuses = []
        focus_patterns = {
            'innovation': r'\b(innovation|innovative|cutting-edge|pioneering)\b',
            'growth': r'\b(growth|expansion|scaling|growing)\b',
            'digital transformation': r'\b(digital\s+transformation|digitalization|digital\s+innovation)\b',
            'sustainability': r'\b(sustainability|sustainable|green|environmental)\b',
            'customer experience': r'\b(customer\s+experience|customer\s+satisfaction|user\s+experience)\b',
            'global operations': r'\b(global|international|worldwide|multinational)\b',
            'market leadership': r'\b(market\s+leader|industry\s+leader|leading\s+provider)\b',
        }
        
        for focus_area, pattern in focus_patterns.items():
            if re.search(pattern, job_desc_lower):
                business_focuses.append(focus_area)
        
        if business_focuses:
            insights.append(f"Business Focus: The company emphasizes {', '.join(business_focuses[:3])}")
        
        # Extract company values/culture mentions
        culture_keywords = {
            'collaboration': r'\b(collaborative|teamwork|cross-functional)\b',
            'diversity': r'\b(diversity|inclusive|inclusion)\b',
            'excellence': r'\b(excellence|quality|best-in-class)\b',
            'agility': r'\b(agile|agility|fast-paced|dynamic)\b',
            'impact': r'\b(impact|meaningful|purpose)\b',
        }
        
        culture_values = []
        for value, pattern in culture_keywords.items():
            if re.search(pattern, job_desc_lower):
                culture_values.append(value)
        
        if culture_values:
            insights.append(f"Company Culture: Values {', '.join(culture_values[:2])}")
        
        # Extract recent developments or initiatives
        development_patterns = [
            r'recently\s+launched\s+([^.]+)',
            r'new\s+initiative\s+([^.]+)',
            r'expanding\s+([^.]+)',
            r'partnering\s+with\s+([^.]+)',
        ]
        
        for pattern in development_patterns:
            match = re.search(pattern, job_desc_lower)
            if match:
                insights.append(f"Recent Development: {match.group(1).strip()}")
                break
        
        # Combine insights into a research statement
        if insights:
            return " | ".join(insights[:3])  # Limit to top 3 insights
        else:
            return f"Research shows {company_name} is a key player in Dublin's business ecosystem"
    
    def _extract_key_keywords_from_job_description(self, job_description: str) -> Dict[str, list]:
        """Extract and categorize key keywords from job description for ATS optimization"""
        import re
        from collections import Counter
        
        if not job_description:
            return {"technical_skills": [], "soft_skills": [], "requirements": [], "action_verbs": []}
        
        job_desc_lower = job_description.lower()
        
        # Technical skills patterns
        technical_patterns = {
            # Programming languages
            'programming': r'\b(python|java|javascript|typescript|react|angular|vue|nodejs|php|ruby|go|rust|swift|kotlin|c\+\+|c#|sql|html|css)\b',
            
            # Tools and frameworks
            'tools': r'\b(docker|kubernetes|aws|azure|gcp|jenkins|git|jira|confluence|slack|figma|adobe|salesforce|hubspot|tableau)\b',
            
            # Methodologies
            'methodologies': r'\b(agile|scrum|kanban|devops|ci/cd|tdd|bdd|mvp|lean|six\s+sigma)\b',
            
            # Databases
            'databases': r'\b(mysql|postgresql|mongodb|redis|elasticsearch|oracle|sql\s+server)\b',
            
            # Certifications
            'certifications': r'\b(aws\s+certified|azure\s+certified|google\s+cloud|pmp|cissp|cfa|frm|acca)\b',
        }
        
        # Soft skills patterns
        soft_skills_patterns = r'\b(leadership|communication|problem[- ]solving|analytical|creative|adaptable|collaborative|time\s+management|project\s+management|stakeholder\s+management|presentation|negotiation|mentoring|coaching)\b'
        
        # Requirements patterns
        requirements_patterns = r'\b(\d+\+?\s+years?\s+experience|bachelor|master|phd|degree|diploma|certification|fluent|native|proficient)\b'
        
        # Action verbs patterns
        action_verbs_patterns = r'\b(develop|build|create|design|implement|manage|lead|coordinate|analyze|optimize|improve|deliver|execute|collaborate|support|maintain|troubleshoot|resolve|innovate|transform|scale)\b'
        
        # Extract technical skills
        technical_skills = set()
        for category, pattern in technical_patterns.items():
            matches = re.findall(pattern, job_desc_lower)
            technical_skills.update(matches)
        
        # Extract other categories
        soft_skills = set(re.findall(soft_skills_patterns, job_desc_lower))
        requirements = set(re.findall(requirements_patterns, job_desc_lower))
        action_verbs = set(re.findall(action_verbs_patterns, job_desc_lower))
        
        # Clean and prioritize by frequency
        word_freq = Counter(job_desc_lower.split())
        
        def prioritize_keywords(keywords_set):
            keywords_list = list(keywords_set)
            # Sort by frequency in job description
            return sorted(keywords_list, key=lambda x: word_freq.get(x, 0), reverse=True)[:10]  # Top 10
        
        return {
            "technical_skills": prioritize_keywords(technical_skills),
            "soft_skills": prioritize_keywords(soft_skills),
            "requirements": prioritize_keywords(requirements),
            "action_verbs": prioritize_keywords(action_verbs)
        }
    
    def _highlight_metrics_in_text(self, text: str) -> str:
        """Add HTML highlighting to numerical metrics in achievement text"""
        import re
        
        # Percentage patterns
        percentage_pattern = r'\b(\d+(?:\.\d+)?%)\b'
        text = re.sub(percentage_pattern, r'<span class="percentage-highlight">\1</span>', text)
        
        # Currency patterns (EUR, USD, GBP)
        currency_pattern = r'\b(€\d{1,3}(?:,\d{3})*(?:\.\d{2})?[KMB]?|\$\d{1,3}(?:,\d{3})*(?:\.\d{2})?[KMB]?|£\d{1,3}(?:,\d{3})*(?:\.\d{2})?[KMB]?)\b'
        text = re.sub(currency_pattern, r'<span class="currency-highlight">\1</span>', text)
        
        # Number patterns (with context)
        number_patterns = [
            r'\b(\d{1,3}(?:,\d{3})*)\s+(users|customers|clients|employees|projects|sales|leads|applications)\b',
            r'\b(increased|improved|reduced|saved|generated|achieved|exceeded)\s+.*?(\d+(?:\.\d+)?%|\d{1,3}(?:,\d{3})*)\b',
            r'\b(\d+(?:\.\d+)?x)\s+(growth|increase|improvement|faster|better)\b',
            r'\b(\d{1,2})\s+(months?|years?|weeks?|days?)\b',
        ]
        
        for pattern in number_patterns:
            def replace_metrics(m):
                metric_pattern = r'[\d.,]+[%xKMB]?$'
                matches = [g for g in m.groups() if g and re.match(metric_pattern, g)]
                if matches:
                    return m.group(0).replace(matches[0], f'<span class="metric-highlight">{matches[0]}</span>')
                return m.group(0)
            
            text = re.sub(pattern, replace_metrics, text, flags=re.IGNORECASE)
        
        # Simple number highlighting for standalone metrics
        standalone_metrics = r'\b(\d{1,3}(?:,\d{3})*)\b(?=\s+(?:users|customers|clients|employees|projects|sales|leads|applications|hours|days|weeks|months|years))'
        text = re.sub(standalone_metrics, r'<span class="metric-highlight">\1</span>', text)
        
        return text
    
    def _extract_key_achievements(self, work_experience: list) -> list:
        """Extract key quantifiable achievements for highlighting"""
        key_achievements = []
        
        for exp in work_experience:
            achievements = exp.get('achievements', [])
            for achievement in achievements:
                # Look for quantifiable achievements
                if any(keyword in achievement.lower() for keyword in [
                    '%', 'increased', 'improved', 'reduced', 'saved', 'generated', 
                    'achieved', 'exceeded', '€', '$', '£', 'million', 'thousand',
                    'users', 'customers', 'clients', 'revenue', 'profit', 'cost'
                ]):
                    key_achievements.append({
                        'company': exp.get('company', ''),
                        'achievement': achievement
                    })
        
        return key_achievements[:3]  # Top 3 achievements
    
    def _validate_dublin_format_compliance(self, cv_data: Dict[str, Any]) -> Dict[str, list]:
        """Validate CV compliance with Dublin formatting standards"""
        validation_errors = []
        validation_warnings = []
        
        # Check personal details formatting
        personal_details = cv_data.get('personal_details', {})
        
        # Phone number validation (Irish format)
        phone = personal_details.get('phone', '')
        if phone and not phone.startswith('+353'):
            validation_warnings.append("Phone number should use Irish format (+353)")
        
        # Email validation
        email = personal_details.get('email', '')
        if email:
            import re
            if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
                validation_errors.append("Invalid email format")
            if any(word in email.lower() for word in ['hotmail', 'yahoo', 'gmail']):
                validation_warnings.append("Consider using a professional email domain")
        
        # Location validation
        location = personal_details.get('location', '')
        if location and 'dublin' not in location.lower() and 'ireland' not in location.lower():
            validation_warnings.append("Consider mentioning Dublin or Ireland in location for local appeal")
        
        # Work experience validation
        work_experience = cv_data.get('work_experience', [])
        for i, exp in enumerate(work_experience):
            # Check for quantifiable achievements
            achievements = exp.get('achievements', [])
            quantifiable_count = 0
            for achievement in achievements:
                if any(char in achievement for char in ['%', '€', '$', '£']) or \
                   any(word in achievement.lower() for word in ['increased', 'reduced', 'improved', 'managed', 'led']):
                    quantifiable_count += 1
            
            if quantifiable_count == 0:
                validation_warnings.append(f"Experience at {exp.get('company', 'Unknown')} lacks quantifiable achievements")
            
            # Check achievement length
            for achievement in achievements:
                if len(achievement) > 150:
                    validation_warnings.append(f"Achievement at {exp.get('company', 'Unknown')} is too long (>150 chars)")
        
        # Professional summary validation
        professional_summary = cv_data.get('professional_summary', '')
        if professional_summary:
            if len(professional_summary) < 100:
                validation_warnings.append("Professional summary is too short (aim for 100-200 words)")
            elif len(professional_summary) > 300:
                validation_warnings.append("Professional summary is too long (aim for 100-200 words)")
        
        # Skills validation
        skills = cv_data.get('skills', {})
        total_skills = sum(len(skill_list) for skill_list in skills.values() if skill_list)
        if total_skills < 5:
            validation_warnings.append("Consider adding more relevant skills (minimum 5-8 skills recommended)")
        elif total_skills > 20:
            validation_warnings.append("Too many skills listed - focus on most relevant ones (maximum 15-20)")
        
        # Cover letter validation
        cover_letter_body = cv_data.get('cover_letter_body', '')
        if cover_letter_body:
            if len(cover_letter_body) < 800:
                validation_warnings.append("Cover letter is too short for Dublin standards (aim for 800-1500 chars)")
            elif len(cover_letter_body) > 2000:
                validation_warnings.append("Cover letter is too long for Dublin standards (maximum 2000 chars)")
        
        return {
            'errors': validation_errors,
            'warnings': validation_warnings
        }
    
    def _get_sector_specific_requirements(self, sector: str) -> str:
        """Get sector-specific cover letter requirements for Dublin market"""
        
        requirements = {
            "technology": """
TECHNOLOGY SECTOR (Dublin Silicon Docks Focus):
- Mention Dublin's position as Europe's tech hub
- Reference specific technologies from job description
- Highlight agile/scrum methodologies experience
- Show understanding of startup culture vs enterprise environment
- Include GitHub/portfolio links if relevant
- Emphasize continuous learning and skill development
- Mention contribution to tech community (meetups, conferences)
- Show familiarity with Dublin tech companies (Google, Facebook, Airbnb, etc.)
- Demonstrate problem-solving abilities with concrete examples
- Include remote work and collaboration tool experience
            """,
            
            "finance": """
FINANCE SECTOR (IFSC Dublin Focus):
- Reference Dublin's International Financial Services Centre (IFSC)
- Show understanding of European financial regulations (MiFID II, GDPR, BASEL)
- Highlight risk management and compliance experience
- Mention experience with financial systems and platforms
- Show multicultural communication skills (key for Dublin's international finance hub)
- Include relevant certifications (CFA, FRM, ACCA, etc.)
- Demonstrate quantitative analysis skills
- Show understanding of Ireland's role in global finance
- Mention experience with regulatory reporting
- Highlight client relationship management in international context
            """,
            
            "healthcare": """
HEALTHCARE SECTOR (HSE Ireland Focus):
- Show understanding of Irish Health Service Executive (HSE) system
- Mention experience with Irish healthcare standards and protocols
- Highlight patient-centered care approach
- Show multicultural competence (Dublin's diverse patient population)
- Include relevant professional registrations (NMBI, Medical Council, etc.)
- Demonstrate understanding of Irish healthcare challenges
- Show commitment to continuous professional development
- Mention experience with healthcare IT systems
- Highlight teamwork in multidisciplinary settings
- Show awareness of current healthcare reforms in Ireland
            """,
            
            "sales_marketing": """
SALES & MARKETING SECTOR (Dublin Market Focus):
- Show understanding of Irish consumer behavior and market dynamics
- Highlight experience with both B2B and B2C approaches
- Mention familiarity with Dublin business districts and networking
- Show digital marketing expertise (essential in Dublin's competitive market)
- Include CRM experience (Salesforce, HubSpot, etc.)
- Demonstrate understanding of GDPR implications for marketing
- Show multicultural marketing experience (Dublin's diverse demographics)
- Highlight measurable results and ROI achievements
- Mention experience with Irish media and advertising landscape
- Show relationship-building skills crucial for Irish business culture
            """,
            
            "general": """
GENERAL SECTOR REQUIREMENTS:
- Demonstrate cultural fit with Irish business environment
- Show adaptability and multicultural competence
- Highlight transferable skills relevant to Dublin job market
- Demonstrate understanding of Irish work culture and values
- Show commitment to professional development
- Include any relevant Irish qualifications or training
- Mention networking and relationship-building abilities
- Show flexibility and problem-solving skills
            """
        }
        
        return requirements.get(sector, requirements["general"])
    
    def _parse_cv_only_response(self, response: str) -> Dict[str, Any]:
        """Parse and validate CV-only AI response"""
        try:
            # Try to extract JSON from response
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No valid JSON found in CV response")
            
            json_str = response[start_idx:end_idx]
            data = json.loads(json_str)
            
            # Validate required CV fields
            required_fields = [
                "personal_details", "professional_summary", 
                "work_experience", "education", "skills"
            ]
            
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required CV field: {field}")
            
            # Set default values for new fields if missing
            if "company_name" not in data:
                data["company_name"] = "[Company Name]"
            if "job_title" not in data:
                data["job_title"] = ""
            
            return data
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in CV AI response: {str(e)}")
        except Exception as e:
            raise ValueError(f"Failed to parse CV AI response: {str(e)}")
    
    def _parse_cover_letter_response(self, response: str) -> Dict[str, Any]:
        """Parse and validate cover letter AI response"""
        import re
        
        try:
            # Try to extract JSON from response
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No valid JSON found in cover letter response")
            
            json_str = response[start_idx:end_idx]
            data = json.loads(json_str)
            
            # Validate required cover letter fields
            if "cover_letter_body" not in data:
                raise ValueError("Missing cover_letter_body in response")
            
            # Clean placeholder text and clichés
            data["cover_letter_body"] = self._clean_placeholder_text(data["cover_letter_body"])
            data["cover_letter_body"] = self._detect_and_remove_cliches(data["cover_letter_body"])
            data["cover_letter_body"] = self._fix_grammar_issues(data["cover_letter_body"])
            
            # Additional cover letter specific cleaning
            cover_letter_body = data["cover_letter_body"]
            
            # Remove salutation and closing phrases that AI might add despite instructions
            salutation_patterns = [
                r'^Dear\s+[^,\n]*,?\s*',
                r'^To\s+Whom\s+It\s+May\s+Concern,?\s*',
                r'^Hello\s+[^,\n]*,?\s*'
            ]
            
            closing_patterns = [
                r'\s*Sincerely,?\s*$',
                r'\s*Best\s+regards,?\s*$',
                r'\s*Kind\s+regards,?\s*$',
                r'\s*Yours\s+faithfully,?\s*$',
                r'\s*Yours\s+sincerely,?\s*$'
            ]
            
            # Remove salutations
            for pattern in salutation_patterns:
                cover_letter_body = re.sub(pattern, '', cover_letter_body, flags=re.IGNORECASE | re.MULTILINE)
            
            # Remove closings
            for pattern in closing_patterns:
                cover_letter_body = re.sub(pattern, '', cover_letter_body, flags=re.IGNORECASE | re.MULTILINE)
            
            # Ensure proper paragraph spacing
            cover_letter_body = re.sub(r'\n\s*\n\s*\n+', '\n\n', cover_letter_body)  # Multiple line breaks to double
            cover_letter_body = re.sub(r'^\s+|\s+$', '', cover_letter_body)  # Remove leading/trailing whitespace
            
            # Fix common repetitive phrases and "for" starters
            cover_letter_body = re.sub(r'I am writing to apply for', 'My experience makes me well-suited for', cover_letter_body, flags=re.IGNORECASE)
            cover_letter_body = re.sub(r'I am writing to express my interest in', 'My background aligns perfectly with', cover_letter_body, flags=re.IGNORECASE)
            
            # Fix sentences starting with "for" - most common issue
            cover_letter_body = re.sub(r'(<p>|^|\. )for the ([A-Z][^.]*?position)', r'\1Regarding the \2position', cover_letter_body, flags=re.IGNORECASE)
            cover_letter_body = re.sub(r'(<p>|^|\. )for this ([A-Z][^.]*?role)', r'\1Concerning this \2role', cover_letter_body, flags=re.IGNORECASE)
            cover_letter_body = re.sub(r'(<p>|^|\. )for ([A-Z][^.]*?,)', r'\1Regarding \2,', cover_letter_body, flags=re.IGNORECASE)
            
            # Fix repetitive "I am" patterns
            cover_letter_body = re.sub(r'(<p>|^|\. )I am ([^.]*?) and I am', r'\1I am \2, and have been', cover_letter_body, flags=re.IGNORECASE)
            cover_letter_body = re.sub(r'(<p>|^|\. )I am particularly', r'\1This role particularly', cover_letter_body, flags=re.IGNORECASE)
            
            # Fix "My" starters when overused
            cover_letter_body = re.sub(r'(<p>|^|\. )My ([^.]*?) and my ([^.]*?)', r'\1With my \2 and \3', cover_letter_body, flags=re.IGNORECASE)
            
            data["cover_letter_body"] = cover_letter_body
            
            # Set generation date if missing
            if "generation_date" not in data:
                data["generation_date"] = datetime.now().strftime("%B %d, %Y")
            
            return data
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in cover letter AI response: {str(e)}")
        except Exception as e:
            raise ValueError(f"Failed to parse cover letter AI response: {str(e)}")

    def _parse_ai_response(self, response: str) -> Dict[str, Any]:
        """Parse and validate AI response"""
        try:
            # Try to extract JSON from response
            start_idx = response.find('{')
            end_idx = response.rfind('}') + 1
            
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No valid JSON found in response")
            
            json_str = response[start_idx:end_idx]
            data = json.loads(json_str)
            
            # Validate required fields
            required_fields = [
                "personal_details", "professional_summary", 
                "work_experience", "education", "skills", "cover_letter_body"
            ]
            
            for field in required_fields:
                if field not in data:
                    raise ValueError(f"Missing required field: {field}")
            
            # Set default values for new fields if missing
            if "company_name" not in data:
                data["company_name"] = "[Company Name]"
            if "job_title" not in data:
                data["job_title"] = ""
            
            # Clean placeholder text and clichés from cover letter body
            if "cover_letter_body" in data:
                data["cover_letter_body"] = self._clean_placeholder_text(data["cover_letter_body"])
                data["cover_letter_body"] = self._detect_and_remove_cliches(data["cover_letter_body"])
            
            # Validate Dublin format compliance
            validation_results = self._validate_dublin_format_compliance(data)
            data["validation_results"] = validation_results
            
            # Log validation warnings for improvement
            if validation_results.get('warnings'):
                print(f"Dublin format warnings: {validation_results['warnings']}")
            
            return data
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in AI response: {str(e)}")
        except Exception as e:
            raise ValueError(f"Failed to parse AI response: {str(e)}")
    
    def _clean_placeholder_text(self, text: str) -> str:
        """Remove placeholder text in square brackets"""
        import re
        
        # Remove placeholder text patterns
        placeholder_patterns = [
            r'\[Platform where you saw the advert\]',
            r'\[platform where you saw the advert\]',
            r'\[Platform Where You Saw The Advert\]',
            r'\[Company Name\]',
            r'\[company name\]',
            r'\[Job Title\]',
            r'\[job title\]',
            r'\[.*?\]',  # Generic catch-all for any text in square brackets
        ]
        
        cleaned_text = text
        for pattern in placeholder_patterns:
            cleaned_text = re.sub(pattern, '', cleaned_text, flags=re.IGNORECASE)
        
        # Clean up extra spaces and newlines left by removal
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text)  # Multiple spaces to single space
        cleaned_text = re.sub(r'\n\s*\n', '\n\n', cleaned_text)  # Clean up paragraph breaks
        cleaned_text = cleaned_text.strip()
        
        return cleaned_text
    
    def _fix_grammar_issues(self, text: str) -> str:
        """Fix common grammar issues in cover letters"""
        import re
        
        # Fix sentences starting with punctuation
        text = re.sub(r'<p>\s*\.\s*', '<p>', text)
        text = re.sub(r'<p>\s*,\s*', '<p>', text)
        text = re.sub(r'<p>\s*;\s*', '<p>', text)
        
        # Fix incomplete phrases at end of paragraphs
        text = re.sub(r'\.\s+at\s+your\s+earliest\s+convenience\.\s*</p>', '.</p>', text, flags=re.IGNORECASE)
        text = re.sub(r'\.\s+soon\.\s*</p>', '.</p>', text, flags=re.IGNORECASE)
        text = re.sub(r'\.\s+to\s+hearing\s+from\s+you\s*\.\s*</p>', '.</p>', text, flags=re.IGNORECASE)
        text = re.sub(r'\.\s+and\s+look\s+forward\s+to\s+hearing\s+from\s+you\s*\.\s*</p>', '.</p>', text, flags=re.IGNORECASE)
        
        # Fix incomplete sentences
        text = re.sub(r'\.\s+my\s+qualifications\s+further\s+and\s+am\s+available\s+for\s+an\s+interview\s+at\s+your\s+earliest\s+convenience\.\s*</p>', '. I would welcome the opportunity to discuss my qualifications further.</p>', text, flags=re.IGNORECASE)
        
        # Fix double spaces
        text = re.sub(r'\s+', ' ', text)
        
        return text
    
    def _detect_and_remove_cliches(self, text: str) -> str:
        """Detect and remove clichéd expressions from cover letter content"""
        import re
        
        # Define clichéd expressions common in cover letters
        cliche_patterns = [
            # Generic team player phrases
            r'\bi\s+am\s+a\s+team\s+player\b',
            r'\bteam\s+player\b(?!\s+with\s+proven)',
            r'\bplays\s+well\s+with\s+others\b',
            
            # Vague work ethic claims
            r'\bi\s+am\s+hardworking\b(?!\s+with)',
            r'\bhard\s+working\b(?!\s+with)',
            r'\bi\s+work\s+hard\b(?!\s+to)',
            
            # Generic detail phrases
            r'\bdetail\s+oriented\b(?!\s+with)',
            r'\battention\s+to\s+detail\b(?!\s+has)',
            r'\bpay\s+attention\s+to\s+detail\b',
            
            # Overused communication phrases
            r'\bexcellent\s+communication\s+skills\b(?!\s+demonstrated)',
            r'\bstrong\s+communication\s+skills\b(?!\s+proven)',
            r'\bgood\s+communication\s+skills\b',
            
            # Generic problem-solving
            r'\bproblem\s+solver\b(?!\s+with)',
            r'\bsolve\s+problems\b(?!\s+by)',
            
            # Vague experience claims
            r'\bextensive\s+experience\b(?!\s+in\s+[a-z]+)',
            r'\bvast\s+experience\b',
            r'\byears\s+of\s+experience\b(?!\s+in\s+[a-z]+)',
            
            # Generic passion statements
            r'\bi\s+am\s+passionate\s+about\b(?!\s+[a-z]+\s+[a-z]+)',
            r'\bpassionate\s+about\s+the\s+role\b',
            r'\bpassionate\s+about\s+the\s+position\b',
            
            # Overused enthusiasm
            r'\bi\s+would\s+love\s+to\b',
            r'\bi\s+would\s+be\s+thrilled\b',
            r'\bi\s+am\s+excited\s+about\s+the\s+opportunity\b(?!\s+to\s+[a-z]+)',
            
            # Generic fit statements
            r'\bi\s+would\s+be\s+a\s+great\s+fit\b',
            r'\bperfect\s+fit\s+for\s+this\s+role\b',
            
            # Incomplete sentences and fragments
            r'\.\s+at\s+your\s+earliest\s+convenience\s+and\s+look\s+forward\b',
            r'\bat\s+your\s+earliest\s+convenience\s+and\s+look\s+forward\b',
            r'\bideal\s+candidate\b',
            
            # Vague skill claims
            r'\bmultitasking\s+skills\b(?!\s+demonstrated)',
            r'\btime\s+management\s+skills\b(?!\s+proven)',
            r'\borganizational\s+skills\b(?!\s+evidenced)',
            
            # Generic success phrases
            r'\btrack\s+record\s+of\s+success\b(?!\s+in)',
            r'\bproven\s+track\s+record\b(?!\s+of\s+[a-z]+)',
            
            # Weak opening phrases including "for" starters
            r'\bi\s+am\s+writing\s+to\s+apply\b',
            r'\bi\s+am\s+writing\s+to\s+express\s+my\s+interest\b',
            r'\bi\s+saw\s+your\s+job\s+posting\b',
            r'\bi\s+came\s+across\s+your\s+job\s+listing\b',
            r'^for\s+the\s+[a-zA-Z\s]+\s+position\b',
            r'^for\s+this\s+[a-zA-Z\s]+\s+role\b',
            r'^for\s+your\s+consideration\b',
            r'<p>for\s+the\s+[a-zA-Z\s]+\s+position\b',
            r'<p>for\s+this\s+[a-zA-Z\s]+\s+role\b',
            
            # Passive closing phrases
            r'\bi\s+look\s+forward\s+to\s+hearing\s+from\s+you\b',
            r'\bthank\s+you\s+for\s+your\s+time\s+and\s+consideration\b',
            r'\bi\s+hope\s+to\s+hear\s+from\s+you\s+soon\b',
            r'\bi\s+would\s+welcome\s+the\s+opportunity\s+to\s+discuss\b',
            r'\bi\s+am\s+eager\s+to\s+learn\s+more\b(?!\s+about\s+[a-z]+\s+[a-z]+)',
            r'\bplease\s+feel\s+free\s+to\s+contact\s+me\b',
            r'\bi\s+am\s+available\s+for\s+an\s+interview\b',
        ]
        
        cleaned_text = text
        cliches_found = []
        
        for pattern in cliche_patterns:
            matches = re.findall(pattern, cleaned_text, flags=re.IGNORECASE)
            if matches:
                cliches_found.extend(matches)
                # Remove the clichéd phrases
                cleaned_text = re.sub(pattern, '', cleaned_text, flags=re.IGNORECASE)
        
        if cliches_found:
            # Log detected clichés for monitoring
            print(f"Detected and removed clichés: {cliches_found}")
        
        # Clean up extra spaces and newlines left by removal
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text)  # Multiple spaces to single space
        cleaned_text = re.sub(r'\n\s*\n', '\n\n', cleaned_text)  # Clean up paragraph breaks
        cleaned_text = re.sub(r'[.]{2,}', '.', cleaned_text)  # Fix multiple periods
        cleaned_text = re.sub(r'[,]{2,}', ',', cleaned_text)  # Fix multiple commas
        cleaned_text = cleaned_text.strip()
        
        return cleaned_text
    
    def _detect_work_authorization_status(self, personal_details: Dict[str, str] = None, job_description: str = None) -> str:
        """Generate neutral work authorization statement without assuming citizenship"""
        
        # Return a neutral statement that doesn't make assumptions about citizenship
        # Users should explicitly specify their work authorization status if needed
        return "I am authorized to work in Ireland and available to discuss my employment status during the interview process."
    
    async def _generate_pdfs(self, cv_data: Dict[str, Any], theme: str = "classic") -> tuple[bytes, bytes]:
        """Generate CV and cover letter PDFs"""
        if HTML is None:
            raise Exception("PDF generation library not available. Please install weasyprint")
        try:
            # Load templates (use enhanced template for better formatting)
            cv_template = self.jinja_env.get_template('cv_template_enhanced.html')
            
            # Select cover letter template based on theme
            theme_templates = {
                'classic': 'letter_template_classic.html',
                'modern': 'letter_template_modern.html', 
                'academic': 'letter_template_academic.html'
            }
            
            template_name = theme_templates.get(theme, 'letter_template_classic.html')
            letter_template = self.jinja_env.get_template(template_name)
            
            # Add current date for cover letter
            template_data = cv_data.copy()
            template_data['generation_date'] = datetime.now().strftime("%B %d, %Y")
            
            # Process work experience to highlight metrics
            if 'work_experience' in template_data:
                for exp in template_data['work_experience']:
                    if 'achievements' in exp:
                        # Highlight metrics in each achievement
                        exp['achievements'] = [
                            self._highlight_metrics_in_text(achievement) 
                            for achievement in exp['achievements']
                        ]
            
            # Extract key achievements for summary box
            template_data['key_achievements'] = self._extract_key_achievements(
                template_data.get('work_experience', [])
            )
            
            # Render HTML
            cv_html = cv_template.render(**template_data)
            letter_html = letter_template.render(**template_data)
            
            # Generate PDFs with custom options for A4 format
            from weasyprint import CSS
            
            # Custom CSS for PDF generation
            pdf_css = CSS(string="""
                @page {
                    size: A4 portrait;
                    margin: 0;                 /* Sıfır margin - template'te padding kullanıyoruz */
                }
                
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            """)
            
            cv_pdf = HTML(string=cv_html).write_pdf(stylesheets=[pdf_css])
            letter_pdf = HTML(string=letter_html).write_pdf(stylesheets=[pdf_css])
            
            return cv_pdf, letter_pdf
            
        except Exception as e:
            # Log error without exposing sensitive data
            error_msg = f"PDF generation failed: {type(e).__name__}"
            raise Exception(error_msg)


# Global service instance
cv_service = CVGeneratorService()